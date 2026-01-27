import { IsOptional, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @IsOptional()
  phoneNumber?: string;
}
