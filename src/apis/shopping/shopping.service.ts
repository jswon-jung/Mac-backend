import { Service } from 'typedi';
import { AppDataSource } from '../../database/typeOrmConfig';
import {
    IAddProductDTO,
    IDeleteShoppingDTO,
    IUpdateShoppingDTO,
    IfetchOption,
} from './interface/shopping.interface';
import { Shopping } from '../../database/entity/shopping.entity';
import { UserService } from '../users/users.service';
import { idType } from '../../common/type';
import { Product } from '../../database/entity/product.entity';
import CustomError from '../../common/error/customError';
import { Color } from '../../database/entity/color.entity';

@Service()
export class ShoppingService {
    shoppingRepo = AppDataSource.getRepository(Shopping);
    productRepo = AppDataSource.getRepository(Product);
    colorRepo = AppDataSource.getRepository(Color);

    constructor(private readonly userService: UserService) {}

    async addProduct({ addProductDTO, id }: IAddProductDTO) {
        await this.userService.isUserByID({ id });
        const { option, productId } = addProductDTO;

        const chk = await this.shoppingRepo.findOne({
            where: {
                user: { id },
                option,
                productId,
            },
        });

        if (chk)
            throw new CustomError(
                '이미 동일한 조건의 상품이 장바구니에 있습니다',
                400,
            );
        else {
            const result = await this.shoppingRepo.save({
                ...addProductDTO,
                user: { id },
            });

            return result ? true : false;
        }
    }

    async deleteProduct({ shoppingId, id }: IDeleteShoppingDTO) {
        await this.userService.isUserByID({ id });

        for (const el of shoppingId) {
            const chk = await this.shoppingRepo.findOne({
                where: { id: el },
            });

            if (chk) {
                const result = await this.shoppingRepo.delete({
                    id: el,
                });
            } else
                throw new CustomError(
                    'shoppingId가 잘못되었습니다',
                    400,
                );
        }
        return await this.getShopping({ id });
    }

    async getShopping({ id }: idType) {
        await this.userService.isUserByID({ id });

        let priceSum = 0;

        const list = await this.shoppingRepo.find({
            where: { user: { id } },
            select: ['count', 'id', 'productId', 'option'],
        });

        const result = await Promise.all(
            list.map(async (el) => {
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
            sum: priceSum + 4000,
        };
    }

    async fetchOption({ id, productId }: IfetchOption) {
        await this.userService.isUserByID({ id });

        const chk = await this.productRepo.findOne({
            where: { id: productId },
        });

        if (chk) {
            return await this.colorRepo.find({
                where: { product: { id: productId } },
                select: ['name', 'code', 'desc'],
            });
        } else
            throw new CustomError('productId가 잘못되었습니다', 400);
    }

    async updateShopping({
        updateShoppingDTO,
        id,
    }: IUpdateShoppingDTO) {
        await this.userService.isUserByID({ id });

        if (Array.isArray(updateShoppingDTO)) {
            for (const el of updateShoppingDTO) {
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

                if (result.affected) {
                    return await this.getOrder({ id });
                }
            }
        } else {
            throw new CustomError(
                '입력값의 형식이 잘못되었습니다',
                400,
            );
        }
    }

    async getOrder({ id }: idType) {
        const user = await this.userService.isUserByID({ id });

        const list = await this.getShopping({ id });

        return {
            name: user.name,
            phone: user.phone,
            address: user.address,
            detailAddress: user.detailAddress,
            addressCode: user.addressCode,
            point: user.point,
            list,
        };
    }
}
