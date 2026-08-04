import { Op, WhereOptions } from "sequelize";
import {
  Customer,
  Expense,
  Product,
  ProductionBatch,
  RawMaterial,
  Revenue,
  Sale,
  Supplier,
} from "../models";
import {
  mapExpense,
  mapProductionBatch,
  mapProduct,
  mapRawMaterial,
  mapRevenue,
  mapSale,
} from "../mappers";
import { assertFound } from "../utils/AppError";
import { PaginationQuery, paginatedResponse } from "../utils/pagination";

export class FinanceService {
  async listExpenses(q: PaginationQuery) {
    const where: WhereOptions = { is_active: true };
    if (q.search) Object.assign(where, { description: { [Op.iLike]: `%${q.search}%` } });

    const { rows, count } = await Expense.findAndCountAll({
      where,
      limit: q.pageSize,
      offset: q.offset,
      order: [["expense_date", "DESC"]],
    });

    return paginatedResponse(rows.map(mapExpense), count, q.page, q.pageSize);
  }

  async getExpense(id: string) {
    return mapExpense(assertFound(await Expense.findByPk(id)));
  }

  async createExpense(input: {
    description: string;
    amount: number;
    expenseDate: string;
    category?: string;
  }) {
    const expense = await Expense.create({
      description: input.description,
      amount: input.amount,
      expense_date: input.expenseDate,
      category: input.category || null,
    });
    return mapExpense(expense);
  }

  async updateExpense(
      id: string,
      input: { description: string; amount: number; expenseDate: string; category?: string }
  ) {
    const expense = assertFound(await Expense.findByPk(id));
    await expense.update({
      description: input.description,
      amount: input.amount,
      expense_date: input.expenseDate,
      category: input.category || null,
    });
    return mapExpense(expense);
  }

  async removeExpense(id: string) {
    const expense = assertFound(await Expense.findByPk(id));
    await expense.destroy();
    return { message: "Expense deleted" };
  }

  async listRevenue(q: PaginationQuery) {
    const { rows, count } = await Revenue.findAndCountAll({
      where: { is_active: true },
      limit: q.pageSize,
      offset: q.offset,
      order: [["received_date", "DESC"]],
    });
    return paginatedResponse(rows.map(mapRevenue), count, q.page, q.pageSize);
  }

  async getRevenue(id: string) {
    return mapRevenue(assertFound(await Revenue.findByPk(id)));
  }

  async createRevenue(input: { saleId: string; amount: number; receivedDate: string }) {
    assertFound(await Sale.findByPk(input.saleId), "Sale not found");
    const revenue = await Revenue.create({
      sale_id: input.saleId,
      amount: input.amount,
      received_date: input.receivedDate,
    });
    return mapRevenue(revenue);
  }

  async updateRevenue(id: string, input: { saleId: string; amount: number; receivedDate: string }) {
    const revenue = assertFound(await Revenue.findByPk(id));
    assertFound(await Sale.findByPk(input.saleId), "Sale not found");
    await revenue.update({
      sale_id: input.saleId,
      amount: input.amount,
      received_date: input.receivedDate,
    });
    return mapRevenue(revenue);
  }

  async removeRevenue(id: string) {
    const revenue = assertFound(await Revenue.findByPk(id));
    await revenue.destroy();
    return { message: "Revenue record deleted" };
  }

  async summary(from?: string, to?: string) {
    const revenueWhere: WhereOptions = { is_active: true };
    const expenseWhere: WhereOptions = { is_active: true };
    if (from && to) {
      Object.assign(revenueWhere, { received_date: { [Op.between]: [from, to] } });
      Object.assign(expenseWhere, { expense_date: { [Op.between]: [from, to] } });
    }

    const totalRevenue = Number((await Revenue.sum("amount", { where: revenueWhere })) || 0);
    const totalExpenses = Number((await Expense.sum("amount", { where: expenseWhere })) || 0);

    return {
      totalRevenue,
      totalExpenses,
      profit: totalRevenue - totalExpenses,
    };
  }
}

