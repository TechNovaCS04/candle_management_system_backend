import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface ExpenseAttributes {
  id: string;
  description: string;
  amount: number;
  expense_date: string;
  category: string | null;
  is_active: boolean;
  created_at?: Date;
}

type ExpenseCreation = Optional<ExpenseAttributes, "id" | "category" | "is_active" | "created_at">;

export class Expense extends Model<ExpenseAttributes, ExpenseCreation> implements ExpenseAttributes {
  declare id: string;
  declare description: string;
  declare amount: number;
  declare expense_date: string;
  declare category: string | null;
  declare is_active: boolean;
  declare readonly created_at: Date;
}

Expense.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    expense_date: { type: DataTypes.DATEONLY, allowNull: false },
    category: { type: DataTypes.STRING(100), allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    tableName: "expenses",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  }
);
