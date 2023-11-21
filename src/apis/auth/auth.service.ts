import { Service } from 'typedi';
import { ISocialLogin } from './interface/auth.interface';
import { socialLoginData } from '../../common/util/auth/socialLoginData';
import { UserService } from '../users/users.service';

@Service()
export class AuthService {
    constructor(
        private readonly userService: UserService, //
    ) {}
    async socialLogin({ socialLoginDTO }: ISocialLogin) {
        const email = await socialLoginData({ socialLoginDTO });

        const isUser = await this.userService.isUserByEmail({
            email,
        });
        if (!isUser) return email;
        if (isUser) {
            //로그인 하기 (acessToken, refreshToken 발급)
        }
    }
}
