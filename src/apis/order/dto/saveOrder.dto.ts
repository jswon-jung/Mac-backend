import { IsArray, IsNumber, IsString } from 'class-validator';
import { User } from '../../../database/entity/user.entity';

export class SaveOrderDTO {
    @IsString()
    address!: User['address'];

    @IsString()
    detailAddress!: User['detailAddress'];

    @IsString()
    addressCode!: User['addressCode'];

    @IsNumber()
    sum!: number;
}
