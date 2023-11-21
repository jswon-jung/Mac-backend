import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { SocialLoginDTO } from '../../apis/auth/dto/socialLogin.dto';
import CustomError from '../error/customError';
import { CreateUserDTO } from '../../apis/users/dto/createUser.dto';
import { SendTokenSmsDTO } from '../util/sms/dto/sendTokenSMS.dto';
import { ValidateTokenDTO } from '../util/sms/dto/validateToken.dto';
import { phoneType } from '../types';

class Validate {
    constructor() {
        this.socialLogin = asyncHandler(this.socialLogin.bind(this));
        this.createUser = asyncHandler(this.createUser.bind(this));
        this.sendTokenSMS = asyncHandler(
            this.sendTokenSMS.bind(this),
        );
        this.validateToken = asyncHandler(
            this.validateToken.bind(this),
        );
    }

    async errors<T extends object>(dto: T) {
        const errors = await validate(dto);

        if (errors.length > 0) {
            const errorMessage = errors.map((error) => {
                const temp =
                    error.constraints &&
                    Object.values(error.constraints);
                return `${error.property} : ${temp}`;
            });

            throw new CustomError(errorMessage, 400);
        }
    }

    async socialLogin(req: Request, _: Response, next: NextFunction) {
        const { provider, accessToken } = req.body as SocialLoginDTO;
        await this.errors(
            new SocialLoginDTO({ provider, accessToken }),
        );
        next();
    }

    async createUser(req: Request, _: Response, next: NextFunction) {
        await this.errors(new CreateUserDTO(req.body));

        next();
    }

    async sendTokenSMS(
        req: Request,
        _: Response,
        next: NextFunction,
    ) {
        const { phone } = req.body as phoneType;
        await this.errors(new SendTokenSmsDTO({ phone }));

        next();
    }

    async validateToken(
        req: Request,
        _: Response,
        next: NextFunction,
    ) {
        await this.errors(new ValidateTokenDTO(req.body));

        next();
    }
}
export default new Validate();
