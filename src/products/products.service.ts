import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // TODO: Guardar imagen
      const image = 'https://picsum.photos/600/400';
      const product = this.productsRepository.create({
        ...createProductDto,
        image,
      });

      await this.productsRepository.save(product);

      return product;
    } catch (error) {
      this.handleError(error);
    }

    return 'This action adds a new product';
  }

  handleError(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);
  }

  // findAll() {
  //   return `This action returns all products`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} product`;
  // }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
