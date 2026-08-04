import { DataTypes, Model, Optional } from "sequelize";
import { generateSequentialId, sequelize } from "../config/database";

export interface ProductAttributes {
  id: string;
  product_name: string;
  description: string;
  price: number;
  stock_qty: number;
  category: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

type ProductCreation = Optional<
  ProductAttributes,
  "id" | "category" | "image_url" | "is_active" | "created_at" | "updated_at"
>;

export class Product extends Model<ProductAttributes, ProductCreation> implements ProductAttributes {
  declare id: string;
  declare product_name: string;
  declare description: string;
  declare price: number;
  declare stock_qty: number;
  declare category: string | null;
  declare image_url: string | null;
  declare is_active: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Product.init(
  {
    id: { type: DataTypes.STRING(10), primaryKey: true },
    product_name: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    stock_qty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    category: { type: DataTypes.STRING(100), allowNull: true },
    image_url: { type: DataTypes.TEXT, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    tableName: "products",
    underscored: true,
    timestamps: true,
  }
);

Product.addHook("beforeCreate", async (product: Product) => {
  if (!product.id) {
    product.id = await generateSequentialId("P", "product_id_seq");
  }
});
