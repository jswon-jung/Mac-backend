import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { asyncHandler } from '../../middleware/asyncHandler';
import { UserService } from './users.service';
import Validate from '../../common/validator/validateDTO';
import { SmsService } from '../../common/util/sms/sms.service';
import { SendTokenSmsDTO } from '../../common/util/sms/dto/sendTokenSMS.dto';
import { ValidateTokenDTO } from '../../common/util/sms/dto/validateToken.dto';
import { CreateUserDTO } from './dto/createUser.dto';
import { emailType } from '../../common/type';
import CustomError from '../../common/error/customError';

class UserController {
    router = Router();
    path = '/user';

    constructor(
        private readonly userService: UserService,
        private readonly smsService: SmsService,
    ) {
        this.init();
    }

    init() {
        this.router.post(
            '/sendSMS',
            Validate.sendTokenSMS,
            asyncHandler(this.sendSMS.bind(this)),
        );

        this.router.post(
            '/validateSMS',
            Validate.validateToken,
            asyncHandler(this.validateSMS.bind(this)),
        );

        this.router.post(
            '/createUser',
            Validate.createUser,
            asyncHandler(this.createUser.bind(this)),
        );

        this.router.get(
            '/getUserByEmail',
            // Validate.validateToken,
            asyncHandler(this.getUserByEmail.bind(this)),
        );
    }

    async sendSMS(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { phone } = req.body as SendTokenSmsDTO;
        res.status(200).json({
            data: await this.smsService.sendSMS(phone),
        });
    }

    async validateSMS(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        res.status(200).json({
            data: await this.smsService.validateSMS(
                req.body as ValidateTokenDTO,
            ),
        });
    }

    async createUser(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        res.status(200).json({
            data: await this.userService.createUser({
                createUserDTO: req.body as CreateUserDTO,
            }),
        });
    }

    async getUserByEmail(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { email } = req.query as emailType;

        const result = await this.userService.isUserByEmail({
            email,
        });

        if (result)
            res.status(200).json({
                data: await this.userService.isUserByEmail({
                    email,
                }),
            });
        else throw new CustomError('일치하는 이메일이 없습니다', 400);
    }
}

export default new UserController(
    Container.get(UserService),
    Container.get(SmsService),
);
