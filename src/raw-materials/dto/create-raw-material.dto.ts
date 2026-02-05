import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateRawMaterialDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsNumber()
  @Min(0)
  stockQuantity: number;
}