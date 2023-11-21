import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { AuthService } from './auth.service';
import { SocialLoginDTO } from './dto/socialLogin.dto';
import { asyncHandler } from '../../middleware/asyncHandler';
import Validate from '../../common/validator/validateDTO';

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
    }

    async socialLogin(req: Request, res: Response) {
        res.status(200).json({
            data: await this.authService.socialLogin({
                socialLoginDTO: req.body as SocialLoginDTO,
                res,
            }),
        });
    }
}

export default new AuthController(
    Container.get(AuthService), //
);
