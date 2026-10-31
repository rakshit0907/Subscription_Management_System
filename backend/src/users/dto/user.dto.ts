import { Role } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { NormalizeEmail } from '../../common/decorators/normalize-email.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsStrongPassword } from '../../common/validators/password.validator';

export class CreateStaffDto {
  @IsString() @MinLength(2) @MaxLength(100)
  name: string;

  @NormalizeEmail() @IsEmail({}, { message: 'Please enter a valid email address' }) @MaxLength(254)
  email: string;

  @IsStrongPassword() @MaxLength(64, { message: 'Password must be at most 64 characters' })
  password: string;

  @IsOptional() @IsString() @MaxLength(30)
  phone?: string;
}

export class UpdateUserDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(100)
  name?: string;

  @IsOptional() @IsString() @MaxLength(30)
  phone?: string;

  @IsOptional() @IsString() @MaxLength(150)
  company?: string;

  @IsOptional() @IsString() @MaxLength(300)
  address?: string;

  @IsOptional() @IsBoolean()
  active?: boolean;
}

export class ListUsersDto extends PaginationDto {
  @IsOptional() @IsEnum(Role)
  role?: Role;
}
