import { Order } from '../../../database/entity/order.entity';
import { User } from '../../../database/entity/user.entity';
import { SaveOrderDTO } from '../dto/saveOrder.dto';

export interface ISaveOrderDTO {
    saveOrderDTO: SaveOrderDTO;
    id: User['id'];
}

export interface IFetchOneOrder {
    id: User['id'];
    orderId: Order['id'];
}
