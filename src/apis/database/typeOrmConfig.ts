import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type:
        process.env.DATABASE_TYPE === 'mysql'
            ? process.env.DATABASE_TYPE
            : 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    entities: [__dirname + '/apis/**/*.entity.*'],
    synchronize: true,
    logging: true,
});

AppDataSource.initialize()
    .then(async () => {
        console.log('🐶🐶🐶🐶🐶 TypeOrm 연결 성공!!!!! 🐶🐶🐶🐶🐶');
    })
    .catch((error) => {
        console.log(error, 'TypeOrm 연결 실패');
    });
