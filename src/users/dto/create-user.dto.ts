import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Le nom est requis' })
  name: string;

  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, { message: 'Le mot de passe doit avoir au moins 6 caractères' })
  password: string;

  @IsEnum(['CLIENT', 'ADMIN', 'DELIVERY'], {
    message: 'Le rôle doit être CLIENT, ADMIN ou DELIVERY',
  })
  role: string;

  @IsOptional()
  phoneNumber?: string;
}
