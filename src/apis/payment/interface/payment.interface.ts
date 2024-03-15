import { PAYMENT_STATUS_ENUM } from '../../../database/entity/payment.entity';
import { CreatePaymentDTO } from '../dto/createPayment.dto';

export interface ICreatePaymentDTO {
    createPaymentDTO: CreatePaymentDTO;
    id: string;
}

export interface ICheckDuplication {
    impUid: string;
}

export interface ICreate {
    impUid: string;
    amount: number;
    id: string;
    status?: PAYMENT_STATUS_ENUM;
    type: string;
}
