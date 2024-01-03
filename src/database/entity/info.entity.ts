import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Info {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    weight!: string;

    @Column()
    type!: string;

    @Column()
    useBy!: string;

    @Column()
    method!: string;

    @Column()
    seller!: string;

    @Column()
    origin!: string;

    @Column({ type: 'text' })
    ingredient!: string;

    @Column()
    certification!: string;

    @Column({ type: 'text' })
    cautions!: string;

    @Column()
    qualityGuarantee!: string;

    @JoinColumn()
    @OneToOne(() => Product)
    product!: Product;
}
