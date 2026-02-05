import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductMaterialDto } from './dto/create-product-material.dto';
import { UpdateProductMaterialDto } from './dto/update-product-material.dto';

@Injectable()
export class ProductMaterialsService {
  constructor(private prisma: PrismaService) { }

  private toResponse(pm: any) {
    return {
      id: pm.id.toString(),
      productId: pm.productId.toString(),
      rawMaterialId: pm.rawMaterialId.toString(),
      requiredQuantity: pm.requiredQuantity.toString(),

      // se vier include
      product: pm.product
        ? {
          id: pm.product.id.toString(),
          code: pm.product.code,
          name: pm.product.name,
          price: pm.product.price.toString(),
        }
        : undefined,

      rawMaterial: pm.rawMaterial
        ? {
          id: pm.rawMaterial.id.toString(),
          code: pm.rawMaterial.code,
          name: pm.rawMaterial.name,
          stockQuantity: pm.rawMaterial.stockQuantity.toString(),
        }
        : undefined,
    };
  }

  async create(dto: CreateProductMaterialDto) {
    const productId = BigInt(dto.productId);
    const rawMaterialId = BigInt(dto.rawMaterialId);

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const rm = await this.prisma.rawMaterial.findUnique({ where: { id: rawMaterialId } });
    if (!rm) throw new NotFoundException('Raw material not found');

    const created = await this.prisma.productRawMaterial.create({
      data: { productId, rawMaterialId, requiredQuantity: dto.requiredQuantity },
      include: { product: true, rawMaterial: true },
    });

    return this.toResponse(created);
  }

  async findAll() {
    const list = await this.prisma.productRawMaterial.findMany({
      orderBy: { id: 'desc' },
      include: { product: true, rawMaterial: true },
    });

    return list.map((pm) => this.toResponse(pm));
  }

  async findOne(id: bigint) {
    const pm = await this.prisma.productRawMaterial.findUnique({
      where: { id },
      include: { product: true, rawMaterial: true },
    });
    if (!pm) throw new NotFoundException('Association not found');
    return this.toResponse(pm);
  }

  async update(id: bigint, dto: UpdateProductMaterialDto) {
    await this.findOne(id);

    const updated = await this.prisma.productRawMaterial.update({
      where: { id },
      data: {
        ...(dto.requiredQuantity !== undefined ? { requiredQuantity: dto.requiredQuantity } : {}),
      },
      include: { product: true, rawMaterial: true },
    });

    return this.toResponse(updated);
  }

  async remove(id: bigint) {
    await this.findOne(id);
    await this.prisma.productRawMaterial.delete({ where: { id } });
    return { id: id.toString() };
  }

  async listByProduct(productId: bigint) {
    const list = await this.prisma.productRawMaterial.findMany({
      where: { productId },
      include: { product: true, rawMaterial: true },
      orderBy: { id: 'desc' },
    });

    return list.map((pm) => this.toResponse(pm));
  }

}
