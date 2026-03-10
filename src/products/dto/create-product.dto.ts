import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @IsString()
  description: string;
}
