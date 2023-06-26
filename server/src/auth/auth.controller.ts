import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { UserLoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async getHello(
    @Body() data: UserLoginDto,
    @Res({ passthrough: true }) res,
  ): Promise<string> {
    try {
      const token = await this.authService.login(data);
      res.cookie('access_token', token, {
        maxAge: 168 * 60 * 60 * 1000,
      });
      return token;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
