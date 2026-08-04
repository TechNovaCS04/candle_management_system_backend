import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LEAVE" | "HALF_DAY";

export interface AttendanceAttributes {
  id: string;
  employee_id: string;
  date: string;
  status: AttendanceStatus;
  is_active: boolean;
  created_at?: Date;
}

type AttendanceCreation = Optional<AttendanceAttributes, "id" | "is_active" | "created_at">;

export class Attendance
  extends Model<AttendanceAttributes, AttendanceCreation>
  implements AttendanceAttributes
{
  declare id: string;
  declare employee_id: string;
  declare date: string;
  declare status: AttendanceStatus;
  declare is_active: boolean;
  declare readonly created_at: Date;
}

Attendance.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employee_id: { type: DataTypes.STRING(10), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    status: {
      type: DataTypes.ENUM("PRESENT", "ABSENT", "LEAVE", "HALF_DAY"),
      allowNull: false,
    },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    tableName: "attendance",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  }
);
