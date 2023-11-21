import { User } from '../../database/entity/user.entity';
import { CreateUserDTO } from '../dto/createUser.dto';

export interface IfindUserByEmail {
    email: User['email'];
}

export interface IUserCreateDTO {
    createUserDTO: CreateUserDTO;
}
