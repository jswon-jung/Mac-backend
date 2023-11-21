import { CreateUserDTO } from '../apis/users/dto/createUser.dto';
import { User } from '../database/entity/user.entity';

export type createUserDTOType = CreateUserDTO;

export type phoneType = {
    phone: User['phone'];
};

export type validateTokenType = {
    token: number;
    phone: CreateUserDTO['phone'];
};
