import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdateProductStatus } from './dto/update-product-status';
import { UpdateProductDto } from './dto/update-product.dto';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@Auth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @Auth(ValidRoles.admin)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  updateProductStatus(
    @Param('id') id: string,
    @Body() payload: UpdateProductStatus,
  ) {
    return this.productsService.updateProductStatus(id, payload);
  }

  @Put(':id')
  @Auth(ValidRoles.admin)
  updateProduct(@Param('id') id: string, @Body() payload: UpdateProductDto) {
    return this.productsService.updateProduct(id, payload);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id);
  // }
}
