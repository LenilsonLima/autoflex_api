import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductMaterialsService } from './product-materials.service';
import { CreateProductMaterialDto } from './dto/create-product-material.dto';
import { UpdateProductMaterialDto } from './dto/update-product-material.dto';

@Controller('product-materials')
export class ProductMaterialsController {
  constructor(private readonly productMaterialsService: ProductMaterialsService) {}

  @Post()
  create(@Body() dto: CreateProductMaterialDto) {
    return this.productMaterialsService.create(dto);
  }

  @Get()
  findAll(@Query('productId') productId?: string) {
    if (productId) return this.productMaterialsService.listByProduct(BigInt(productId));
    return this.productMaterialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productMaterialsService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductMaterialDto) {
    return this.productMaterialsService.update(BigInt(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productMaterialsService.remove(BigInt(id));
  }
}