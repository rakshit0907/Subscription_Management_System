import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { paginated, skipTake } from '../common/dto/pagination.dto';
import { AuthUser } from '../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { BCRYPT_ROUNDS } from '../auth/auth.constants';
import { CreateStaffDto, ListUsersDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  /** Never expose passwordHash. */
  static readonly SAFE_SELECT = {
    id: true,
    name: true,
    email: true,
    role: true,
    phone: true,
    company: true,
    address: true,
    active: true,
    createdAt: true,
  } satisfies Prisma.UserSelect;

  constructor(private readonly prisma: PrismaService) {}

  async findSafeById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: UsersService.SAFE_SELECT });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createStaff(dto: CreateStaffDto) {
    if (await this.prisma.user.findUnique({ where: { email: dto.email }, select: { id: true } })) {
      throw new ConflictException('An account with this email already exists');
    }
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    try {
      return await this.prisma.user.create({
        data: { name: dto.name.trim(), email: dto.email, passwordHash, role: 'STAFF', phone: dto.phone },
        select: UsersService.SAFE_SELECT,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('An account with this email already exists');
      }
      throw e;
    }
  }

  async list(dto: ListUsersDto) {
    const search = dto.search?.trim();
    const where: Prisma.UserWhereInput = {
      ...(dto.role ? { role: dto.role } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { company: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: UsersService.SAFE_SELECT,
        orderBy: { createdAt: 'desc' },
        ...skipTake(dto),
      }),
      this.prisma.user.count({ where }),
    ]);
    return paginated(data, total, dto);
  }

  async update(id: string, dto: UpdateUserDto, actor: AuthUser) {
    await this.findSafeById(id);
    if (id === actor.id && dto.active === false) {
      throw new BadRequestException('You cannot deactivate your own account');
    }
    return this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        phone: dto.phone,
        company: dto.company,
        address: dto.address,
        active: dto.active,
      },
      select: UsersService.SAFE_SELECT,
    });
  }
}
