import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type SuggestionItem = {
  productId: string;
  code: string;
  name: string;
  unitPrice: string;
  quantity: number;
  total: string;
};

@Injectable()
export class ProductionService {
  constructor(private prisma: PrismaService) {}

  async suggestion() {
    const products = await this.prisma.product.findMany({
      orderBy: { price: 'desc' }, // prioridade maior valor
      include: {
        materials: { include: { rawMaterial: true } },
      },
    });

    // snapshot do estoque em memória (mutável)
    const stock = new Map<string, number>();
    const rawMaterials = await this.prisma.rawMaterial.findMany();
    for (const rm of rawMaterials) {
      stock.set(rm.id.toString(), Number(rm.stockQuantity));
    }

    const items: SuggestionItem[] = [];
    let grandTotal = 0;

    for (const p of products) {
      if (!p.materials?.length) continue;

      let maxQty = Infinity;

      for (const pm of p.materials) {
        const rmId = pm.rawMaterialId.toString();
        const available = stock.get(rmId) ?? 0;
        const required = Number(pm.requiredQuantity);

        if (required <= 0) {
          maxQty = 0;
          break;
        }

        const possible = Math.floor(available / required);
        maxQty = Math.min(maxQty, possible);
      }

      if (!isFinite(maxQty) || maxQty <= 0) continue;

      // consumir estoque
      for (const pm of p.materials) {
        const rmId = pm.rawMaterialId.toString();
        const available = stock.get(rmId) ?? 0;
        const required = Number(pm.requiredQuantity);
        stock.set(rmId, available - required * maxQty);
      }

      const unitPrice = Number(p.price);
      const total = unitPrice * maxQty;
      grandTotal += total;

      items.push({
        productId: p.id.toString(),
        code: p.code,
        name: p.name,
        unitPrice: p.price.toFixed(2),
        quantity: maxQty,
        total: total.toFixed(2),
      });
    }

    return {
      items,
      grandTotal: grandTotal.toFixed(2),
    };
  }
}