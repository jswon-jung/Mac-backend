import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Shopping } from '../../../database/entity/shopping.entity';

export class UpdateShoppingDTO {
    @IsString()
    shoppingId!: Shopping['id'];

    @IsString()
    @IsOptional()
    option?: string;

    @IsNumber()
    @IsOptional()
    count?: number;
}
