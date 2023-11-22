import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { AuthService } from './auth.service';
import { SocialLoginDTO } from './dto/socialLogin.dto';
import { asyncHandler } from '../../middleware/asyncHandler';
import Validate from '../../common/validator/validateDTO';
import { LoginDTO } from './dto/login.dto';
import accessGuard from '../../middleware/auth.guard/access.guard';
import refreshGuard from '../../middleware/auth.guard/refresh.guard';
import { UserID } from './interface/auth.interface';

class AuthController {
    router = Router();
    path = '/login';

    constructor(
        private readonly authService: AuthService, //
    ) {
        this.init();
    }

    init() {
        this.router.post(
            '/socialLogin',
            Validate.socialLogin,
            asyncHandler(this.socialLogin.bind(this)),
        );

        this.router.post(
            '/',
            Validate.login,
            asyncHandler(this.login.bind(this)),
        );

        this.router.post(
            '/logout',
            accessGuard.handle,
            asyncHandler(this.logout.bind(this)),
        );

        this.router.post(
            '/restoreAccessToken',
            refreshGuard.handle,
            asyncHandler(this.restoreAccessToken.bind(this)),
        );
    }

    async socialLogin(req: Request, res: Response) {
        res.status(200).json({
            data: await this.authService.socialLogin({
                socialLoginDTO: req.body as SocialLoginDTO,
                res,
            }),
        });
    }

    async login(req: Request, res: Response) {
        // #swagger.tags = ['Auth']
        const { id } = req.body as LoginDTO;

        res.status(200).json({
            data: await this.authService.login({ id, res }),
        });
    }

    async logout(req: Request, res: Response) {
        // #swagger.tags = ['Auth']
        res.status(200).json({
            data: await this.authService.logout(req),
        });
    }

    async restoreAccessToken(req: Request, res: Response) {
        // #swagger.tags = ['Auth']
        const { id } = req.user as UserID;

        res.status(200).json({
            data: this.authService.restoreAccessToken({ id }),
        });
    }
}

export default new AuthController(
    Container.get(AuthService), //
);
