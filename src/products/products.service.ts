import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateProductDto) {
    const created = await this.prisma.product.create({
      data: {
        code: dto.code,
        name: dto.name,
        price: dto.price,
      },
    });

    return {
      id: created.id.toString(),
      code: created.code,
      name: created.name,
      price: created.price.toString(), // "120.00"
    };
  }

  private toResponse(p: any) {
    return {
      id: p.id.toString(),
      code: p.code,
      name: p.name,
      price: p.price.toString(), // "120.00"
    };
  }

  async findAll() {
    const list = await this.prisma.product.findMany({ orderBy: { id: 'desc' } });
    return list.map((p) => this.toResponse(p));
  }

  async findOne(id: bigint) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.toResponse(product);
  }

  async update(id: bigint, dto: UpdateProductDto) {
    await this.findOne(id);

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.code ? { code: dto.code } : {}),
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
      },
    });

    return this.toResponse(updated);
  }

  async remove(id: bigint) {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
    return { id: id.toString() };
  }

}