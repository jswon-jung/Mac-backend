import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { asyncHandler } from '../../middleware/asyncHandler';
import { UserService } from './users.service';
import { createUserDTOType } from '../../common/types';
import Validate from '../../common/validator/validateDTO';

class UserController {
    router = Router();
    path = '/user';

    constructor(
        private readonly userService: UserService, //
    ) {
        this.init();
    }

    init() {
        this.router.post(
            '/createUser',
            Validate.createUser,
            asyncHandler(this.createUser.bind(this)),
        );
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
    Container.get(UserService), //
);
