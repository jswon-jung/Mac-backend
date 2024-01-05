import { User } from '../database/entity/user.entity';

export type categoryType = {
    category: string;
};

export type fetchProductsType = {
    id: User['id'];
    category: string;
    order: string;
};
