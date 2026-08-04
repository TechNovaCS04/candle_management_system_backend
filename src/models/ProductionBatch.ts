import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export type ProductionStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface ProductionBatchAttributes {
  id: string;
  product_id: string;
  production_date: string;
  produced_qty: number;
  status: ProductionStatus;
  is_active: boolean;
  stock_applied: boolean;
  created_at?: Date;
}

type ProductionBatchCreation = Optional<
  ProductionBatchAttributes,
  "id" | "is_active" | "stock_applied" | "created_at"
>;

export class ProductionBatch
  extends Model<ProductionBatchAttributes, ProductionBatchCreation>
  implements ProductionBatchAttributes
{
  declare id: string;
  declare product_id: string;
  declare production_date: string;
  declare produced_qty: number;
  declare status: ProductionStatus;
  declare is_active: boolean;
  declare stock_applied: boolean;
  declare readonly created_at: Date;
}

ProductionBatch.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    product_id: { type: DataTypes.STRING(10), allowNull: false },
    production_date: { type: DataTypes.DATEONLY, allowNull: false },
    produced_qty: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PLANNED",
    },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    stock_applied: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    tableName: "production_batches",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  }
);
