import { Service } from 'typedi';
import { ISocialLogin } from './interface/auth.interface';
import { socialLoginData } from '../../common/util/auth/socialLoginData';

@Service()
export class AuthService {
    async socialLogin({
        socialLoginDTO,
    }: ISocialLogin): Promise<string> {
        const email = await socialLoginData({ socialLoginDTO });
        return email;
    }
}
