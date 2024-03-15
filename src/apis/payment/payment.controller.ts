import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import Validate from '../../common/validator/validateDTO';
import { PaymentService } from './payment.service';
import { asyncHandler } from '../../middleware/asyncHandler';
import { CreatePaymentDTO } from './dto/createPayment.dto';
import AccessGuard from '../../middleware/auth.guard/access.guard';
import { idType } from '../../common/type';

class PaymentController {
    router = Router();
    path = '/payment';

    constructor(private readonly paymentService: PaymentService) {
        this.init();
    }

    init() {
        this.router.post(
            '/createPayment',
            // Validate.createProduct,
            AccessGuard.handle,
            asyncHandler(this.createPayment.bind(this)),
        );
    }

    async createPayment(req: Request, res: Response) {
        // #swagger.tags = ['Payment']
        const { id } = req.user as idType;

        res.status(200).json({
            data: await this.paymentService.createPayment({
                createPaymentDTO: req.body as CreatePaymentDTO,
                id,
            }),
        });
    }
}

export default new PaymentController(Container.get(PaymentService));
