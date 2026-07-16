import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export type SaleStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

export interface SaleAttributes {
  id: string;
  customer_id: string;
  sale_date: string;
  status: SaleStatus;
  stock_applied: boolean;
  created_at?: Date;
}

type SaleCreation = Optional<SaleAttributes, "id" | "stock_applied" | "created_at">;

export class Sale extends Model<SaleAttributes, SaleCreation> implements SaleAttributes {
  declare id: string;
  declare customer_id: string;
  declare sale_date: string;
  declare status: SaleStatus;
  declare stock_applied: boolean;
  declare readonly created_at: Date;
}

Sale.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    customer_id: { type: DataTypes.UUID, allowNull: false },
    sale_date: { type: DataTypes.DATEONLY, allowNull: false },
    status: {
      type: DataTypes.ENUM("PENDING", "PROCESSING", "COMPLETED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    stock_applied: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    tableName: "sales",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  }
);
