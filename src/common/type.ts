import { Product } from '../database/entity/product.entity';
import { User } from '../database/entity/user.entity';

export type categoryType = {
    category: string;
};

export type fetchProductsType = {
    id: User['id'];
    category: string;
    order: string;
};

export type fetchDetailProductType = {
    id: Product['id'];
};

export type idType = {
    id: User['id'];
};
