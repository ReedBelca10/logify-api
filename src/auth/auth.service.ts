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
  * Register with an email address and password.
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
        message: 'Registration successful',
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
  * Log in with an email address and password.
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been disabled');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update the last login timestamp.
    user.lastLogin = new Date();
    await user.save();

    const payload = { sub: user._id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
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
  * Authenticate through Firebase (Google, Apple, or another provider).
   */
  async loginWithFirebase(firebaseToken: string) {
    try {
      // Verify the Firebase token.
      const decodedToken =
        await this.firebaseService.verifyIdToken(firebaseToken);

      const { uid, email, name, picture } = decodedToken;

      if (!email) {
        throw new BadRequestException(
          'An email address is required for authentication',
        );
      }

      // Determine the identity provider.
      const provider = decodedToken.firebase.sign_in_provider || 'google';

      // Create or update the user.
      const user = await this.usersService.createOrUpdateFirebaseUser(
        uid,
        email,
        name || email.split('@')[0],
        picture,
        provider,
      );

      if (!user.isActive) {
        throw new UnauthorizedException('Your account has been disabled');
      }

      const payload = { sub: user._id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      return {
        message: 'Firebase login successful',
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
        `Firebase authentication failed: ${error.message}`,
      );
    }
  }

  /**
  * Validate a user for the JWT strategy.
   */
  async validateUser(userId: string): Promise<User> {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid user');
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
