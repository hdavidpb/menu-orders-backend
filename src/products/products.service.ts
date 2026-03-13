import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductStatus } from './dto/update-product-status';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productsRepository.create({
        ...createProductDto,
      });

      await this.productsRepository.save(product);

      return product;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productsRepository.findOneBy({
        id: productId,
      });

      if (!product) throw new NotFoundException('Product not found');

      Object.assign(product, updateProductDto);

      await this.productsRepository.save(product);

      return product;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    try {
      const products = this.productsRepository.find({
        order: {
          createdAt: 'ASC',
        },
      });
      return products;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });

      if (!product)
        throw new NotFoundException("Product doesn't exist with id: ", id);

      return product;
    } catch (error) {
      this.handleError(error);
    }

    return `This action returns a #${id} product`;
  }

  async updateProductStatus(id: string, payload: UpdateProductStatus) {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });

      if (!product) throw new NotFoundException('Product not found');

      product.isAvailable = payload.status;

      await this.productsRepository.save(product);

      return product;
    } catch (error) {
      this.handleError(error);
    }
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }

  handleError(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);
  }
}
