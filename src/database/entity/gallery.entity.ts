import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Gallery {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Product)
    product!: Product;

    @Column()
    gallery!: string;
}