export class DashboardService {
  async summary() {
    const [
      productCount,
      materials,
      openBatches,
      recentSales,
      totalRevenue,
      totalExpenses,
      completedSalesCount,
      pendingOrdersCount,
      pendingCount,
      processingCount,
      totalCustomers,
      lowStockMaterials,
    ] = await Promise.all([
      Product.count({ where: { is_active: true } }),
      RawMaterial.findAll({ where: { is_active: true } }),
      ProductionBatch.count({
        where: { status: { [Op.in]: ["PLANNED", "IN_PROGRESS"] }, is_active: true },
      }),
      Sale.findAll({
        order: [["created_at", "DESC"]],
        limit: 5,
        include: [
          { association: "customer" },
          { association: "items", include: [{ association: "product" }] },
        ],
      }),
      Revenue.sum("amount", { where: { is_active: true } }),
      Expense.sum("amount", { where: { is_active: true } }),
      Sale.count({ where: { status: "COMPLETED" } }),
      Sale.count({ where: { status: { [Op.in]: ["PENDING", "PROCESSING"] } } }),
      // Split counts for the Order Status pie chart (Active Orders card
      // keeps using the combined pendingOrdersCount above).
      Sale.count({ where: { status: "PENDING" } }),
      Sale.count({ where: { status: "PROCESSING" } }),
      Customer.count(),
      RawMaterial.findAll({
        where: { is_active: true },
        include: [{ model: Supplier, as: "supplier" }],
      }),
    ]);

    const lowStock = lowStockMaterials.filter(
        (m) => Number(m.stock_qty) <= Number(m.reorder_level)
    );
    const revenue = Number(totalRevenue || 0);
    const expenses = Number(totalExpenses || 0);

    return {
      productCount,
      lowStockCount: materials.filter((m) => Number(m.stock_qty) <= Number(m.reorder_level)).length,
      openBatches,
      completedSalesCount,
      pendingOrdersCount,
      pendingCount,
      processingCount,
      totalCustomers, // was computed but never included in the return - now fixed
      totalRevenue: revenue,
      totalExpenses: expenses,
      profit: revenue - expenses,
      recentSales: recentSales.map((s) => mapSale(s as never)),
      lowStockMaterials: lowStock.map((m) => mapRawMaterial(m as never)),
    };
  }

  async salesReport(from?: string, to?: string) {
    const where: WhereOptions = {};
    if (from && to) Object.assign(where, { sale_date: { [Op.between]: [from, to] } });

    const sales = await Sale.findAll({
      where,
      include: [
        { association: "customer" },
        { association: "items", include: [{ association: "product" }] },
      ],
      order: [["sale_date", "DESC"]],
    });

    return sales.map((s) => mapSale(s as never));
  }

  async inventoryReport() {
    const [products, materials] = await Promise.all([
      Product.findAll({ where: { is_active: true }, order: [["product_name", "ASC"]] }),
      RawMaterial.findAll({
        where: { is_active: true },
        include: [{ association: "supplier" }],
        order: [["material_name", "ASC"]],
      }),
    ]);
    return {
      products: products.map(mapProduct),
      materials: materials.map((m) => mapRawMaterial(m as never)),
    };
  }

  async productionReport(from?: string, to?: string) {
    const where: WhereOptions = { is_active: true };
    if (from && to) Object.assign(where, { production_date: { [Op.between]: [from, to] } });

    const batches = await ProductionBatch.findAll({
      where,
      include: [
        { association: "product" },
        { association: "materialsUsed", include: [{ association: "material" }] },
      ],
      order: [["production_date", "DESC"]],
    });
    return batches.map((b) => mapProductionBatch(b as never));
  }
}

export const financeService = new FinanceService();
export const dashboardService = new DashboardService();