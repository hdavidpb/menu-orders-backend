import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('order_items')
@Unique(['order', 'product'])
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  product: Product;

  @Column('int')
  quantity: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  subtotal: number;
}
