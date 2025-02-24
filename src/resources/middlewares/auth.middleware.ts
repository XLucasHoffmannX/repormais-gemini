import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException(
        'Autenticação inválida! Token não fornecido.',
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      request.user = decoded;

      return true;
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException(
        'Acesso negado. Token inválido ou expirado.',
      );
    }
  }
}
