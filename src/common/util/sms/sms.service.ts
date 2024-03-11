import RedisClient from '../../../database/redisConfig';
import { Service } from 'typedi';
import { ValidateTokenDTO } from './dto/validateToken.dto';
import coolsms from 'coolsms-node-sdk';

const mysms = coolsms;

import 'dotenv/config';
const SMS_KEY = process.env.SMS_KEY;
const SMS_SECRET = process.env.SMS_SECRET;
const SMS_SENDER = process.env.SMS_SENDER;

@Service()
export class SmsService {
    constructor(private readonly redis: RedisClient) {}

    async sendSMS(phone: string): Promise<boolean> {
        const token = this.createToken();

        const messageService = new mysms(SMS_KEY!, SMS_SECRET!);
        await messageService.sendOne({
            autoTypeDetect: true,
            to: phone,
            from: SMS_SENDER!,
            text: `[Mac] 인증번호 [${token}]를 입력해주세요.`,
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
