import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserLoginDto } from './auth/dto/login.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
