import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';

@Injectable()
export class RawMaterialsService {
  constructor(private prisma: PrismaService) { }

  private toResponse(rm: any) {
    return {
      id: rm.id.toString(),
      code: rm.code,
      name: rm.name,
      stockQuantity: rm.stockQuantity.toString(), // Decimal → string
    };
  }

  async create(dto: CreateRawMaterialDto) {
    const created = await this.prisma.rawMaterial.create({
      data: {
        code: dto.code,
        name: dto.name,
        stockQuantity: dto.stockQuantity,
      },
    });

    return this.toResponse(created);
  }

  async findAll() {
    const list = await this.prisma.rawMaterial.findMany({ orderBy: { id: 'desc' } });
    return list.map((rm) => this.toResponse(rm));
  }

  async findOne(id: bigint) {
    const rm = await this.prisma.rawMaterial.findUnique({ where: { id } });
    if (!rm) throw new NotFoundException('Raw material not found');
    return this.toResponse(rm);
  }

  async update(id: bigint, dto: UpdateRawMaterialDto) {
    await this.findOne(id);

    const updated = await this.prisma.rawMaterial.update({
      where: { id },
      data: {
        ...(dto.code ? { code: dto.code } : {}),
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.stockQuantity !== undefined
          ? { stockQuantity: dto.stockQuantity }
          : {}),
      },
    });

    return this.toResponse(updated);
  }

  async remove(id: bigint) {
    await this.findOne(id);
    await this.prisma.rawMaterial.delete({ where: { id } });
    return { id: id.toString() };
  }
}