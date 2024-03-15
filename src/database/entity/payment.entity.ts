import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum PAYMENT_STATUS_ENUM {
    PAYMENT = 'PAYMENT',
    CANCEL = 'CANCEL',
}

@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    impUid!: string;

    @Column()
    amount!: number;

    @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM })
    status!: PAYMENT_STATUS_ENUM;

    @Column()
    type!: string;

    @ManyToOne(() => User)
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;
}
