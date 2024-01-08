import { Product } from '../../../database/entity/product.entity';
import { User } from '../../../database/entity/user.entity';
import { AddProductDTO } from '../dto/addProduct.dto';
import { DeleteShoppingDTO } from '../dto/deleteShopping.dto';
import { UpdateShoppingDTO } from '../dto/updateShopping.dto';

export interface IAddProductDTO {
    addProductDTO: AddProductDTO;
    id: User['id'];
}

export interface IDeleteShoppingDTO {
    deleteShoppingDTO: DeleteShoppingDTO;
    id: User['id'];
}

export interface IUpdateShoppingDTO {
    updateShoppingDTO: UpdateShoppingDTO;
    id: User['id'];
}
