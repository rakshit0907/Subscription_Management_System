import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit: number = 20;

  @IsOptional() @IsString() @MaxLength(100)
  search?: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const skipTake = (p: { page?: number; limit?: number }) => {
  const page = p.page ?? 1;
  const limit = p.limit ?? 20;
  return { skip: (page - 1) * limit, take: limit };
};

export const paginated = <T>(data: T[], total: number, p: { page?: number; limit?: number }): Paginated<T> => ({
  data,
  total,
  page: p.page ?? 1,
  limit: p.limit ?? 20,
});
