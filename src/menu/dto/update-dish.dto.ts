import { IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDishDto {
  @ApiProperty({ description: 'Nom du plat (optionnel)', required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Description du plat (optionnel)',
    required: false,
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Prix du plat en XOF (franc CFA)',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Le prix doit être un nombre' })
  @Min(0, { message: 'Le prix doit être positif' })
  price?: number;

  @ApiProperty({
    description: 'Le plat est disponible (optionnel)',
    required: false,
  })
  @IsOptional()
  available?: boolean;
}
