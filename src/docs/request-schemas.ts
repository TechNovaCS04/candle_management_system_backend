import { registry } from "./registry";
import { examples } from "./examples";
import {
  attendanceSchema,
  batchSchema,
  changePasswordSchema,
  customerSchema,
  employeeSchema,
  expenseSchema,
  loginSchema,
  materialSchema,
  productSchema,
  registerSchema,
  revenueSchema,
  saleSchema,
  statusSchema,
  supplierSchema,
} from "../validators/schemas";

export const RegisterBodySchema = registry.register(
  "RegisterRequest",
  registerSchema.openapi({ example: examples.registerRequest })
);

export const LoginBodySchema = registry.register(
  "LoginRequest",
  loginSchema.openapi({ example: examples.loginRequest })
);

export const ChangePasswordBodySchema = registry.register(
  "ChangePasswordRequest",
  changePasswordSchema.openapi({ example: examples.changePasswordRequest })
);

export const SupplierBodySchema = registry.register(
  "SupplierRequest",
  supplierSchema.openapi({ example: examples.supplierRequest })
);

export const MaterialBodySchema = registry.register(
  "MaterialRequest",
  materialSchema.openapi({ example: examples.materialRequest })
);

export const ProductBodySchema = registry.register(
  "ProductRequest",
  productSchema.openapi({ example: examples.productRequest })
);

export const BatchBodySchema = registry.register(
  "BatchRequest",
  batchSchema.openapi({ example: examples.batchRequest })
);

export const CustomerBodySchema = registry.register(
  "CustomerRequest",
  customerSchema.openapi({ example: examples.customerRequest })
);

export const SaleBodySchema = registry.register(
  "SaleRequest",
  saleSchema.openapi({ example: examples.saleRequest })
);

export const EmployeeBodySchema = registry.register(
  "EmployeeRequest",
  employeeSchema.openapi({ example: examples.employeeRequest })
);

export const AttendanceBodySchema = registry.register(
  "AttendanceRequest",
  attendanceSchema.openapi({ example: examples.attendanceRequest })
);

export const ExpenseBodySchema = registry.register(
  "ExpenseRequest",
  expenseSchema.openapi({ example: examples.expenseRequest })
);

export const RevenueBodySchema = registry.register(
  "RevenueRequest",
  revenueSchema.openapi({ example: examples.revenueRequest })
);

export const StatusBodySchema = registry.register(
  "StatusRequest",
  statusSchema.openapi({ example: examples.statusRequest })
);
