import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    address!: string;

    @Column()
    detailAddress!: string;

    @Column()
    productId!: string;

    @Column()
    count!: number;

    @Column()
    option!: string;

    @Column()
    orderNumber!: number;

    @CreateDateColumn()
    createdAt!: Date;
}
