import { Service } from 'typedi';
import { AppDataSource } from '../../database/typeOrmConfig';
import { Product } from '../../database/entity/product.entity';
import { ICreateProductDTO } from './interface/product.interface';
import { Gallery } from '../../database/entity/gallery.entity';
import { Tag } from '../../database/entity/tag.entity';
import { Color } from '../../database/entity/color.entity';
import { Info } from '../../database/entity/info.entity';

@Service()
export class ProductService {
    productRepo = AppDataSource.getRepository(Product);
    galleryRepo = AppDataSource.getRepository(Gallery);
    tagRepo = AppDataSource.getRepository(Tag);
    colorRepo = AppDataSource.getRepository(Color);
    infoRepo = AppDataSource.getRepository(Info);

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
}
