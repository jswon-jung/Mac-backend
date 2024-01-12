import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { asyncHandler } from '../../middleware/asyncHandler';
import AccessGuard from '../../middleware/auth.guard/access.guard';
import { idType, orderIdType } from '../../common/type';
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

        this.router.get(
            '/fetchOneOrder',
            // Validate.createProduct,
            AccessGuard.handle,
            asyncHandler(this.fetchOneOrder.bind(this)),
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

    async fetchOneOrder(req: Request, res: Response) {
        // #swagger.tags = ['Order']
        const { id } = req.user as idType;
        const { orderId } = req.query as orderIdType;

        res.status(200).json({
            data: await this.orderService.fetchOneOrder({
                id,
                orderId,
            }),
        });
    }
}

export default new OrderController(Container.get(OrderService));
