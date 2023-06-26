import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from './interfaces/token.payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(
    payload: ITokenPayload,
    secret: string,
    expiresIn: string,
  ): Promise<string> {
    const options = {
      expiresIn,
      secret: secret,
    };
    return this.jwtService.sign(payload, options);
  }
}
