import { UserLoginDto } from './dto/login.dto';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { TokenService } from 'src/token/token.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly userRepository;
    private readonly tokenService;
    private readonly configService;
    constructor(userRepository: Repository<UserEntity>, tokenService: TokenService, configService: ConfigService);
    login({ email, password }: UserLoginDto): Promise<string>;
}
