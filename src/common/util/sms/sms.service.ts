import axios from 'axios';
import CryptoJS from 'crypto-js';
import RedisClient from '../../../database/redisConfig';
import { Service } from 'typedi';
import { ValidateTokenDTO } from './dto/validateToken.dto';

@Service()
export class SmsService {
    constructor(private readonly redis: RedisClient) {}

    async sendSMS(phone: string): Promise<boolean> {
        const token = this.createToken();
        const receiver = phone;
        const date = Date.now().toString();
        const uri = process.env.SMS_SERVICE_ID;
        const secretKey = process.env.SMS_SECRET_KEY!;
        const accessKey = process.env.SMS_ACCESS_KEY!;
        const method = 'POST';
        const space = ' ';
        const newLine = '\n';
        const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
        const url2 = `/sms/v2/services/${uri}/messages`;
        const hmac = CryptoJS.algo.HMAC.create(
            CryptoJS.algo.SHA256,
            secretKey,
        );
        hmac.update(method);
        hmac.update(space);
        hmac.update(url2);
        hmac.update(newLine);
        hmac.update(date);
        hmac.update(newLine);
        hmac.update(accessKey);
        const hash = hmac.finalize();
        const signature = hash.toString(CryptoJS.enc.Base64);

        axios({
            method,
            url,
            headers: {
                'Content-type': 'application/json; charset=utf-8',
                'x-ncp-iam-access-key': accessKey,
                'x-ncp-apigw-timestamp': date,
                'x-ncp-apigw-signature-v2': signature,
            },
            data: {
                type: 'SMS',
                contentType: 'COMM',
                from: process.env.SMS_SENDER,
                content: `[Mac] 인증번호 [${token}]를 입력해주세요.`,
                messages: [{ to: `${receiver}` }],
            },
        });
        await this.redis.set(phone, token, 'EX', 300);
        return true;
    }

    createToken(): number {
        const randomNumber = Math.floor(Math.random() * 100000);
        return +randomNumber.toString().padStart(5, '0');
    }

    async validateSMS(
        validateToken: ValidateTokenDTO,
    ): Promise<boolean> {
        const { token, phone } = validateToken;
        const getToken = await this.redis.get(phone);
        return +getToken! === token;
    }
}
