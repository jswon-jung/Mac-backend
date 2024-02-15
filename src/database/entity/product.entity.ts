import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Gallery } from './gallery.entity';
import { Tag } from './tag.entity';
import { Color } from './color.entity';
import { Info } from './info.entity';

export enum MAINCATEGORY_ENUM {
    LIP = 'LIP',
    EYE = 'EYE',
    FACE = 'FACE',
}

export enum SUBCATEGORY_ENUM {
    LIPSTICK = 'LIPSTICK',
    LIQUIDLIP = 'LIQUIDLIP',
    LIPBALM = 'LIPBALM',
    SHADOW = 'SHADOW',
    LINER = 'LINER',
    BROW = 'BROW',
    POWDER = 'POWDER',
    FOUNDATION = 'FOUNDATION',
    BLUSH = 'BLUSH',
    CUSHION = 'CUSHION',
    PRIMER = 'PRIMER',
    PALETTE = 'PALETTE',
}

export enum COLLECTION_ENUM {
    LISA = 'LISA',
    LUNAR = 'LUNAR',
    HOLIDAY = 'HOLIDAY',
    VIVAGLAM = 'VIVAGLAM',
    PINK = 'PINK',
    NONE = 'NONE',
}

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    thumbnail!: string;

    @OneToMany(() => Gallery, (gallery) => gallery.product)
    gallery!: Gallery[];

    @Column()
    content!: string;

    @Column()
    engName!: string;

    @Column()
    price!: number;

    @Column({ type: 'enum', enum: MAINCATEGORY_ENUM })
    mainCategory!: MAINCATEGORY_ENUM;

    @Column({ type: 'enum', enum: SUBCATEGORY_ENUM })
    subCategory!: SUBCATEGORY_ENUM;

    @Column({ type: 'enum', enum: COLLECTION_ENUM })
    collection!: COLLECTION_ENUM;

    @OneToMany(() => Tag, (tag) => tag.product)
    tag!: Tag[];

    @Column()
    weight!: string;

    @OneToMany(() => Color, (color) => color.product)
    color!: Color[];

    @Column()
    summary!: string;

    @JoinColumn()
    @OneToOne(() => Info)
    info!: Info;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ default: 0 })
    review!: number;
}
