import { IsOptional, IsNotEmpty, MinLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Nom complet (optionnel)', required: false })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'Mot de passe (min 6 caracteres, optionnel)',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: 'Numero de telephone (optionnel)',
    required: false,
  })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Latitude (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
