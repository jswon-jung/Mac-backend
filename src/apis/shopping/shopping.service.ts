import { Service } from 'typedi';
import { AppDataSource } from '../../database/typeOrmConfig';
import {
    IAddProductDTO,
    IDeleteShoppingDTO,
    IUpdateShoppingDTO,
} from './interface/shopping.interface';
import { Shopping } from '../../database/entity/shopping.entity';
import { UserService } from '../users/users.service';
import { idType } from '../../common/type';
import { Product } from '../../database/entity/product.entity';
import CustomError from '../../common/error/customError';

@Service()
export class ShoppingService {
    shoppingRepo = AppDataSource.getRepository(Shopping);
    productRepo = AppDataSource.getRepository(Product);

    constructor(private readonly userService: UserService) {}

    async addProduct({ addProductDTO, id }: IAddProductDTO) {
        await this.userService.isUserByID({ id });

        return await this.shoppingRepo.save({
            ...addProductDTO,
            user: { id },
        });
    }

    async deleteProduct({
        deleteShoppingDTO,
        id,
    }: IDeleteShoppingDTO): Promise<boolean> {
        await this.userService.isUserByID({ id });

        const { shoppingId } = deleteShoppingDTO;

        const result = await this.shoppingRepo.delete(shoppingId);

        return result.affected ? true : false;
    }

    async getShopping({ id }: idType) {
        await this.userService.isUserByID({ id });

        let priceSum = 0;
        let deliverySum = 0;

        const list = await this.shoppingRepo.find({
            where: { user: { id } },
            select: [
                'count',
                'id',
                'productId',
                'delivery',
                'option',
            ],
        });

        const result = await Promise.all(
            list.map(async (el) => {
                deliverySum += el.delivery;
                const product = await this.productRepo.findOne({
                    where: { id: el.productId },
                    select: ['id', 'thumbnail', 'name', 'price'],
                });
                priceSum += product!.price;

                return {
                    ...el,
                    product,
                };
            }),
        );

        return {
            list: result,
            priceSum: priceSum,
            deliverySum: deliverySum,
            sum: priceSum + deliverySum,
        };
    }

    async updateShopping({
        updateShoppingDTO,
        id,
    }: IUpdateShoppingDTO): Promise<boolean> {
        await this.userService.isUserByID({ id });

        if (Array.isArray(updateShoppingDTO)) {
            updateShoppingDTO.forEach(async (el) => {
                const { shoppingId, option, count } = el;

                const updateField = {
                    option,
                    count,
                };

                if (option) updateField.option = option;
                if (count) updateField.count = count;

                const result = await this.shoppingRepo.update(
                    { id: shoppingId },
                    updateField,
                );

                if (!result.affected) return false;
            });
        } else
            throw new CustomError(
                '입력값의 형식이 잘못되었습니다',
                400,
            );
        return true;
    }

    async getOrder({ id }: idType) {
        const user = await this.userService.isUserByID({ id });

        const list = await this.shoppingRepo.find({
            where: { user: { id } },
            select: [
                'id',
                'count',
                'option',
                'delivery',
                'productId',
            ],
        });

        list.map((el) => {});

        return {
            name: user.name,
            phone: user.phone,
            address: user.address,
            detailAddress: user.detailAddress,
            list,
        };
    }
}
