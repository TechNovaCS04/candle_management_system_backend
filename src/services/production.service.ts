import { WhereOptions } from "sequelize";
import { sequelize } from "../config/database";
import {
  BatchMaterial,
  Product,
  ProductionBatch,
  ProductionStatus,
  RawMaterial,
} from "../models";
import { mapProductionBatch } from "../mappers";
import { AppError, assertFound } from "../utils/AppError";
import { PaginationQuery, paginatedResponse } from "../utils/pagination";

const batchInclude = [
  { model: Product, as: "product" },
  { model: BatchMaterial, as: "materialsUsed", include: [{ model: RawMaterial, as: "material" }] },
];

type BatchInput = {
  productId: string;
  productionDate: string;
  quantityProduced: number;
  status: ProductionStatus;
  materialsUsed: { materialId: string; quantityUsed: number }[];
};

async function applyStockOnComplete(batchId: string, transaction: import("sequelize").Transaction) {
  const batch = assertFound(
    await ProductionBatch.findByPk(batchId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    })
  );

  if (batch.stock_applied) return;

  // fetch materials separately
  const materials = await BatchMaterial.findAll({
    where: { batch_id: batchId },
    transaction,
  });

  for (const bm of materials) {
    const material = assertFound(
      await RawMaterial.findByPk(bm.material_id, { transaction, lock: transaction.LOCK.UPDATE }),
      `Material ${bm.material_id} not found`
    );
    const nextQty = Number(material.stock_qty) - Number(bm.used_qty);
    if (nextQty < 0) {
      throw new AppError(
        `Insufficient stock for material "${material.material_name}". Available: ${material.stock_qty}, required: ${bm.used_qty}`,
        400
      );
    }
    material.stock_qty = nextQty;
    await material.save({ transaction });
  }

  const product = assertFound(
    await Product.findByPk(batch.product_id, { transaction, lock: transaction.LOCK.UPDATE }),
    "Product not found"
  );
  product.stock_qty = Number(product.stock_qty) + Number(batch.produced_qty);
  await product.save({ transaction });

  batch.stock_applied = true;
  await batch.save({ transaction });
}

export class ProductionService {
  async list(q: PaginationQuery) {
    const where: WhereOptions = {};
    if (q.isActive !== undefined) Object.assign(where, { is_active: q.isActive });

    const { rows, count } = await ProductionBatch.findAndCountAll({
      where,
      include: batchInclude,
      limit: q.pageSize,
      offset: q.offset,
      order: [["created_at", "DESC"]],
      distinct: true,
    });

    return paginatedResponse(rows.map((b) => mapProductionBatch(b as never)), count, q.page, q.pageSize);
  }

  async getById(id: string) {
    const batch = assertFound(
      await ProductionBatch.findByPk(id, { include: batchInclude })
    );
    return mapProductionBatch(batch as never);
  }

  async create(input: BatchInput) {
    assertFound(await Product.findByPk(input.productId), "Product not found");

    return sequelize.transaction(async (transaction) => {
      const batch = await ProductionBatch.create(
        {
          product_id: input.productId,
          production_date: input.productionDate,
          produced_qty: input.quantityProduced,
          status: input.status,
        },
        { transaction }
      );

      for (const m of input.materialsUsed) {
        assertFound(await RawMaterial.findByPk(m.materialId, { transaction }), "Material not found");
        await BatchMaterial.create(
          {
            batch_id: batch.id,
            material_id: m.materialId,
            used_qty: m.quantityUsed,
          },
          { transaction }
        );
      }

      if (input.status === "COMPLETED") {
        await applyStockOnComplete(batch.id, transaction);
      }

      const full = assertFound(
        await ProductionBatch.findByPk(batch.id, { include: batchInclude, transaction })
      );
      return mapProductionBatch(full as never);
    });
  }

  async update(id: string, input: BatchInput) {
    return sequelize.transaction(async (transaction) => {
      const batch = assertFound(
        await ProductionBatch.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE })
      );

      if (batch.stock_applied && input.status !== "COMPLETED") {
        throw new AppError("Cannot change status of a completed batch whose stock was already applied", 400);
      }

      assertFound(await Product.findByPk(input.productId, { transaction }), "Product not found");

      await batch.update(
        {
          product_id: input.productId,
          production_date: input.productionDate,
          produced_qty: input.quantityProduced,
          status: input.status,
        },
        { transaction }
      );

      if (!batch.stock_applied) {
        await BatchMaterial.destroy({ where: { batch_id: id }, transaction });
        for (const m of input.materialsUsed) {
          assertFound(await RawMaterial.findByPk(m.materialId, { transaction }), "Material not found");
          await BatchMaterial.create(
            {
              batch_id: id,
              material_id: m.materialId,
              used_qty: m.quantityUsed,
            },
            { transaction }
          );
        }
      }

      if (input.status === "COMPLETED" && !batch.stock_applied) {
        await applyStockOnComplete(id, transaction);
      }

      const full = assertFound(
        await ProductionBatch.findByPk(id, { include: batchInclude, transaction })
      );
      return mapProductionBatch(full as never);
    });
  }

  async remove(id: string) {
    const batch = assertFound(await ProductionBatch.findByPk(id));
    if (batch.stock_applied) {
      throw new AppError("Cannot delete a batch that already updated inventory", 400);
    }
    await BatchMaterial.destroy({ where: { batch_id: id } });
    await batch.destroy();
    return { message: "Batch deleted" };
  }
}

export const productionService = new ProductionService();