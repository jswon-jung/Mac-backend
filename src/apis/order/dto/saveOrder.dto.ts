import { IsNumber, IsString } from 'class-validator';
import { Product } from '../../../database/entity/product.entity';
import { User } from '../../../database/entity/user.entity';
import { Shopping } from '../../../database/entity/shopping.entity';

export class SaveOrderDTO {
    @IsString()
    address!: User['address'];

    @IsString()
    detailAddress!: User['detailAddress'];

    @IsString()
    productId!: Product['id'];

    @IsNumber()
    count!: Shopping['count'];

    @IsString()
    option!: Shopping['option'];

    @IsNumber()
    orderNumber!: number;
}
