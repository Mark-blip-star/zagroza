import { UserLoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getHello(data: UserLoginDto, res: any): Promise<string>;
}
