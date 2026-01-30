import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Nom complet de lutilisateur' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  name: string;

  @ApiProperty({ description: 'Email de lutilisateur' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @ApiProperty({ description: 'Mot de passe (min 6 caracteres)' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, { message: 'Le mot de passe doit avoir au moins 6 caracteres' })
  password: string;

  @IsOptional()
  @IsEnum(['SUPERADMIN', 'LIVREUR', 'CLIENT'], {
    message: 'Le rôle doit être SUPERADMIN, LIVREUR ou CLIENT',
  })
  role?: string;

  @ApiProperty({ description: 'Numero de telephone (optionnel)' })
  @IsOptional()
  phoneNumber?: string;
}
