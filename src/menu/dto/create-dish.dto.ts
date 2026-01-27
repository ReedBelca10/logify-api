import { IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateDishDto {
  @IsNotEmpty({ message: 'Le nom du plat est requis' })
  name: string;

  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Le prix doit être un nombre' })
  @Min(0, { message: 'Le prix doit être positif' })
  @IsNotEmpty()
  price: number;

  @IsOptional()
  available?: boolean;
}
