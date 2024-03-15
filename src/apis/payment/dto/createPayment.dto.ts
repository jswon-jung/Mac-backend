import { IsNumber, IsString } from 'class-validator';
import { Payment } from '../../../database/entity/payment.entity';

export class CreatePaymentDTO {
    @IsString()
    impUid: Payment['impUid'];

    @IsNumber()
    amount: Payment['amount'];

    @IsString()
    type: Payment['type'];

    constructor(data: CreatePaymentDTO) {
        this.impUid = data.impUid;
        this.amount = data.amount;
        this.type = data.type;
    }
}
