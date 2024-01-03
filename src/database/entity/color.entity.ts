import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Color {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Product)
    product!: Product;

    @Column()
    name!: string;

    @Column()
    desc!: string;

    @Column()
    code!: string;

    @Column()
    category!: string;

    @Column()
    image!: string;

    @Column()
    texture!: string;

    @Column()
    icon!: string;
}
