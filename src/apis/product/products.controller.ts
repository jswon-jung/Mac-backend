import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { asyncHandler } from '../../middleware/asyncHandler';
import Validate from '../../common/validator/validateDTO';
import { SendTokenSmsDTO } from '../../common/util/sms/dto/sendTokenSMS.dto';
import { ProductService } from './products.service';
import { CreateProductDTO } from './dto/createProduct.dto';

class ProductController {
    router = Router();
    path = '/product';

    constructor(private readonly productService: ProductService) {
        this.init();
    }

    init() {
        this.router.post(
            '/createProduct',
            // Validate.sendTokenSMS,
            asyncHandler(this.createProduct.bind(this)),
        );
    }

    async createProduct(req: Request, res: Response) {
        // #swagger.tags = ['Product']
        res.status(200).json({
            data: await this.productService.createProduct({
                createProductDTO: req.body as CreateProductDTO,
            }),
        });
    }
}

export default new ProductController(Container.get(ProductService));
