import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { ShoppingService } from './shopping.service';
import { asyncHandler } from '../../middleware/asyncHandler';
import { AddProductDTO } from './dto/addProduct.dto';
import AccessGuard from '../../middleware/auth.guard/access.guard';
import { idType } from '../../common/type';
import { DeleteShoppingDTO } from './dto/deleteShopping.dto';
import { UpdateShoppingDTO } from './dto/updateShopping.dto';

class ShoppingController {
    router = Router();
    path = '/shopping';

    constructor(private readonly shoppingService: ShoppingService) {
        this.init();
    }

    init() {
        this.router.post(
            '/add',
            // Validate.createProduct,
            AccessGuard.handle,
            asyncHandler(this.addProduct.bind(this)),
        );

        this.router.delete(
            '/delete',
            // Validate.createProduct,
            AccessGuard.handle,
            asyncHandler(this.deleteProduct.bind(this)),
        );

        this.router.get(
            '/getShopping',
            // Validate.createProduct,
            AccessGuard.handle,
            asyncHandler(this.getShopping.bind(this)),
        );

        this.router.patch(
            '/update',
            // Validate.createProduct,
            AccessGuard.handle,
            asyncHandler(this.updateShopping.bind(this)),
        );

        this.router.get(
            '/getOrder',
            // Validate.createProduct,
            AccessGuard.handle,
            asyncHandler(this.getOrder.bind(this)),
        );
    }

    async addProduct(req: Request, res: Response) {
        // #swagger.tags = ['Shopping']
        const { id } = req.user as idType;

        res.status(200).json({
            data: await this.shoppingService.addProduct({
                addProductDTO: req.body as AddProductDTO,
                id,
            }),
        });
    }

    async deleteProduct(req: Request, res: Response) {
        // #swagger.tags = ['Shopping']
        const { id } = req.user as idType;

        res.status(200).json({
            data: await this.shoppingService.deleteProduct({
                deleteShoppingDTO: req.body as DeleteShoppingDTO,
                id,
            }),
        });
    }

    async getShopping(req: Request, res: Response) {
        // #swagger.tags = ['Shopping']
        const { id } = req.user as idType;

        res.status(200).json({
            data: await this.shoppingService.getShopping({
                id,
            }),
        });
    }

    async updateShopping(req: Request, res: Response) {
        // #swagger.tags = ['Shopping']
        const { id } = req.user as idType;

        res.status(200).json({
            data: await this.shoppingService.updateShopping({
                updateShoppingDTO: req.body as UpdateShoppingDTO,
                id,
            }),
        });
    }

    async getOrder(req: Request, res: Response) {
        // #swagger.tags = ['Shopping']
        const { id } = req.user as idType;

        res.status(200).json({
            data: await this.shoppingService.getOrder({
                id,
            }),
        });
    }
}

export default new ShoppingController(Container.get(ShoppingService));
