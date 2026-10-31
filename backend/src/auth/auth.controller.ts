import { Body, Controller, Get, HttpCode, Patch, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthUser } from '../common/types/auth-user';
import { ACCESS_COOKIE } from './auth.constants';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto, SignupDto, UpdateProfileDto } from './dto/signup.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly config: ConfigService) {}

  @Public()
  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
    const { user, token } = await this.auth.signup(dto);
    this.setCookie(res, token);
    return { user };
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, token } = await this.auth.login(dto);
    this.setCookie(res, token);
    return { user };
  }

  @Public()
  @HttpCode(200)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ACCESS_COOKIE, this.cookieBase());
    return { message: 'Logged out' };
  }

  @Public()
  @HttpCode(200)
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto);
  }

  @Public()
  @HttpCode(200)
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto);
  }

  @ApiCookieAuth()
  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    return { user: await this.auth.getProfile(user.id) };
  }

  /** Lets any logged-in user (used by the customer portal "profile" page) edit their own details. */
  @ApiCookieAuth()
  @Patch('profile')
  async updateProfile(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return { user: await this.auth.updateProfile(user.id, dto) };
  }

  private cookieBase() {
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      path: '/',
    };
  }

  private setCookie(res: Response, token: string) {
    const maxAge = Number(this.config.get<string>('COOKIE_MAX_AGE_MS') ?? 86_400_000);
    res.cookie(ACCESS_COOKIE, token, { ...this.cookieBase(), maxAge });
  }
}
