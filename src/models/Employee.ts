import { DataTypes, Model, Optional } from "sequelize";
import { generateSequentialId, sequelize } from "../config/database";

export type EmployeePosition =
  | "MANAGER"
  | "PRODUCTION_STAFF"
  | "SALES_STAFF"
  | "ACCOUNTANT"
  | "OTHER";

export interface EmployeeAttributes {
  id: string;
  name: string;
  contact_no: string;
  email_address: string | null;
  address: string | null;
  position: EmployeePosition;
  salary: number;
  joined_date: string | null;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

type EmployeeCreation = Optional<
  EmployeeAttributes,
  "id" | "email_address" | "address" | "joined_date" | "is_active" | "created_at" | "updated_at"
>;

export class Employee extends Model<EmployeeAttributes, EmployeeCreation> implements EmployeeAttributes {
  declare id: string;
  declare name: string;
  declare contact_no: string;
  declare email_address: string | null;
  declare address: string | null;
  declare position: EmployeePosition;
  declare salary: number;
  declare joined_date: string | null;
  declare is_active: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Employee.init(
  {
    id: { type: DataTypes.STRING(10), primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    contact_no: { type: DataTypes.STRING(50), allowNull: false },
    email_address: { type: DataTypes.STRING(255), allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    position: {
      type: DataTypes.ENUM("MANAGER", "PRODUCTION_STAFF", "SALES_STAFF", "ACCOUNTANT", "OTHER"),
      allowNull: false,
      defaultValue: "OTHER",
    },
    salary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    joined_date: { type: DataTypes.DATEONLY, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    tableName: "employees",
    underscored: true,
    timestamps: true,
  }
);

Employee.addHook("beforeCreate", async (employee: Employee) => {
  if (!employee.id) {
    employee.id = await generateSequentialId("EMP", "employee_id_seq");
  }
});
