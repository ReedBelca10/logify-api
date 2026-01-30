import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty({ description: 'Prenom du personnel' })
  @IsNotEmpty({ message: 'Le prenom est requis' })
  prenom: string;

  @ApiProperty({ description: 'Nom du personnel' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  nom: string;

  @ApiProperty({ description: 'Email du personnel' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @ApiProperty({ description: 'Mot de passe (min 6 caracteres)' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, { message: 'Le mot de passe doit avoir au moins 6 caracteres' })
  motDePasse: string;

  @ApiProperty({
    description: 'Role: ADMIN ou LIVREUR',
    enum: ['ADMIN', 'LIVREUR'],
  })
  @IsEnum(['ADMIN', 'LIVREUR'], {
    message: 'Le role doit etre ADMIN ou LIVREUR',
  })
  role: string;

  @ApiProperty({
    description: 'Numero de telephone',
    required: true,
  })
  @IsNotEmpty({ message: 'Le numero de telephone est requis' })
  numeroTelephone: string;

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
