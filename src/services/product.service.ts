import { Op, WhereOptions } from "sequelize";
import { Product } from "../models";
import { mapProduct } from "../mappers";
import { assertFound } from "../utils/AppError";
import { PaginationQuery, paginatedResponse } from "../utils/pagination";

export class ProductService {
  async list(q: PaginationQuery) {
    const where: WhereOptions = {};
    if (q.isActive !== undefined) Object.assign(where, { is_active: q.isActive });
    if (q.search) {
      Object.assign(where, {
        [Op.or]: [
          { product_name: { [Op.iLike]: `%${q.search}%` } },
          { category: { [Op.iLike]: `%${q.search}%` } },
        ],
      });
    }

    const { rows, count } = await Product.findAndCountAll({
      where,
      limit: q.pageSize,
      offset: q.offset,
      order: [["created_at", "DESC"]],
    });

    return paginatedResponse(rows.map(mapProduct), count, q.page, q.pageSize);
  }

  async getById(id: string) {
    return mapProduct(assertFound(await Product.findByPk(id)));
  }

  async create(input: {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    category?: string;
    imageUrl?: string;
  }) {
    const product = await Product.create({
      product_name: input.name,
      description: input.description,
      price: input.price,
      stock_qty: input.stockQuantity,
      category: input.category || null,
      image_url: input.imageUrl || null,
    });
    return mapProduct(product);
  }

  async update(
    id: string,
    input: {
      name: string;
      description: string;
      price: number;
      stockQuantity: number;
      category?: string;
      imageUrl?: string;
    }
  ) {
    const product = assertFound(await Product.findByPk(id));
    await product.update({
      product_name: input.name,
      description: input.description,
      price: input.price,
      stock_qty: input.stockQuantity,
      category: input.category || null,
      image_url: input.imageUrl || null,
    });
    return mapProduct(product);
  }

  async setActive(id: string, isActive: boolean) {
    const product = assertFound(await Product.findByPk(id));
    product.is_active = isActive;
    await product.save();
    return mapProduct(product);
  }

  async remove(id: string) {
    const product = assertFound(await Product.findByPk(id));
    await product.destroy();
    return { message: "Product deleted" };
  }
}

export const productService = new ProductService();
