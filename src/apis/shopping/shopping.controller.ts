import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { ShoppingService } from './shopping.service';
import { asyncHandler } from '../../middleware/asyncHandler';
import { AddProductDTO } from './dto/addProduct.dto';
import AccessGuard from '../../middleware/auth.guard/access.guard';
import {
    idType,
    productIdType,
    shoppingIdType,
} from '../../common/type';
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

        this.router.get(
            '/fetchOption',
            // Validate.createProduct,
            AccessGuard.handle,
            asyncHandler(this.fetchOption.bind(this)),
        );

        this.router.patch(
            '/updateShopping',
            // Validate.createProduct,
            AccessGuard.handle,
            asyncHandler(this.updateShopping.bind(this)),
        );

        // this.router.get(
        //     '/getOrder',
        //     // Validate.createProduct,
        //     AccessGuard.handle,
        //     asyncHandler(this.getOrder.bind(this)),
        // );

        //todo 배송지 변경하기
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

        const { shoppingId } = req.query as shoppingIdType;

        res.status(200).json({
            data: await this.shoppingService.deleteProduct({
                shoppingId,
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

    async fetchOption(req: Request, res: Response) {
        // #swagger.tags = ['Shopping']
        const { id } = req.user as idType;
        const { productId } = req.query as productIdType;

        res.status(200).json({
            data: await this.shoppingService.fetchOption({
                id,
                productId,
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

    // async getOrder(req: Request, res: Response) {
    //     // #swagger.tags = ['Shopping']
    //     const { id } = req.user as idType;

    //     res.status(200).json({
    //         data: await this.shoppingService.getOrder({
    //             id,
    //         }),
    //     });
    // }
}

export default new ShoppingController(Container.get(ShoppingService));
