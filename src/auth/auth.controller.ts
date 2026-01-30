import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { FirebaseAuthDto } from './dto/firebase-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * Inscription locale (email/mot de passe)
   * POST /auth/register
   */
  @Post('register')
  @ApiOperation({ summary: "S'inscrire" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Connexion locale (email/mot de passe)
   * POST /auth/login
   */
  @Post('login')
  @ApiOperation({ summary: 'Se connecter' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Authentification via Firebase (Google, Facebook, etc.)
   * POST /auth/firebase
   */
  @Post('firebase')
  @ApiOperation({ summary: 'Connexion via Firebase (Google, Apple, etc.)' })
  async loginWithFirebase(@Body() firebaseAuthDto: FirebaseAuthDto) {
    return this.authService.loginWithFirebase(firebaseAuthDto.firebaseToken);
  }

  /**
   * Obtenir le profil de l'utilisateur connecté
   * GET /auth/profile
   * Nécessite un token JWT valide
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  @ApiOperation({ summary: 'Obtenir le profil utilisateur' })
  async getProfile(@CurrentUser() user: User) {
    return this.authService.getProfile(user._id as unknown as string);
  }
}
