import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string = '';

    @Column()
    email: string = '';

    @Column()
    provider: string = '';

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
}
