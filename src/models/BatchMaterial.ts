import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface BatchMaterialAttributes {
  id: string;
  batch_id: string;
  material_id: string;
  used_qty: number;
  created_at?: Date;
}

type BatchMaterialCreation = Optional<BatchMaterialAttributes, "id" | "created_at">;

export class BatchMaterial
  extends Model<BatchMaterialAttributes, BatchMaterialCreation>
  implements BatchMaterialAttributes
{
  declare id: string;
  declare batch_id: string;
  declare material_id: string;
  declare used_qty: number;
  declare readonly created_at: Date;
}

BatchMaterial.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    batch_id: { type: DataTypes.UUID, allowNull: false },
    material_id: { type: DataTypes.UUID, allowNull: false },
    used_qty: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  },
  {
    sequelize,
    tableName: "batch_materials",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  }
);
