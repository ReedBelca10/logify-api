import {
  IsNotEmpty,
  IsNumber,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeliveryRequestDto {
  @ApiProperty({ description: 'Nom de lexpéditeur' })
  @IsNotEmpty({ message: 'Le nom de lexpéditeur est requis' })
  nomExpediteur: string;

  @ApiProperty({ description: 'Prénom de lexpéditeur' })
  @IsNotEmpty({ message: 'Le prénom de lexpéditeur est requis' })
  prenomExpediteur: string;

  @ApiProperty({ description: 'Numéro de téléphone de lexpéditeur' })
  @IsNotEmpty({ message: 'Le numéro de téléphone de lexpéditeur est requis' })
  numeroTelephoneExpediteur: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @ApiProperty({
    description: 'Email de lexpéditeur (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  emailExpediteur?: string;

  @ApiProperty({ description: 'Latitude de lexpéditeur', example: 6.1252 })
  @IsNotEmpty({ message: 'La latitude de lexpéditeur est requise' })
  @Type(() => Number)
  @IsNumber()
  latitudeExpediteur: number;

  @ApiProperty({ description: 'Longitude de lexpéditeur', example: 1.2317 })
  @IsNotEmpty({ message: 'La longitude de lexpéditeur est requise' })
  @Type(() => Number)
  @IsNumber()
  longitudeExpediteur: number;

  @ApiProperty({ description: 'Nom du récepteur' })
  @IsNotEmpty({ message: 'Le nom du récepteur est requis' })
  nomRecepteur: string;

  @ApiProperty({ description: 'Prénom du récepteur' })
  @IsNotEmpty({ message: 'Le prénom du récepteur est requis' })
  prenomRecepteur: string;

  @ApiProperty({ description: 'Numéro de téléphone du récepteur' })
  @IsNotEmpty({ message: 'Le numéro de téléphone du récepteur est requis' })
  numeroTelephoneRecepteur: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @ApiProperty({
    description: 'Email du récepteur (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  emailRecepteur?: string;

  @ApiProperty({ description: 'Latitude du récepteur', example: 10.9034 })
  @IsNotEmpty({ message: 'La latitude du récepteur est requise' })
  @Type(() => Number)
  @IsNumber()
  latitudeRecepteur: number;

  @ApiProperty({ description: 'Longitude du récepteur', example: 4.934343 })
  @IsNotEmpty({ message: 'La longitude du récepteur est requise' })
  @Type(() => Number)
  @IsNumber()
  longitudeRecepteur: number;

  @ApiProperty({
    description: 'Catégorie du colis: DOC, SMALL, MEDIUM, LARGE, XL',
    enum: ['DOC', 'SMALL', 'MEDIUM', 'LARGE', 'XL'],
  })
  @IsNotEmpty({ message: 'La catégorie du colis est requise' })
  @IsEnum(['DOC', 'SMALL', 'MEDIUM', 'LARGE', 'XL'])
  categorieColis: string;

  @ApiProperty({ description: 'Photo du colis', type: 'string', format: 'binary' })
  @IsOptional()
  photoColis?: string;

  @ApiProperty({ description: 'Date et heure limite de livraison (format ISO 8601: YYYY-MM-DDTHH:mm:ss)', example: '2026-01-30T15:00:00' })
  @IsNotEmpty({ message: 'La date et heure limite est requise' })
  @IsDateString()
  dateHeureLimite: string;
}
