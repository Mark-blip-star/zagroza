import { IsString, IsEmail } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
