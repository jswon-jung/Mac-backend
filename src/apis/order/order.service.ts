import { Service } from 'typedi';
import { AppDataSource } from '../../database/typeOrmConfig';
import { UserService } from '../users/users.service';
import { ISaveOrderDTO } from './interface/order.interface';
import { Order } from '../../database/entity/order.entity';

@Service()
export class OrderService {
    orderRepo = AppDataSource.getRepository(Order);

    constructor(private readonly userService: UserService) {}

    async saveOrder({ saveOrderDTO, id }: ISaveOrderDTO) {
        await this.userService.isUserByID({ id });

        return await this.orderRepo.save({
            ...saveOrderDTO,
        });
    }
}
