import { IsNumber, IsString } from 'class-validator';
import { Product } from '../../../database/entity/product.entity';

export class AddProductDTO {
    @IsString()
    productId!: Product['id'];

    @IsNumber()
    count!: number;

    @IsString()
    option!: string;
}
