import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity()
export class Shopping {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User)
    user!: User;

    @Column()
    productId!: string;

    @Column({ default: 1 })
    count: number = 1;

    @Column()
    delivery!: number;

    @Column()
    option!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
