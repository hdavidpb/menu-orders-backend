import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/auth/entities/auth.entity';

import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const { items, address, location, reference } = createOrderDto;

    const productIds = items.map((item) => item.productId);

    const uniqueProductIds = [...new Set(productIds)];

    if (uniqueProductIds.length !== productIds.length) {
      throw new BadRequestException(
        'No puedes enviar productos repetidos en la misma orden',
      );
    }

    const products = await this.productRepository.find({
      where: {
        id: In(uniqueProductIds),
      },
    });

    if (products.length !== uniqueProductIds.length) {
      throw new NotFoundException('Uno o más productos no existen');
    }

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    const orderItems: OrderItem[] = items.map((item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new NotFoundException(
          `Producto con id ${item.productId} no encontrado`,
        );
      }

      if (!product.isAvailable) {
        throw new BadRequestException(
          `El producto ${product.name} no está disponible`,
        );
      }

      const price = Number(product.price);
      const subtotal = Number((price * item.quantity).toFixed(2));

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: item.quantity,
        price,
        subtotal,
      });

      return orderItem;
    });

    const totalPrice = Number(
      orderItems
        .reduce((acc, item) => acc + Number(item.subtotal), 0)
        .toFixed(2),
    );

    const order = this.orderRepository.create({
      address,
      location,
      reference,
      totalPrice,
      user,
      items: orderItems,
    });

    return await this.orderRepository.save(order);
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: {
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Orden con id ${id} no encontrada`);
    }

    const isAdmin = user.roles.includes('admin');
    const isOwner = order.user.id === user.id;

    if (!isAdmin && !isOwner) {
      throw new BadRequestException('No tienes permisos para ver esta orden');
    }

    return order;
  }

  async findByUser(user: User) {
    return await this.orderRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const { status } = updateOrderStatusDto;

    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Orden con id ${id} no encontrada`);
    }

    order.status = status;

    await this.orderRepository.save(order);

    return order;
  }
}
