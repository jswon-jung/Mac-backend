import { Service } from 'typedi';
import {
    IUserCreateDTO,
    IfindUserByEmail,
} from './interface/user.interface';
import { User } from '../../database/entity/user.entity';
import { AppDataSource } from '../../database/typeOrmConfig';

@Service()
export class UserService {
    userRepo = AppDataSource.getRepository(User);

    isUserByEmail({ email }: IfindUserByEmail): Promise<User | null> {
        return this.userRepo.findOne({
            where: { email },
        });
    }

    createUser({ createUserDTO }: IUserCreateDTO) {
        return this.userRepo.save({
            ...createUserDTO,
        });
    }
}
