import { Service } from 'typedi';
import { AppDataSource } from '../../database/typeOrmConfig';
import { UserService } from '../users/users.service';
import {
    IFetchOneOrder,
    ISaveOrderDTO,
} from './interface/order.interface';
import { Order } from '../../database/entity/order.entity';
import CustomError from '../../common/error/customError';
import { User } from '../../database/entity/user.entity';
import { getOrderNumber } from '../../common/util/order/getOrderNumber';
import { Shopping } from '../../database/entity/shopping.entity';
import { IsNull } from 'typeorm';
import { Product } from '../../database/entity/product.entity';

@Service()
export class OrderService {
    orderRepo = AppDataSource.getRepository(Order);
    userRepo = AppDataSource.getRepository(User);
    shoppingRepo = AppDataSource.getRepository(Shopping);
    productRepo = AppDataSource.getRepository(Product);

    constructor(private readonly userService: UserService) {}

    async saveOrder({ saveOrderDTO, id }: ISaveOrderDTO) {
        const user = await this.userService.isUserByID({ id });

        const { sum } = saveOrderDTO;

        //todo 1. price만큼 point 가지고 있는지 확인
        //todo 2. 없다면 포인트가 부족합니다 에러 전송
        //todo 3. 결제 실행
        // if (user.point < sum)
        //     throw new CustomError('보유 포인트가 부족합니다', 402);
        // else {
        //     await this.userRepo.update(
        //         { id },
        //         { point: user.point - sum },
        //     );
        // }

        //todo 4. 주문번호 생성

        let orderNumber;
        let chk;

        do {
            orderNumber = getOrderNumber();
            chk = await this.orderRepo.findOne({
                where: { orderNumber },
            });
        } while (chk);

        //todo 5. Order 저장
        const saveOrder = await this.orderRepo.save({
            ...saveOrderDTO,
            orderNumber,
            user: { id },
        });

        //todo 6. Shopping 모델 orderId 및 softDelete 실행
        const shoppingData = await this.shoppingRepo.find({
            where: { user: { id }, deletedAt: IsNull() },
        });

        for (const el of shoppingData) {
            await this.shoppingRepo.update(
                { id: el.id },
                { orderId: saveOrder.id },
            );
            await this.shoppingRepo.softDelete({
                id: el.id,
            });
        }

        // for 루프 내 모든 작업이 완료된 후에 다음 코드 실행
        return await this.fetchOneOrder({
            id,
            orderId: saveOrder.id,
        });
    }

    async fetchOneOrder({ id, orderId }: IFetchOneOrder) {
        await this.userService.isUserByID({ id });

        const info = await this.orderRepo
            .createQueryBuilder('order')
            .select([
                'order.id',
                'order.address',
                'order.detailAddress',
                'order.addressCode',
                'order.orderNumber',
                'order.createdAt',
                'user.name',
                'user.phone',
            ])
            .leftJoin('order.user', 'user')
            .orderBy('order.createdAt', 'ASC')
            .limit(4)
            .getMany();

        const list = await this.shoppingRepo
            .createQueryBuilder('shopping')
            .select([
                'shopping.count',
                'shopping.productId',
                'shopping.option',
            ])
            .where('shopping.orderId = :orderId', { orderId })
            .withDeleted()
            .andWhere('shopping.deletedAt IS NOT NULL')
            .orderBy('shopping.createdAt', 'ASC')
            .getMany();

        let sum = 0;

        const listPrice = await Promise.all(
            list.map(async (el) => {
                const price = await this.productRepo.findOne({
                    where: { id: el.productId },
                });

                sum += price!.price;

                return {
                    ...el,
                    price: price?.price,
                    name: price?.name,
                    thumbnail: price?.thumbnail,
                };
            }),
        );

        return {
            info,
            list: listPrice,
            priceSum: sum - 4000,
            sum,
        };
    }
}
