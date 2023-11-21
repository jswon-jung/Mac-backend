import { IsEmail, IsString } from 'class-validator';
import { User } from '../../../database/entity/user.entity';

export class CreateUserDTO {
    @IsEmail()
    email: User['email'];

    @IsString()
    provider: User['provider'];

    @IsString()
    phone: User['phone'];

    @IsString()
    name: User['name'];

    @IsString()
    addressCode: User['addressCode'];

    @IsString()
    address: User['address'];

    @IsString()
    detailAddress: User['detailAddress'];

    constructor(data: CreateUserDTO) {
        this.email = data.email;
        this.provider = data.provider;
        this.phone = data.phone;
        this.name = data.name;
        this.addressCode = data.addressCode;
        this.address = data.address;
        this.detailAddress = data.detailAddress;
    }
}
