import { IsNotEmpty, IsString } from 'class-validator';

export class FirebaseAuthDto {
    @IsNotEmpty({ message: 'Le token Firebase est requis' })
    @IsString({ message: 'Le token doit être une chaîne de caractères' })
    firebaseToken: string;
}
