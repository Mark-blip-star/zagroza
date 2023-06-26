import {
  Injectable,
  CanActivate,
  ExecutionContext,
  MethodNotAllowedException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configSerivce: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request: any = context.switchToHttp().getRequest();
      const data = request.headers.cookie;
      const cookieName = 'access_token';
      const regex = new RegExp(`${cookieName}=([^;]+)`);
      const match = data.match(regex);
      const accessToken = match ? match[1] : null;

      if (!data || !accessToken)
        throw new UnauthorizedException('Please provide token');

      const secret: string = this.configSerivce.get('JWT_SECRET');
      request.user = jwt.verify(accessToken, secret);
      return true;
    } catch (err) {
      console.log(err);
      throw new MethodNotAllowedException('Unauthorized');
    }
  }
}
