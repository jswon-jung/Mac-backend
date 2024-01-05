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
import { fetchProductsType } from '../../common/type';
import { UserService } from '../users/users.service';
import { productOrder } from '../../common/util/product/productOrder';

@Service()
export class ProductService {
    productRepo = AppDataSource.getRepository(Product);
    galleryRepo = AppDataSource.getRepository(Gallery);
    tagRepo = AppDataSource.getRepository(Tag);
    colorRepo = AppDataSource.getRepository(Color);
    infoRepo = AppDataSource.getRepository(Info);
    constructor(private readonly userService: UserService) {}

    async createProduct({ createProductDTO }: ICreateProductDTO) {
        const { gallery, tag, color, info, ...rest } =
            createProductDTO;

        const result = await this.productRepo.save({
            ...rest,
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
            this.infoRepo.save({
                ...info,
                product: { id: result.id },
            }),
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

    async fetchProducts({ id, category, order }: fetchProductsType) {
        id && (await this.userService.isUserByID);

        if (id) {
            await this.userService.isUserByID;
            //todo 유저 id에 해당하는 찜한 데이터 id 가져오기
        }

        if (category === 'NEW') {
            const data = await this.productRepo.find({
                select: [
                    'id',
                    'thumbnail',
                    'name',
                    'price',
                    'review',
                    'createdAt',
                ],
                relations: ['tag', 'color'],
                order: {
                    createdAt: 'ASC',
                },
            });
            //todo order 데이터 작업
            await productOrder({ data, order });

            return data;
        } else if (category === 'BEST') {
            const data = await this.productRepo.find({
                select: [
                    'id',
                    'thumbnail',
                    'name',
                    'price',
                    'review',
                    'createdAt',
                ],
                relations: ['tag', 'color'],
                order: {
                    review: 'DESC',
                },
                take: 5,
            });

            //todo order 데이터 작업
            await productOrder({ data, order });

            return data;
        } else if (category === 'LIP') {
        } else if (category === 'EYE') {
        } else if (category === 'FACE') {
        }
    }
}
