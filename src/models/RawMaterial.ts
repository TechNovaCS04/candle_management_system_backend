import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface RawMaterialAttributes {
  id: string;
  supplier_id: string;
  material_name: string;
  stock_qty: number;
  reorder_level: number;
  unit: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

type RawMaterialCreation = Optional<
  RawMaterialAttributes,
  "id" | "is_active" | "created_at" | "updated_at"
>;

export class RawMaterial
  extends Model<RawMaterialAttributes, RawMaterialCreation>
  implements RawMaterialAttributes
{
  declare id: string;
  declare supplier_id: string;
  declare material_name: string;
  declare stock_qty: number;
  declare reorder_level: number;
  declare unit: string;
  declare is_active: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

RawMaterial.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    supplier_id: { type: DataTypes.UUID, allowNull: false },
    material_name: { type: DataTypes.STRING(150), allowNull: false },
    stock_qty: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    reorder_level: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    unit: { type: DataTypes.STRING(30), allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    tableName: "raw_materials",
    underscored: true,
    timestamps: true,
  }
);
