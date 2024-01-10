import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { asyncHandler } from '../../middleware/asyncHandler';
import AccessGuard from '../../middleware/auth.guard/access.guard';
import { idType } from '../../common/type';
import { OrderService } from './order.service';
import { SaveOrderDTO } from './dto/saveOrder.dto';

class OrderController {
    router = Router();
    path = '/order';

    constructor(private readonly orderService: OrderService) {
        this.init();
    }

    init() {
        this.router.post(
            '/saveOrder',
            // Validate.createProduct,
            AccessGuard.handle,
            asyncHandler(this.saveOrder.bind(this)),
        );
    }

    async saveOrder(req: Request, res: Response) {
        // #swagger.tags = ['Order']
        const { id } = req.user as idType;

        res.status(200).json({
            data: await this.orderService.saveOrder({
                saveOrderDTO: req.body as SaveOrderDTO,
                id,
            }),
        });
    }
}

export default new OrderController(Container.get(OrderService));
