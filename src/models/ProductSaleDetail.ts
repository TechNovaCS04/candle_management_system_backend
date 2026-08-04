import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface ProductSaleDetailAttributes {
  id: string;
  sale_id: string;
  product_id: string;
  buy_qty: number;
  unit_price: number;
  total_amount: number;
}

type ProductSaleDetailCreation = Optional<ProductSaleDetailAttributes, "id">;

export class ProductSaleDetail
  extends Model<ProductSaleDetailAttributes, ProductSaleDetailCreation>
  implements ProductSaleDetailAttributes
{
  declare id: string;
  declare sale_id: string;
  declare product_id: string;
  declare buy_qty: number;
  declare unit_price: number;
  declare total_amount: number;
}

ProductSaleDetail.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    sale_id: { type: DataTypes.STRING(10), allowNull: false },
    product_id: { type: DataTypes.UUID, allowNull: false },
    buy_qty: { type: DataTypes.INTEGER, allowNull: false },
    unit_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  },
  {
    sequelize,
    tableName: "product_sale_details",
    underscored: true,
    timestamps: false,
  }
);
