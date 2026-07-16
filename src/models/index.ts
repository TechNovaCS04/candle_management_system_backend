import { User } from "./User";
import { Employee } from "./Employee";
import { Attendance } from "./Attendance";
import { Supplier } from "./Supplier";
import { RawMaterial } from "./RawMaterial";
import { Product } from "./Product";
import { ProductionBatch } from "./ProductionBatch";
import { BatchMaterial } from "./BatchMaterial";
import { Customer } from "./Customer";
import { Sale } from "./Sale";
import { ProductSaleDetail } from "./ProductSaleDetail";
import { Revenue } from "./Revenue";
import { Expense } from "./Expense";

Employee.hasMany(Attendance, { foreignKey: "employee_id", as: "attendanceRecords" });
Attendance.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });

Supplier.hasMany(RawMaterial, { foreignKey: "supplier_id", as: "materials" });
RawMaterial.belongsTo(Supplier, { foreignKey: "supplier_id", as: "supplier" });

Product.hasMany(ProductionBatch, { foreignKey: "product_id", as: "batches" });
ProductionBatch.belongsTo(Product, { foreignKey: "product_id", as: "product" });

ProductionBatch.hasMany(BatchMaterial, { foreignKey: "batch_id", as: "materialsUsed" });
BatchMaterial.belongsTo(ProductionBatch, { foreignKey: "batch_id", as: "batch" });
BatchMaterial.belongsTo(RawMaterial, { foreignKey: "material_id", as: "material" });
RawMaterial.hasMany(BatchMaterial, { foreignKey: "material_id", as: "batchUsages" });

Customer.hasMany(Sale, { foreignKey: "customer_id", as: "sales" });
Sale.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });

Sale.hasMany(ProductSaleDetail, { foreignKey: "sale_id", as: "items" });
ProductSaleDetail.belongsTo(Sale, { foreignKey: "sale_id", as: "sale" });
ProductSaleDetail.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Product.hasMany(ProductSaleDetail, { foreignKey: "product_id", as: "saleDetails" });

Sale.hasMany(Revenue, { foreignKey: "sale_id", as: "revenues" });
Revenue.belongsTo(Sale, { foreignKey: "sale_id", as: "sale" });

export {
  User,
  Employee,
  Attendance,
  Supplier,
  RawMaterial,
  Product,
  ProductionBatch,
  BatchMaterial,
  Customer,
  Sale,
  ProductSaleDetail,
  Revenue,
  Expense,
};

export type { EmployeePosition } from "./Employee";
export type { AttendanceStatus } from "./Attendance";
export type { ProductionStatus } from "./ProductionBatch";
export type { SaleStatus } from "./Sale";
