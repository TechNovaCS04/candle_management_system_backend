import { Op } from "sequelize";
import { Supplier } from "../models";
import { mapSupplier } from "../mappers";
import { AppError, assertFound } from "../utils/AppError";
import { PaginationQuery, paginatedResponse } from "../utils/pagination";

export class SupplierService {
  async list(q: PaginationQuery) {
    const where: Record<string, unknown> = {};
    if (q.isActive !== undefined) where.is_active = q.isActive;
    if (q.search) {
      where[Op.or as unknown as string] = [
        { name: { [Op.iLike]: `%${q.search}%` } },
        { email_address: { [Op.iLike]: `%${q.search}%` } },
        { contact_no: { [Op.iLike]: `%${q.search}%` } },
      ];
    }

    const { rows, count } = await Supplier.findAndCountAll({
      where,
      limit: q.pageSize,
      offset: q.offset,
      order: [["created_at", "DESC"]],
    });

    return paginatedResponse(rows.map(mapSupplier), count, q.page, q.pageSize);
  }

  async getById(id: string) {
    return mapSupplier(assertFound(await Supplier.findByPk(id)));
  }

  async create(input: { name: string; contactNo: string; email: string; address: string }) {
    const supplier = await Supplier.create({
      name: input.name,
      contact_no: input.contactNo,
      email_address: input.email,
      address: input.address,
    });
    return mapSupplier(supplier);
  }

  async update(id: string, input: { name: string; contactNo: string; email: string; address: string }) {
    const supplier = assertFound(await Supplier.findByPk(id));
    await supplier.update({
      name: input.name,
      contact_no: input.contactNo,
      email_address: input.email,
      address: input.address,
    });
    return mapSupplier(supplier);
  }

  async setActive(id: string, isActive: boolean) {
    const supplier = assertFound(await Supplier.findByPk(id));
    supplier.is_active = isActive;
    await supplier.save();
    return mapSupplier(supplier);
  }

  async remove(id: string) {
    const supplier = assertFound(await Supplier.findByPk(id));
    await supplier.destroy();
    return { message: "Supplier deleted" };
  }
}

export const supplierService = new SupplierService();
