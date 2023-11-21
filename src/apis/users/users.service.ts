import { Service } from 'typedi';
import {
    IUserCreateDTO,
    IfindUserByEmail,
} from './interface/user.interface';
import { User } from '../database/entity/user.entity';
import { AppDataSource } from '../database/typeOrmConfig';

@Service()
export class UserService {
    userRepo = AppDataSource.getRepository(User);

    async isUserByEmail({
        email,
    }: IfindUserByEmail): Promise<boolean> {
        const user = await this.userRepo.findOne({
            where: { email },
        });
        return !!user;
    }

    createUser({ createUserDTO }: IUserCreateDTO) {
        return this.userRepo.save({
            ...createUserDTO,
        });
    }
}
