import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const supplierSchema = z.object({
  name: z.string().min(1),
  contactNo: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
});

export const materialSchema = z.object({
  name: z.string().min(1),
  unit: z.string().min(1),
  quantityInStock: z.number().min(0),
  reorderLevel: z.number().min(0),
  supplierId: z.string().uuid(),
});

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(""),
  price: z.number().min(0),
  stockQuantity: z.number().int().min(0),
  category: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")).optional(),
});

export const batchMaterialSchema = z.object({
  materialId: z.string().uuid(),
  quantityUsed: z.number().positive(),
});

export const batchSchema = z.object({
  productId: z.string().min(1),
  productionDate: z.string().min(1),
  quantityProduced: z.number().int().positive(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("PLANNED"),
  materialsUsed: z.array(batchMaterialSchema).default([]),
});

export const customerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
});

export const saleItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().min(0),
});

export const saleSchema = z.object({
  customerId: z.string().min(1),
  saleDate: z.string().min(1),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"]).default("PENDING"),
  items: z.array(saleItemSchema).min(1),
});

export const employeeSchema = z.object({
  name: z.string().min(1),
  position: z.enum(["MANAGER", "PRODUCTION_STAFF", "SALES_STAFF", "ACCOUNTANT", "OTHER"]),
  phone: z.string().min(1),
  salary: z.number().min(0),
  joinedDate: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
});

export const attendanceSchema = z.object({
  employeeId: z.string().min(1),
  date: z.string().min(1),
  status: z.enum(["PRESENT", "ABSENT", "LEAVE", "HALF_DAY"]),
});

export const expenseSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  expenseDate: z.string().min(1),
  category: z.string().optional(),
});

export const revenueSchema = z.object({
  saleId: z.string().min(1),
  amount: z.number().positive(),
  receivedDate: z.string().min(1),
});

export const statusSchema = z.object({
  isActive: z.boolean(),
});