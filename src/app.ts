import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import swaggerFile from './common/swagger/swagger-output.json';
import swaggerUi from 'swagger-ui-express';
import { Controllers } from './apis';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile, { explorer: true }),
);

Controllers.map((controller) => {
    app.use(controller.path, controller.router);
});

app.get('/', (_, res) => {
    res.send('Mac 서버가 열렸습니다!!!!');
});

app.listen(process.env.PORT, () => {
    console.log(
        '🐶🐶🐶🐶🐶 MAc 서버 오픈!!!!! 🐶🐶🐶🐶🐶',
        process.env.PORT,
    );
});
