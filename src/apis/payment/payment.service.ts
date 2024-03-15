import { Service } from 'typedi';
import { AppDataSource } from '../../database/typeOrmConfig';

import {
    ICheckDuplication,
    ICreate,
    ICreatePaymentDTO,
} from './interface/payment.interface';
import { User } from '../../database/entity/user.entity';
import {
    PAYMENT_STATUS_ENUM,
    Payment,
} from '../../database/entity/payment.entity';
import { IamportService } from '../iamport/iamport.service';
import CustomError from '../../common/error/customError';

@Service()
export class PaymentService {
    paymentRepo = AppDataSource.getRepository(Payment);
    userRepo = AppDataSource.getRepository(User);

    constructor(private readonly iamportService: IamportService) {}

    async createPayment({ createPaymentDTO, id }: ICreatePaymentDTO) {
        const { impUid, amount, type } = createPaymentDTO;
        await this.iamportService.checkPaid({
            impUid,
            amount,
        });

        await this.checkDuplication({ impUid });

        return this.create({
            ...createPaymentDTO,
            id,
        });
    }

    async checkDuplication({
        impUid,
    }: ICheckDuplication): Promise<void> {
        const result = await this.paymentRepo.findOne({
            where: { impUid },
        });

        if (result)
            throw new CustomError('이미 등록된 결제입니다.', 400);
    }

    async create({
        impUid,
        amount,
        id,
        status = PAYMENT_STATUS_ENUM.PAYMENT,
        type,
    }: ICreate) {
        const payment = this.paymentRepo.save({
            impUid,
            amount,
            user: { id },
            status,
            type,
        });

        const user = await this.userRepo.findOne({
            where: { id },
        });

        const updatedUser = this.userRepo.update(
            { id },
            { point: user!.point + amount },
        );
    }
}
