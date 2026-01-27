import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateDishDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Le prix doit être un nombre' })
  @Min(0, { message: 'Le prix doit être positif' })
  price?: number;

  @IsOptional()
  available?: boolean;
}
