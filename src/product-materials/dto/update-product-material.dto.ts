import { IsNumber, IsPositive, IsOptional } from 'class-validator';

export class UpdateProductMaterialDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  requiredQuantity?: number;
}