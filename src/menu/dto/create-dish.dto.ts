import { IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDishDto {
  @ApiProperty({ description: 'Nom du plat' })
  @IsNotEmpty({ message: 'Le nom du plat est requis' })
  name: string;

  @ApiProperty({
    description: 'Description du plat (optionnel)',
    required: false,
  })
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Prix du plat en XOF (franc CFA)' })
  @IsNumber({}, { message: 'Le prix doit être un nombre' })
  @Min(0, { message: 'Le prix doit être positif' })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Image du plat (fichier)',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  image?: Express.Multer.File;

  @ApiProperty({
    description: 'Le plat est disponible (optionnel)',
    required: false,
  })
  @IsOptional()
  available?: boolean;
}
