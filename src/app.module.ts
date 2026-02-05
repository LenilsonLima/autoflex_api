import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

import { ProductsModule } from './products/products.module';
import { RawMaterialsModule } from './raw-materials/raw-materials.module';
import { ProductMaterialsModule } from './product-materials/product-materials.module';
import { ProductionModule } from './production/production.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,

    ProductsModule,
    RawMaterialsModule,
    ProductMaterialsModule,
    ProductionModule,
  ],
})
export class AppModule {}