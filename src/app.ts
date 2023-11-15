import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import './apis/database/typeOrmConfig';
import swaggerFile from './common/swagger/swagger-output.json';
import swaggerUi from 'swagger-ui-express';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile, { explorer: true }),
);

app.get('/', (_, res) => {
    res.send('Mac 서버가 열렸습니다!!!!');
});

app.listen(process.env.PORT, () => {
    console.log(
        '🐶🐶🐶🐶🐶 MAc 서버 오픈!!!!! 🐶🐶🐶🐶🐶',
        process.env.PORT,
    );
});
