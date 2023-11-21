import { Service } from 'typedi';
import {
    IAuthGetAccessToken,
    IAuthRestoreAccessToken,
    IAuthSetRefreshToken,
    ISocialLogin,
} from './interface/auth.interface';
import { socialLoginData } from '../../common/util/auth/socialLoginData';
import { UserService } from '../users/users.service';
import jwt from 'jsonwebtoken';
import { saveCookie } from '../../common/util/auth/saveCookie';

@Service()
export class AuthService {
    constructor(
        private readonly userService: UserService, //
    ) {}
    async socialLogin({ socialLoginDTO, res }: ISocialLogin) {
        const email = await socialLoginData({ socialLoginDTO });

        const isUser = await this.userService.isUserByEmail({
            email,
        });
        if (!isUser) return email;
        else {
            this.setRefreshToken({ id: isUser.id, res });
            return this.getAccessToken({ id: isUser.id });
        }
    }

    getAccessToken({ id }: IAuthGetAccessToken): string {
        return jwt.sign({ sub: id }, process.env.JWT_ACCESS_KEY!, {
            expiresIn: '3h',
        });
    }

    setRefreshToken({ id, res }: IAuthSetRefreshToken): void {
        const refreshToken = jwt.sign(
            { sub: id },
            process.env.JWT_REFRESH_KEY!,
            { expiresIn: '2w' },
        );

        saveCookie(res, 'refreshToken', refreshToken);
    }

    restoreAccessToken({ id }: IAuthRestoreAccessToken): string {
        return this.getAccessToken({ id });
    }
}
