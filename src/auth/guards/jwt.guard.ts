import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(
    err: unknown,
    user: any,
    info: unknown,
    context: ExecutionContext,
  ): any {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader =
      request && request.headers ? request.headers.authorization : undefined;

    console.log('Headers reçus:', request.headers);
    console.log('Authorization header:', authHeader);
    console.log('JwtAuthGuard - Error:', err);
    console.log('JwtAuthGuard - User:', user);
    console.log('JwtAuthGuard - Info:', info);

    if (err || !user) {
      if (err instanceof Error) throw err;
      throw new UnauthorizedException('Token invalide ou absent');
    }

    return user;
  }
}
