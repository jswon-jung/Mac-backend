import { Service } from 'typedi';
import {
    IAuthGetAccessToken,
    IAuthRestoreAccessToken,
    IAuthSetRefreshToken,
    ILogin,
    ISocialLogin,
} from './interface/auth.interface';
import { socialLoginData } from '../../common/util/auth/socialLoginData';
import { UserService } from '../users/users.service';
import jwt from 'jsonwebtoken';
import { saveCookie } from '../../common/util/auth/saveCookie';
import RedisClient from '../../database/redisConfig';
import { saveBlackList } from '../../common/validator/saveBlackList';
import { Request } from 'express';

@Service()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly redis: RedisClient,
    ) {}
    async socialLogin({
        socialLoginDTO,
        res,
    }: ISocialLogin): Promise<string> {
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

    async login({ id, res }: ILogin): Promise<string> {
        await this.userService.isUserByID({ id });

        this.setRefreshToken({ id, res });

        return this.getAccessToken({ id });
    }

    async logout(req: Request): Promise<boolean> {
        const dateNow = Math.floor(Date.now() / 1000);
        const tokens = saveBlackList({ req, dateNow });

        await Promise.all([
            this.redis.set(
                `accessToken:${tokens.acc().token}`,
                'acc',
                'EX',
                tokens.acc().exp,
            ),
            this.redis.set(
                `refreshToken:${tokens.ref().token}`,
                'ref',
                'EX',
                tokens.ref().exp,
            ),
        ]);
        return true;
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
