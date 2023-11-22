import { NextFunction, Request, Response } from 'express';
import { User } from '../../../database/entity/user.entity';
import { SocialLoginDTO } from '../dto/socialLogin.dto';

export interface ISocialLogin {
    socialLoginDTO: SocialLoginDTO;
    res: Response;
}

export interface ISocialLoginData {
    socialLoginDTO: SocialLoginDTO;
}

export interface UserID {
    id: User['id'];
}

export interface ILogin {
    id: User['id'];
    res: Response;
}

export interface IContext {
    req: Request;
    res: Response;
    next: NextFunction;
}

export interface UserIdAndContext extends UserID {
    res: IContext['res'];
}

export interface IAuthGetAccessToken extends UserID {}

export interface IAuthSetRefreshToken extends UserIdAndContext {}

export interface IAuthRestoreAccessToken extends UserID {}
