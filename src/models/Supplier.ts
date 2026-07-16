import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface SupplierAttributes {
  id: string;
  name: string;
  contact_no: string;
  email_address: string;
  address: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

type SupplierCreation = Optional<SupplierAttributes, "id" | "is_active" | "created_at" | "updated_at">;

export class Supplier extends Model<SupplierAttributes, SupplierCreation> implements SupplierAttributes {
  declare id: string;
  declare name: string;
  declare contact_no: string;
  declare email_address: string;
  declare address: string;
  declare is_active: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Supplier.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    contact_no: { type: DataTypes.STRING(50), allowNull: false },
    email_address: { type: DataTypes.STRING(255), allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    tableName: "suppliers",
    underscored: true,
    timestamps: true,
  }
);
