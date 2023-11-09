import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import './apis/database/typeOrmConfig';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_, res) => {
    res.send('Mac 서버가 열렸습니다!!!!');
});

app.listen(process.env.PORT, () => {
    console.log(
        '🐶🐶🐶🐶🐶 MAc 서버 오픈!!!!! 🐶🐶🐶🐶🐶',
        process.env.PORT,
    );
});
