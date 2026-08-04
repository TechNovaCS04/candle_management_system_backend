import { Op, WhereOptions } from "sequelize";
import { Customer, Sale } from "../models";
import { mapCustomer } from "../mappers";
import { assertFound } from "../utils/AppError";
import { PaginationQuery, paginatedResponse } from "../utils/pagination";

export class CustomerService {
  async list(q: PaginationQuery) {
    const where: WhereOptions = {};
    if (q.isActive !== undefined) Object.assign(where, { is_active: q.isActive });
    if (q.search) {
      Object.assign(where, {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q.search}%` } },
          { email_address: { [Op.iLike]: `%${q.search}%` } },
          { contact_no: { [Op.iLike]: `%${q.search}%` } },
        ],
      });
    }

    const { rows, count } = await Customer.findAndCountAll({
      where,
      limit: q.pageSize,
      offset: q.offset,
      order: [["created_at", "ASC"]],
    });

    const mapped = await Promise.all(
      rows.map(async (c) => {
        const totalOrders = await Sale.count({ where: { customer_id: c.id } });
        return mapCustomer(c, totalOrders);
      })
    );

    return paginatedResponse(mapped, count, q.page, q.pageSize);
  }

  async getById(id: string) {
    const customer = assertFound(await Customer.findByPk(id));
    const totalOrders = await Sale.count({ where: { customer_id: id } });
    return mapCustomer(customer, totalOrders);
  }

  async create(input: { name: string; phone: string; email: string; address: string }) {
    const customer = await Customer.create({
      name: input.name,
      contact_no: input.phone,
      email_address: input.email,
      address: input.address,
    });
    return mapCustomer(customer, 0);
  }

  async update(id: string, input: { name: string; phone: string; email: string; address: string }) {
    const customer = assertFound(await Customer.findByPk(id));
    await customer.update({
      name: input.name,
      contact_no: input.phone,
      email_address: input.email,
      address: input.address,
    });
    return this.getById(id);
  }

  async setActive(id: string, isActive: boolean) {
    const customer = assertFound(await Customer.findByPk(id));
    customer.is_active = isActive;
    await customer.save();
    return this.getById(id);
  }

  async remove(id: string) {
    const customer = assertFound(await Customer.findByPk(id));
    await customer.destroy();
    return { message: "Customer deleted" };
  }
}

export const customerService = new CustomerService();
