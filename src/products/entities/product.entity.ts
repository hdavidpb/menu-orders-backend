import { OrderItem } from 'src/orders/entities/order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column('text', {
    array: true,
    default: [],
  })
  ingredients: string[];

  @Column('text', {
    default: '',
  })
  description: string;

  @Column('bool', {
    default: true,
  })
  isAvailable: boolean;

  @Column('text', {
    default: '',
  })
  image: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
