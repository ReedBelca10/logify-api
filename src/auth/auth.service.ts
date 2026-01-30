import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { FirebaseService } from '../config/firebase.config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private firebaseService: FirebaseService,
  ) { }

  /**
   * Inscription locale (email/mot de passe)
   */
  async register(registerDto: RegisterDto) {
    try {
      // Mapping RegisterDto to CreateUserDto handled implicitly or we construct one
      // RegisterDto has mostly same fields as CreateUserDto now
      const createUserDto = {
        ...registerDto,
        role: registerDto.role || 'CLIENT'
      } as CreateUserDto;

      const user = await this.usersService.create(createUserDto);
      const payload = { sub: user._id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      return {
        message: 'Inscription réussie',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Connexion locale (email/mot de passe)
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Votre compte a été désactivé');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Mettre à jour la date de dernière connexion
    user.lastLogin = new Date();
    await user.save();

    const payload = { sub: user._id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Connexion réussie',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoURL: user.photoURL,
      },
      accessToken,
    };
  }

  /**
   * Authentification via Firebase (Google, Facebook, etc.)
   */
  async loginWithFirebase(firebaseToken: string) {
    try {
      // Vérifier le token Firebase
      const decodedToken =
        await this.firebaseService.verifyIdToken(firebaseToken);

      const { uid, email, name, picture } = decodedToken;

      if (!email) {
        throw new BadRequestException(
          'L\'email est requis pour l\'authentification',
        );
      }

      // Déterminer le provider
      const provider = decodedToken.firebase.sign_in_provider || 'google';

      // Créer ou mettre à jour l'utilisateur
      const user = await this.usersService.createOrUpdateFirebaseUser(
        uid,
        email,
        name || email.split('@')[0],
        picture,
        provider,
      );

      if (!user.isActive) {
        throw new UnauthorizedException('Votre compte a été désactivé');
      }

      const payload = { sub: user._id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      return {
        message: 'Connexion Firebase réussie',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          photoURL: user.photoURL,
          authProvider: user.authProvider,
        },
        accessToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(
        `Échec de l'authentification Firebase: ${error.message}`,
      );
    }
  }

  /**
   * Valider un utilisateur (utilisé par la stratégie JWT)
   */
  async validateUser(userId: string): Promise<User> {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Utilisateur non valide');
    }
    return user;
  }

  /**
   * Obtenir le profil de l'utilisateur connecté
   */
  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      authProvider: user.authProvider,
      isActive: user.isActive,
    };
  }
}
