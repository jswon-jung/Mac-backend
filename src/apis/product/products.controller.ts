import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { asyncHandler } from '../../middleware/asyncHandler';
import { ProductService } from './products.service';
import { CreateProductDTO } from './dto/createProduct.dto';
import {
    categoryType,
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
            // Validate.createProduct,
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
        const { id, category, order } =
            req.query as fetchProductsType;
        res.status(200).json({
            data: await this.productService.fetchProducts({
                id,
                category,
                order,
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
}

export default new ProductController(Container.get(ProductService));
