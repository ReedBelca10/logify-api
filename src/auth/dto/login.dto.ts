import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email de lutilisateur' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Mot de passe de lutilisateur' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password: string;
}
