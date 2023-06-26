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
      const data = request.headers.authorization;
      if (!data) throw new UnauthorizedException('Please provide token');

      const secret: string = this.configSerivce.get('JWT_SECRET');
      request.user = jwt.verify(data, secret);
      return true;
    } catch (err) {
      console.log(err);
      throw new MethodNotAllowedException('Unauthorized');
    }
  }
}
