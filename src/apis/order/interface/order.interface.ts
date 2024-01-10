import { User } from '../../../database/entity/user.entity';
import { SaveOrderDTO } from '../dto/saveOrder.dto';

export interface ISaveOrderDTO {
    saveOrderDTO: SaveOrderDTO;
    id: User['id'];
}
