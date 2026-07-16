import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at?: Date;
  updated_at?: Date;
}

type UserCreation = Optional<UserAttributes, "id" | "created_at" | "updated_at">;

export class User extends Model<UserAttributes, UserCreation> implements UserAttributes {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password_hash: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    sequelize,
    tableName: "users",
    underscored: true,
    timestamps: true,
  }
);
