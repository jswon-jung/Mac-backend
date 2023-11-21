import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { SocialLoginDTO } from '../../apis/auth/dto/socialLogin.dto';
import CustomError from '../error/customError';
import { CreateUserDTO } from '../../apis/users/dto/createUser.dto';

class Validate {
    constructor() {
        this.socialLogin = asyncHandler(this.socialLogin.bind(this));
        this.createUser = asyncHandler(this.createUser.bind(this));
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
}
export default new Validate();
