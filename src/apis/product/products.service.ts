import { Service } from 'typedi';
import { AppDataSource } from '../../database/typeOrmConfig';
import {
    MAINCATEGORY_ENUM,
    Product,
} from '../../database/entity/product.entity';
import {
    ICreateProductDTO,
    IFetchBanner,
    IFetchBannerReturn,
} from './interface/product.interface';
import { Gallery } from '../../database/entity/gallery.entity';
import { Tag } from '../../database/entity/tag.entity';
import { Color } from '../../database/entity/color.entity';
import { Info } from '../../database/entity/info.entity';
import { randomProduct } from '../../common/util/product/randomProduct';
import CustomError from '../../common/error/customError';
import {
    collectionType,
    fetchDetailProductType,
    fetchProductsType,
} from '../../common/type';
import { UserService } from '../users/users.service';
import { Shopping } from '../../database/entity/shopping.entity';
import { ShoppingService } from '../shopping/shopping.service';

@Service()
export class ProductService {
    productRepo = AppDataSource.getRepository(Product);
    galleryRepo = AppDataSource.getRepository(Gallery);
    tagRepo = AppDataSource.getRepository(Tag);
    colorRepo = AppDataSource.getRepository(Color);
    infoRepo = AppDataSource.getRepository(Info);

    constructor(
        private readonly userService: UserService,
        private readonly shoppingService: ShoppingService,
    ) {}

    async createProduct({ createProductDTO }: ICreateProductDTO) {
        const { gallery, tag, color, info, ...rest } =
            createProductDTO;

        const infoData = await this.infoRepo.save({
            ...info,
        });

        const result = await this.productRepo.save({
            ...rest,
            info: { id: infoData.id },
        });

        await Promise.all([
            ...gallery.map((el) =>
                this.galleryRepo.save({
                    product: { id: result.id },
                    gallery: el,
                }),
            ),
            ...tag.map((el) =>
                this.tagRepo.save({
                    product: { id: result.id },
                    tag: el,
                }),
            ),
            ...color.map((el) =>
                this.colorRepo.save({
                    name: el.name,
                    desc: el.desc,
                    code: el.code,
                    category: el.category,
                    image: el.image,
                    texture: el.texture,
                    icon: el.icon,
                    product: { id: result.id },
                }),
            ),
        ]);

        return result;
    }

    async fetchBanner({
        category,
    }: IFetchBanner): Promise<IFetchBannerReturn[]> {
        if (category === 'ALL') {
            const data = await this.productRepo.find({
                select: ['id', 'thumbnail', 'name', 'price'],
            });
            return await randomProduct(data);
        } else if (category === 'BEST') {
            return await this.productRepo.find({
                select: ['id', 'thumbnail', 'name', 'price'],
                order: {
                    review: 'DESC',
                },
                take: 8,
            });
        } else if (category === 'NEW') {
            return await this.productRepo.find({
                select: ['id', 'thumbnail', 'name', 'price'],
                order: {
                    createdAt: 'ASC',
                },
                take: 8,
            });
        } else if (
            category === 'LIP' ||
            category === 'EYE' ||
            category === 'FACE'
        ) {
            const data = await this.productRepo.find({
                where: {
                    mainCategory:
                        MAINCATEGORY_ENUM[
                            category as keyof typeof MAINCATEGORY_ENUM
                        ],
                },
                select: ['id', 'thumbnail', 'name', 'price'],
            });
            return await randomProduct(data);
        } else
            throw new CustomError('category가 잘못되었습니다', 400);
    }

    async fetchProducts({
        id,
        category,
        order,
        count,
        page,
    }: fetchProductsType) {
        const productIds = [] as string[];
        if (id) {
            await this.userService.isUserByID({ id });

            const list = await this.shoppingService.getShopping({
                id,
            });

            list.list.forEach((el) => {
                productIds.push(el.productId);
            });
        }

        const queryBuilder = this.productRepo
            .createQueryBuilder('product')
            .select([
                'product.id',
                'product.thumbnail',
                'product.name',
                'product.price',
                'product.createdAt',
                'product.review',
                'tag.tag',
                'color.code',
                'color.name',
            ])
            .leftJoin('product.tag', 'tag')
            .leftJoin('product.color', 'color');
        // .orderBy('product.createdAt', 'ASC');

        if (category === 'ALL') {
            order === '인기순'
                ? queryBuilder
                      .orderBy('product.review', 'DESC')
                      .addOrderBy('product.createdAt', 'ASC')
                : queryBuilder.orderBy('product.createdAt', 'ASC');
        } else if (category === 'NEW') {
            queryBuilder.orderBy('product.createdAt', 'ASC');
        } else if (category === 'BEST') {
            queryBuilder
                .orderBy('product.review', 'DESC')
                .addOrderBy('product.createdAt', 'ASC');
        } else if (
            category === 'EYE' ||
            category === 'FACE' ||
            category === 'LIP'
        ) {
            order === '인기순'
                ? queryBuilder
                      .where('product.mainCategory = :mainCategory', {
                          mainCategory: category,
                      })
                      .orderBy('product.review', 'DESC')
                      .addOrderBy('product.createdAt', 'ASC')
                : queryBuilder
                      .where('product.mainCategory = :mainCategory', {
                          mainCategory: category,
                      })
                      .orderBy('product.createdAt', 'ASC');
        } else {
            order === '인기순'
                ? queryBuilder
                      .where('product.subCategory = :subCategory', {
                          subCategory: category,
                      })
                      .orderBy('product.review', 'DESC')
                      .addOrderBy('product.createdAt', 'ASC')
                : queryBuilder
                      .where('product.subCategory = :subCategory', {
                          subCategory: category,
                      })
                      .orderBy('product.createdAt', 'ASC');
        }

        if (count) return await queryBuilder.getCount();
        else {
            let result = await queryBuilder
                .skip((+page! - 1) * 12)
                .take(12)
                .getMany();
            if (id) {
                result = result.map((el) => {
                    return productIds.includes(el.id)
                        ? { ...el, isShopping: true }
                        : { ...el, isShopping: false };
                });
                return result;
            } else return result;
        }
    }

    async fetchDetailProduct({ id }: fetchDetailProductType) {
        const queryBuilder = this.productRepo
            .createQueryBuilder('product')
            .where('product.id = :id', {
                id,
            })
            .select([
                'product.id',
                'product.name',
                'product.weight',
                'product.engName',
                'product.price',
                'product.summary',
                'product.content',
                'product.mainCategory',
                'product.subCategory',
                'gallery.gallery',
                'tag.tag',
            ])
            .leftJoin('product.tag', 'tag')
            .leftJoinAndSelect('product.color', 'color')
            .leftJoin('product.gallery', 'gallery')
            .leftJoinAndSelect('product.info', 'info');

        return await queryBuilder.getOne();
    }

    async fetchCollection({ collection }: collectionType) {
        return await this.productRepo.find({
            where: { collection },
            select: ['id', 'name', 'thumbnail'],
        });
    }

    async recommendProduct() {
        return await this.productRepo
            .createQueryBuilder('product')
            .select([
                'product.id',
                'product.thumbnail',
                'product.name',
                'product.price',
            ])
            .orderBy('RAND()')
            .limit(4)
            .getMany();
    }
}
