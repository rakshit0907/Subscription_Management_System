import { BadRequestException, ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { BCRYPT_ROUNDS, FORGOT_PASSWORD_MESSAGE, RESET_TOKEN_TTL_MS } from './auth.constants';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto, SignupDto, UpdateProfileDto } from './dto/signup.dto';

const sha256 = (v: string) => createHash('sha256').update(v).digest('hex');
const DUPLICATE_EMAIL = 'An account with this email already exists';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // Compared against when the email is unknown so response time does not reveal which emails exist.
  private readonly dummyHash = bcrypt.hashSync('not-a-real-password', BCRYPT_ROUNDS);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
    private readonly users: UsersService,
  ) {}

  /** Public signup always creates a CUSTOMER. */
  async signup(dto: SignupDto) {
    if (await this.prisma.user.findUnique({ where: { email: dto.email }, select: { id: true } })) {
      throw new ConflictException(DUPLICATE_EMAIL);
    }
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name.trim(),
          email: dto.email,
          passwordHash,
          role: 'CUSTOMER',
          phone: dto.phone,
          company: dto.company,
          address: dto.address,
        },
        select: UsersService.SAFE_SELECT,
      });
      return { user, token: this.sign(user.id, user.role) };
    } catch (e) {
      // Unique constraint is the real guard; the check above only gives the friendly path.
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(DUPLICATE_EMAIL);
      }
      throw e;
    }
  }

  async login(dto: LoginDto) {
    const found = await this.prisma.user.findUnique({ where: { email: dto.email } });
    const ok = await bcrypt.compare(dto.password, found?.passwordHash ?? this.dummyHash);
    if (!found || !ok) throw new UnauthorizedException('Invalid email or password');
    if (!found.active) throw new UnauthorizedException('This account has been deactivated');

    const user = await this.users.findSafeById(found.id);
    return { user, token: this.sign(found.id, found.role) };
  }

  getProfile(userId: string) {
    return this.users.findSafeById(userId);
  }

  updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name?.trim(), phone: dto.phone, company: dto.company, address: dto.address },
      select: UsersService.SAFE_SELECT,
    });
  }

  /** Always returns the same message, whether or not the email exists. */
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (user && user.active) {
      const token = randomBytes(32).toString('hex');
      await this.prisma.$transaction([
        // Only the newest link works.
        this.prisma.passwordResetToken.updateMany({
          where: { userId: user.id, usedAt: null },
          data: { usedAt: new Date() },
        }),
        this.prisma.passwordResetToken.create({
          data: { userId: user.id, tokenHash: sha256(token), expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
        }),
      ]);
      const frontend = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
      const link = `${frontend}/reset-password?token=${token}`;
      // Not awaited: keeps response time the same for known and unknown emails.
      this.mail.sendPasswordReset(user.email, user.name, link).catch((err) =>
        this.logger.error(`Could not send reset email to ${user.email}: ${err.message}`),
      );
    }
    return { message: FORGOT_PASSWORD_MESSAGE };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const invalid = new BadRequestException('This reset link is invalid or has expired');
    const record = await this.prisma.passwordResetToken.findUnique({ where: { tokenHash: sha256(dto.token) } });
    if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) throw invalid;

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    await this.prisma.$transaction(async (tx) => {
      // Conditional update makes the token single-use even under concurrent requests.
      const claimed = await tx.passwordResetToken.updateMany({
        where: { id: record.id, usedAt: null },
        data: { usedAt: new Date() },
      });
      if (claimed.count !== 1) throw invalid;
      await tx.user.update({ where: { id: record.userId }, data: { passwordHash } });
    });
    return { message: 'Your password has been reset. You can now log in.' };
  }

  private sign(userId: string, role: string): string {
    return this.jwt.sign({ sub: userId, role });
  }
}
