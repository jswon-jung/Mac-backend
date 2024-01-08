import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Shopping } from './shopping.entity';

export enum PROVIDER_ENUM {
    GOOGLE = 'google',
    KAKAO = 'kakao',
    NAVER = 'naver',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string = '';

    @Column({ unique: true })
    email: string = '';

    @Column({ type: 'enum', enum: PROVIDER_ENUM })
    provider: PROVIDER_ENUM = PROVIDER_ENUM.GOOGLE;

    @Column()
    phone: string = '';

    @Column()
    name: string = '';

    @Column()
    addressCode: string = '';

    @Column()
    address: string = '';

    @Column()
    detailAddress: string = '';

    @OneToMany(() => Shopping, (shopping) => shopping.user)
    shopping!: Shopping[];
}
