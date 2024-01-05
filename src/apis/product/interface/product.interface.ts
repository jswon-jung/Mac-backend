import { Product } from '../../../database/entity/product.entity';
import { CreateProductDTO } from '../dto/createProduct.dto';

export interface ICreateProductDTO {
    createProductDTO: CreateProductDTO;
}

export interface IFetchBanner {
    category: string;
}

export interface IFetchBannerReturn {
    id: Product['id'];
    name: Product['name'];
    thumbnail: Product['thumbnail'];
    price: Product['price'];
}
