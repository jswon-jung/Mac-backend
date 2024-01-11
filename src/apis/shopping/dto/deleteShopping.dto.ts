import { IsString } from 'class-validator';
import { Shopping } from '../../../database/entity/shopping.entity';

export class DeleteShoppingDTO {
    @IsString()
    shoppingId!: Shopping['id'][];
}
