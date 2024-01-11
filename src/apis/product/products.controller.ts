import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { asyncHandler } from '../../middleware/asyncHandler';
import { ProductService } from './products.service';
import { CreateProductDTO } from './dto/createProduct.dto';
import Validate from '../../common/validator/validateDTO';
import {
    categoryType,
    collectionType,
    fetchDetailProductType,
    fetchProductsType,
} from '../../common/type';

class ProductController {
    router = Router();
    path = '/product';

    constructor(private readonly productService: ProductService) {
        this.init();
    }

    init() {
        this.router.post(
            '/createProduct',
            Validate.createProduct,
            asyncHandler(this.createProduct.bind(this)),
        );

        this.router.get(
            '/fetchBanner',
            asyncHandler(this.fetchBanner.bind(this)),
        );

        this.router.get(
            '/fetchProducts',
            asyncHandler(this.fetchProducts.bind(this)),
        );

        this.router.get(
            '/fetchDetailProduct',
            asyncHandler(this.fetchDetailProduct.bind(this)),
        );

        this.router.get(
            '/fetchCollection',
            asyncHandler(this.fetchCollection.bind(this)),
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

    async fetchBanner(req: Request, res: Response) {
        // #swagger.tags = ['Product']
        const category = req.query
            .category as categoryType['category'];
        res.status(200).json({
            data: await this.productService.fetchBanner({ category }),
        });
    }

    async fetchProducts(req: Request, res: Response) {
        // #swagger.tags = ['Product']
        const { id, category, order, count, page } =
            req.query as fetchProductsType;
        res.status(200).json({
            data: await this.productService.fetchProducts({
                id,
                category,
                order,
                count,
                page,
            }),
        });
    }

    async fetchDetailProduct(req: Request, res: Response) {
        // #swagger.tags = ['Product']
        const { id } = req.query as fetchDetailProductType;
        res.status(200).json({
            data: await this.productService.fetchDetailProduct({
                id,
            }),
        });
    }

    async fetchCollection(req: Request, res: Response) {
        // #swagger.tags = ['Product']
        const { collection } = req.query as collectionType;
        res.status(200).json({
            data: await this.productService.fetchCollection({
                collection,
            }),
        });
    }
}

export default new ProductController(Container.get(ProductService));
