import { Service } from 'typedi';
import {
    IUserCreateDTO,
    IfindUserByEmail,
} from './interface/user.interface';
import { User } from '../../database/entity/user.entity';
import { AppDataSource } from '../../database/typeOrmConfig';
import { UserID } from '../auth/interface/auth.interface';
import CustomError from '../../common/error/customError';

@Service()
export class UserService {
    userRepo = AppDataSource.getRepository(User);

    isUserByEmail({ email }: IfindUserByEmail): Promise<User | null> {
        return this.userRepo.findOne({
            where: { email },
        });
    }

    async isUserByID({ id }: UserID): Promise<User> {
        const isUser = await this.userRepo.findOne({
            where: { id },
        });

        if (!isUser) {
            throw new CustomError(
                'id가 일치하는 유저가 없습니다',
                400,
            );
        }
        return isUser;
    }

    async createUser({
        createUserDTO,
    }: IUserCreateDTO): Promise<User['id']> {
        const user = await this.userRepo.save({
            ...createUserDTO,
        });

        return user.id;
    }
}
