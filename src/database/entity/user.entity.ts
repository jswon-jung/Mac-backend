import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Shopping } from './shopping.entity';
import { Order } from './order.entity';

export enum PROVIDER_ENUM {
    GOOGLE = 'google',
    KAKAO = 'kakao',
    NAVER = 'naver',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ type: 'enum', enum: PROVIDER_ENUM })
    provider!: PROVIDER_ENUM;

    @Column()
    phone!: string;

    @Column()
    name!: string;

    @Column()
    addressCode!: string;

    @Column()
    address!: string;

    @Column()
    detailAddress!: string;

    @OneToMany(() => Shopping, (shopping) => shopping.user)
    shopping!: Shopping[];

    @OneToMany(() => Order, (order) => order.user)
    order!: Order[];

    @Column({ default: 0 })
    point!: number;
}
