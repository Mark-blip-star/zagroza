import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserLoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { TokenService } from 'src/token/token.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}
  async login({ email, password }: UserLoginDto) {
    try {
      const _user = await this.userRepository.findOne({ where: { email } });
      if (_user) {
        const compared = await bcrypt.compare(password, _user.password);
        if (!compared)
          throw new HttpException('incorrectPassword', HttpStatus.UNAUTHORIZED);
        return await this.tokenService.generateToken(
          { email: _user.email },
          await this.configService.get('JWT_SECRET'),
          await this.configService.get('JWT_EXPIRE'),
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 5);
        const user = await this.userRepository.save({
          email,
          password: hashedPassword,
        });
        return await this.tokenService.generateToken(
          { email: user.email },
          await this.configService.get('JWT_SECRET'),
          await this.configService.get('JWT_EXPIRE'),
        );
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
