import { Service } from 'typedi';
import { AppDataSource } from '../../database/typeOrmConfig';
import { UserService } from '../users/users.service';
import { ShoppingService } from '../shopping/shopping.service';
import { User } from '../../database/entity/user.entity';
import { Payment } from '../../database/entity/payment.entity';
import { ICheckpaid } from './interface/iamport.interface';
import axios from 'axios';
import CustomError from '../../common/error/customError';

@Service()
export class IamportService {
    userRepo = AppDataSource.getRepository(User);
    paymentRepo = AppDataSource.getRepository(Payment);

    constructor(
        private readonly userService: UserService,
        private readonly shoppingService: ShoppingService,
    ) {}

    async checkPaid({ impUid, amount }: ICheckpaid): Promise<void> {
        try {
            const token = await this.getToken();

            const getPaymentData = await axios.get(
                `https://api.iamport.kr/payments/${impUid}`,
                { headers: { Authorization: token } },
            );

            if (amount !== getPaymentData.data.response.amount)
                throw new CustomError('잘못된 결제 정보입니다.', 400);

            return getPaymentData.data.response;
        } catch (error) {
            throw new CustomError('결제 확인 에러입니다', 400);
        }
    }

    async getToken(): Promise<string> {
        try {
            const getToken = await axios({
                url: 'https://api.iamport.kr/users/getToken',
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                data: {
                    imp_key: process.env.IMP_KEY,
                    imp_secret: process.env.IMP_SECRET,
                },
            });

            return getToken.data.response.access_token;
        } catch (error) {
            throw new CustomError(
                'accessToken 발급 관련 에러입니다',
                400,
            );
        }
    }

    // async cancel({
    //     payment_impUid,
    // }: IIamportServiceCancel): Promise<number> {
    //     try {
    //         const token = await this.getToken();

    //         const result = await axios.post(
    //             'https://api.iamport.kr/payments/cancel',
    //             {
    //                 imp_uid: payment_impUid,
    //             },
    //             {
    //                 headers: { Authorization: token },
    //             },
    //         );
    //         return result.data.response.cancel_amount;
    //     } catch (error) {
    //         throw new HttpException(
    //             error.response.data.message,
    //             error.response.status,
    //         );
    //     }
    // }
}
