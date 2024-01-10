import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Shopping } from './shopping.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    address!: User['address'];

    @Column()
    detailAddress!: User['detailAddress'];

    @Column()
    productId!: Product['id'];

    @Column()
    count!: Shopping['count'];

    @Column()
    option!: Shopping['option'];

    @Column()
    orderNumber!: number;

    @CreateDateColumn()
    createdAt!: Date;
}
