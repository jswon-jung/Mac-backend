import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User)
    user!: User;

    @Column()
    address!: string;

    @Column()
    detailAddress!: string;

    @Column()
    addressCode!: string;

    @Column()
    orderNumber!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
