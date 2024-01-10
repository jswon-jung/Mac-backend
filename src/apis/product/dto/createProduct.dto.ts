import { IsArray, IsNumber, IsString } from 'class-validator';
import { Product } from '../../../database/entity/product.entity';

interface colorObj {
    name: string;
    desc: string;
    code: string;
    category: string;
    image: string;
    texture: string;
    icon: string;
}

interface infoObj {
    name: string;
    weight: string;
    type: string;
    useBy: string;
    method: string;
    seller: string;
    origin: string;
    ingredient: string;
    certification: string;
    cautions: string;
    qualityGuarantee: string;
}

export class CreateProductDTO {
    @IsString()
    name: Product['name'];

    @IsString()
    thumbnail: Product['thumbnail'];

    @IsArray()
    @IsString({ each: true })
    gallery: string[];

    @IsString()
    content: Product['content'];

    @IsString()
    engName: Product['engName'];

    @IsNumber()
    price: Product['price'];

    @IsString()
    mainCategory: Product['mainCategory'];

    @IsString()
    subCategory: Product['subCategory'];

    @IsString()
    collection: Product['collection'];

    @IsArray()
    @IsString({ each: true })
    tag: string[];

    @IsString()
    weight: Product['weight'];

    color: colorObj[];

    @IsString()
    summary: Product['summary'];

    info: infoObj;

    constructor(data: CreateProductDTO) {
        this.name = data.name;
        this.thumbnail = data.thumbnail;
        this.gallery = data.gallery;
        this.content = data.content;
        this.engName = data.engName;
        this.price = data.price;
        this.mainCategory = data.mainCategory;
        this.subCategory = data.subCategory;
        this.collection = data.collection;
        this.tag = data.tag;
        this.weight = data.weight;
        this.color = data.color;
        this.summary = data.summary;
        this.info = data.info;
    }
}
