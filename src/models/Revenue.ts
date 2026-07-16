import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface RevenueAttributes {
  id: string;
  sale_id: string;
  amount: number;
  received_date: string;
  is_active: boolean;
  created_at?: Date;
}

type RevenueCreation = Optional<RevenueAttributes, "id" | "is_active" | "created_at">;

export class Revenue extends Model<RevenueAttributes, RevenueCreation> implements RevenueAttributes {
  declare id: string;
  declare sale_id: string;
  declare amount: number;
  declare received_date: string;
  declare is_active: boolean;
  declare readonly created_at: Date;
}

Revenue.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    sale_id: { type: DataTypes.UUID, allowNull: false },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    received_date: { type: DataTypes.DATEONLY, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    tableName: "revenue",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  }
);
