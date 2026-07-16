import { Op, WhereOptions } from "sequelize";
import { RawMaterial, Supplier } from "../models";
import { mapRawMaterial } from "../mappers";
import { assertFound } from "../utils/AppError";
import { PaginationQuery, paginatedResponse } from "../utils/pagination";

export class MaterialService {
  async list(q: PaginationQuery) {
    const where: WhereOptions = {};
    if (q.isActive !== undefined) Object.assign(where, { is_active: q.isActive });
    if (q.search) {
      Object.assign(where, {
        material_name: { [Op.iLike]: `%${q.search}%` },
      });
    }

    const { rows, count } = await RawMaterial.findAndCountAll({
      where,
      include: [{ model: Supplier, as: "supplier" }],
      limit: q.pageSize,
      offset: q.offset,
      order: [["created_at", "DESC"]],
    });

    return paginatedResponse(
      rows.map((m) => mapRawMaterial(m as RawMaterial & { supplier?: Supplier })),
      count,
      q.page,
      q.pageSize
    );
  }

  async lowStock() {
    const all = await RawMaterial.findAll({
      where: { is_active: true },
      include: [{ model: Supplier, as: "supplier" }],
    });
    const low = all.filter((m) => Number(m.stock_qty) <= Number(m.reorder_level));
    return low.map((m) => mapRawMaterial(m as RawMaterial & { supplier?: Supplier }));
  }

  async getById(id: string) {
    const material = assertFound(
      await RawMaterial.findByPk(id, { include: [{ model: Supplier, as: "supplier" }] })
    );
    return mapRawMaterial(material as RawMaterial & { supplier?: Supplier });
  }

  async create(input: {
    name: string;
    unit: string;
    quantityInStock: number;
    reorderLevel: number;
    supplierId: string;
  }) {
    assertFound(await Supplier.findByPk(input.supplierId), "Supplier not found");
    const material = await RawMaterial.create({
      material_name: input.name,
      unit: input.unit,
      stock_qty: input.quantityInStock,
      reorder_level: input.reorderLevel,
      supplier_id: input.supplierId,
    });
    return this.getById(material.id);
  }

  async update(
    id: string,
    input: {
      name: string;
      unit: string;
      quantityInStock: number;
      reorderLevel: number;
      supplierId: string;
    }
  ) {
    const material = assertFound(await RawMaterial.findByPk(id));
    assertFound(await Supplier.findByPk(input.supplierId), "Supplier not found");
    await material.update({
      material_name: input.name,
      unit: input.unit,
      stock_qty: input.quantityInStock,
      reorder_level: input.reorderLevel,
      supplier_id: input.supplierId,
    });
    return this.getById(id);
  }

  async setActive(id: string, isActive: boolean) {
    const material = assertFound(await RawMaterial.findByPk(id));
    material.is_active = isActive;
    await material.save();
    return this.getById(id);
  }

  async remove(id: string) {
    const material = assertFound(await RawMaterial.findByPk(id));
    await material.destroy();
    return { message: "Material deleted" };
  }
}

export const materialService = new MaterialService();
