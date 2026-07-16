import { sequelize } from "../config/database";
import {
  Customer,
  Product,
  ProductSaleDetail,
  Revenue,
  Sale,
  SaleStatus,
} from "../models";
import { mapSale } from "../mappers";
import { AppError, assertFound } from "../utils/AppError";
import { PaginationQuery, paginatedResponse } from "../utils/pagination";

const saleInclude = [
  { model: Customer, as: "customer" },
  { model: ProductSaleDetail, as: "items", include: [{ model: Product, as: "product" }] },
];

type SaleInput = {
  customerId: string;
  saleDate: string;
  status: SaleStatus;
  items: { productId: string; quantity: number; unitPrice: number }[];
};

async function applySaleCompletion(saleId: string, transaction: import("sequelize").Transaction) {
  const sale = assertFound(
    await Sale.findByPk(saleId, {
      include: [{ model: ProductSaleDetail, as: "items" }],
      transaction,
      lock: transaction.LOCK.UPDATE,
    })
  );

  if (sale.stock_applied) return;

  const items = (sale as Sale & { items?: ProductSaleDetail[] }).items ?? [];
  let total = 0;

  for (const item of items) {
    const product = assertFound(
      await Product.findByPk(item.product_id, { transaction, lock: transaction.LOCK.UPDATE }),
      `Product ${item.product_id} not found`
    );
    const nextQty = Number(product.stock_qty) - Number(item.buy_qty);
    if (nextQty < 0) {
      throw new AppError(
        `Insufficient product stock for "${product.product_name}". Available: ${product.stock_qty}, required: ${item.buy_qty}`,
        400
      );
    }
    product.stock_qty = nextQty;
    await product.save({ transaction });
    total += Number(item.total_amount);
  }

  const existingRevenue = await Revenue.findOne({ where: { sale_id: saleId }, transaction });
  if (!existingRevenue) {
    await Revenue.create(
      {
        sale_id: saleId,
        amount: total,
        received_date: sale.sale_date,
      },
      { transaction }
    );
  }

  sale.stock_applied = true;
  await sale.save({ transaction });
}

export class SalesService {
  async list(q: PaginationQuery) {
    const { rows, count } = await Sale.findAndCountAll({
      include: saleInclude,
      limit: q.pageSize,
      offset: q.offset,
      order: [["created_at", "DESC"]],
      distinct: true,
    });

    return paginatedResponse(rows.map((s) => mapSale(s as never)), count, q.page, q.pageSize);
  }

  async getById(id: string) {
    const sale = assertFound(await Sale.findByPk(id, { include: saleInclude }));
    return mapSale(sale as never);
  }

  async create(input: SaleInput) {
    assertFound(await Customer.findByPk(input.customerId), "Customer not found");

    return sequelize.transaction(async (transaction) => {
      const sale = await Sale.create(
        {
          customer_id: input.customerId,
          sale_date: input.saleDate,
          status: input.status,
        },
        { transaction }
      );

      for (const item of input.items) {
        assertFound(await Product.findByPk(item.productId, { transaction }), "Product not found");
        await ProductSaleDetail.create(
          {
            sale_id: sale.id,
            product_id: item.productId,
            buy_qty: item.quantity,
            unit_price: item.unitPrice,
            total_amount: item.quantity * item.unitPrice,
          },
          { transaction }
        );
      }

      if (input.status === "COMPLETED") {
        await applySaleCompletion(sale.id, transaction);
      }

      const full = assertFound(await Sale.findByPk(sale.id, { include: saleInclude, transaction }));
      return mapSale(full as never);
    });
  }

  async update(id: string, input: SaleInput) {
    return sequelize.transaction(async (transaction) => {
      const sale = assertFound(
        await Sale.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE })
      );

      if (sale.stock_applied && input.status !== "COMPLETED") {
        throw new AppError("Cannot change status of a completed sale whose stock was already applied", 400);
      }

      assertFound(await Customer.findByPk(input.customerId, { transaction }), "Customer not found");

      await sale.update(
        {
          customer_id: input.customerId,
          sale_date: input.saleDate,
          status: input.status,
        },
        { transaction }
      );

      if (!sale.stock_applied) {
        await ProductSaleDetail.destroy({ where: { sale_id: id }, transaction });
        for (const item of input.items) {
          assertFound(await Product.findByPk(item.productId, { transaction }), "Product not found");
          await ProductSaleDetail.create(
            {
              sale_id: id,
              product_id: item.productId,
              buy_qty: item.quantity,
              unit_price: item.unitPrice,
              total_amount: item.quantity * item.unitPrice,
            },
            { transaction }
          );
        }
      }

      if (input.status === "COMPLETED" && !sale.stock_applied) {
        await applySaleCompletion(id, transaction);
      }

      const full = assertFound(await Sale.findByPk(id, { include: saleInclude, transaction }));
      return mapSale(full as never);
    });
  }

  async remove(id: string) {
    const sale = assertFound(await Sale.findByPk(id));
    if (sale.stock_applied) {
      throw new AppError("Cannot delete a completed sale that already updated inventory", 400);
    }
    await ProductSaleDetail.destroy({ where: { sale_id: id } });
    await sale.destroy();
    return { message: "Sale deleted" };
  }
}

export const salesService = new SalesService();
