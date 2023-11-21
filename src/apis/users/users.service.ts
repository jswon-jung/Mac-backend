import { Service } from 'typedi';
import {
    IUserCreateDTO,
    IfindUserByEmail,
} from './interface/user.interface';
import { User } from '../../database/entity/user.entity';
import { AppDataSource } from '../../database/typeOrmConfig';
import CustomError from '../../common/error/customError';

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
        const { email } = createUserDTO;
        const isUser = this.isUserByEmail({ email });
        if (!isUser) {
            return this.userRepo.save({
                ...createUserDTO,
            });
        } else {
            throw new CustomError(
                '이미 회원가입된 이메일입니다',
                400,
            );
        }
    }
}
