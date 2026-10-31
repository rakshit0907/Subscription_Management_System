import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { NormalizeEmail } from '../../common/decorators/normalize-email.decorator';
import { IsStrongPassword } from '../../common/validators/password.validator';

export class SignupDto {
  @IsString() @MinLength(2, { message: 'Name must be at least 2 characters' }) @MaxLength(100)
  name: string;

  @NormalizeEmail() @IsEmail({}, { message: 'Please enter a valid email address' }) @MaxLength(254)
  email: string;

  @IsStrongPassword() @MaxLength(64, { message: 'Password must be at most 64 characters' })
  password: string;

  @IsOptional() @IsString() @MaxLength(30)
  phone?: string;

  @IsOptional() @IsString() @MaxLength(150)
  company?: string;

  @IsOptional() @IsString() @MaxLength(300)
  address?: string;
}

export class LoginDto {
  @NormalizeEmail() @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsString() @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class ForgotPasswordDto {
  @NormalizeEmail() @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;
}

export class ResetPasswordDto {
  @IsString() @IsNotEmpty({ message: 'Reset token is required' })
  token: string;

  @IsStrongPassword() @MaxLength(64, { message: 'Password must be at most 64 characters' })
  password: string;
}

export class UpdateProfileDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(100)
  name?: string;

  @IsOptional() @IsString() @MaxLength(30)
  phone?: string;

  @IsOptional() @IsString() @MaxLength(150)
  company?: string;

  @IsOptional() @IsString() @MaxLength(300)
  address?: string;
}
