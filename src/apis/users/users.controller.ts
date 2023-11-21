import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { asyncHandler } from '../../middleware/asyncHandler';
import { UserService } from './users.service';
import {
    createUserDTOType,
    phoneType,
    validateTokenType,
} from '../../common/types';
import Validate from '../../common/validator/validateDTO';
import { SmsService } from '../../common/util/sms/sms.service';

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
    }

    async sendSMS(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        const { phone } = req.body as phoneType;
        res.status(200).json({
            data: await this.smsService.sendSMS(phone),
        });
    }

    async validateSMS(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        res.status(200).json({
            data: await this.smsService.validateSMS(
                req.body as validateTokenType,
            ),
        });
    }

    async createUser(req: Request, res: Response) {
        // #swagger.tags = ['Users']
        res.status(200).json({
            data: await this.userService.createUser({
                createUserDTO: req.body as createUserDTOType,
            }),
        });
    }
}

export default new UserController(
    Container.get(UserService),
    Container.get(SmsService),
);
