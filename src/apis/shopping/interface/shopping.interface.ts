import { Product } from '../../../database/entity/product.entity';
import { Shopping } from '../../../database/entity/shopping.entity';
import { User } from '../../../database/entity/user.entity';
import { AddProductDTO } from '../dto/addProduct.dto';
import { UpdateShoppingDTO } from '../dto/updateShopping.dto';

export interface IAddProductDTO {
    addProductDTO: AddProductDTO;
    id: User['id'];
}

export interface IDeleteShoppingDTO {
    shoppingId: Shopping['id'];
    id: User['id'];
}

export interface IUpdateShoppingDTO {
    updateShoppingDTO: UpdateShoppingDTO;
    id: User['id'];
}

export interface IfetchOption {
    id: User['id'];
    productId: Product['id'];
}
