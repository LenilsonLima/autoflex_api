import { IsNumber, IsPositive } from 'class-validator';

export class CreateProductMaterialDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  rawMaterialId: number;

  @IsNumber()
  @IsPositive()
  requiredQuantity: number;
}