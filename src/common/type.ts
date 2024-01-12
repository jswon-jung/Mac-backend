import { Order } from '../database/entity/order.entity';
import { Product } from '../database/entity/product.entity';
import { Shopping } from '../database/entity/shopping.entity';
import { User } from '../database/entity/user.entity';

export type categoryType = {
    category: string;
};

export type fetchProductsType = {
    id?: User['id'];
    category: string;
    order?: string;
    count?: string;
    page?: string;
};

export type collectionType = {
    collection: Product['collection'];
};

export type fetchDetailProductType = {
    id: Product['id'];
};

export type idType = {
    id: User['id'];
};

export type orderIdType = {
    orderId: Order['id'];
};

export type emailType = {
    email: User['email'];
};

export type productIdType = {
    productId: Product['id'];
};

export type shoppingIdType = {
    shoppingId: Shopping['id'];
};
