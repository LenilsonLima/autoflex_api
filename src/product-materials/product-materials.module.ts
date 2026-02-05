import { Module } from '@nestjs/common';
import { ProductMaterialsService } from './product-materials.service';
import { ProductMaterialsController } from './product-materials.controller';

@Module({
  controllers: [ProductMaterialsController],
  providers: [ProductMaterialsService],
})
export class ProductMaterialsModule {}
