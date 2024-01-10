import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
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
    option!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
