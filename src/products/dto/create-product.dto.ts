import { IsArray, IsNumber, IsString, IsBoolean } from 'class-validator';

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

  @IsBoolean()
  isAvailable: boolean;

  @IsString()
  image: string;
}
