import { IsEnum } from 'class-validator';
import { OrderStatus } from '../interfaces/order-status';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
