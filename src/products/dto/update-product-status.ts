import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateProductStatus {
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
