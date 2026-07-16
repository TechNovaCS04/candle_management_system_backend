import { z } from "zod";
import { registry } from "./registry";
import { examples } from "./examples";

const uuid = z.string().uuid();

export const ErrorResponseSchema = registry.register(
  "ErrorResponse",
  z
    .object({
      success: z.literal(false),
      message: z.string(),
    })
    .openapi({ example: examples.error })
);

export const MessageResponseSchema = registry.register(
  "MessageResponse",
  z
    .object({
      success: z.literal(true),
      message: z.string(),
    })
    .openapi({ example: examples.message })
);

export const PaginationSchema = registry.register(
  "Pagination",
  z
    .object({
      page: z.number().int(),
      pageSize: z.number().int(),
      totalItems: z.number().int(),
    })
    .openapi({ example: examples.pagination })
);

export const AdminSchema = registry.register(
  "Admin",
  z
    .object({
      adminId: uuid,
      email: z.string().email(),
      fullName: z.string(),
    })
    .openapi({ example: examples.admin })
);

export const AuthTokenResponseSchema = registry.register(
  "AuthTokenResponse",
  z
    .object({
      success: z.literal(true),
      token: z.string(),
      admin: AdminSchema,
    })
    .openapi({ example: examples.authTokenResponse })
);

export const MeResponseSchema = registry.register(
  "MeResponse",
  z.object({
    success: z.literal(true),
    admin: AdminSchema,
  })
);

export const SupplierSchema = registry.register(
  "Supplier",
  z
    .object({
      supplierId: uuid,
      name: z.string(),
      contactNo: z.string(),
      email: z.string().email(),
      address: z.string(),
      isActive: z.boolean(),
    })
    .openapi({ example: examples.supplier })
);

export const MaterialSchema = registry.register(
  "Material",
  z
    .object({
      materialId: uuid,
      name: z.string(),
      unit: z.string(),
      quantityInStock: z.number(),
      reorderLevel: z.number(),
      supplierId: uuid,
      supplierName: z.string().optional(),
      isActive: z.boolean(),
    })
    .openapi({ example: examples.material })
);

export const ProductSchema = registry.register(
  "Product",
  z
    .object({
      productId: uuid,
      name: z.string(),
      description: z.string(),
      price: z.number(),
      stockQuantity: z.number().int(),
      category: z.string().optional(),
      imageUrl: z.string().optional(),
      isActive: z.boolean(),
    })
    .openapi({ example: examples.product })
);

export const BatchMaterialSchema = registry.register(
  "BatchMaterial",
  z
    .object({
      batchId: uuid,
      materialId: uuid,
      materialName: z.string().optional(),
      quantityUsed: z.number(),
      unit: z.string().optional(),
    })
    .openapi({ example: examples.batchMaterial })
);

export const BatchSchema = registry.register(
  "Batch",
  z
    .object({
      batchId: uuid,
      productId: uuid,
      productName: z.string().optional(),
      productionDate: z.string(),
      quantityProduced: z.number().int(),
      status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
      materialsUsed: z.array(BatchMaterialSchema),
      isActive: z.boolean(),
    })
    .openapi({ example: examples.batch })
);

export const CustomerSchema = registry.register(
  "Customer",
  z
    .object({
      customerId: uuid,
      name: z.string(),
      phone: z.string(),
      email: z.string().email(),
      address: z.string(),
      totalOrders: z.number().int().optional(),
      isActive: z.boolean(),
    })
    .openapi({ example: examples.customer })
);

export const SaleItemSchema = registry.register(
  "SaleItem",
  z
    .object({
      saleItemId: uuid,
      saleId: uuid,
      productId: uuid,
      productName: z.string().optional(),
      quantity: z.number().int(),
      unitPrice: z.number(),
    })
    .openapi({ example: examples.saleItem })
);

export const SaleSchema = registry.register(
  "Sale",
  z
    .object({
      saleId: uuid,
      customerId: uuid,
      customerName: z.string().optional(),
      saleDate: z.string(),
      totalAmount: z.number(),
      status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"]),
      items: z.array(SaleItemSchema),
    })
    .openapi({ example: examples.sale })
);

export const EmployeeSchema = registry.register(
  "Employee",
  z
    .object({
      employeeId: uuid,
      name: z.string(),
      position: z.enum(["MANAGER", "PRODUCTION_STAFF", "SALES_STAFF", "ACCOUNTANT", "OTHER"]),
      phone: z.string(),
      salary: z.number(),
      joinedDate: z.string().optional(),
      email: z.string().email().optional(),
      address: z.string().optional(),
      isActive: z.boolean(),
    })
    .openapi({ example: examples.employee })
);

export const AttendanceSchema = registry.register(
  "Attendance",
  z
    .object({
      attendanceId: uuid,
      employeeId: uuid,
      employeeName: z.string().optional(),
      date: z.string(),
      status: z.enum(["PRESENT", "ABSENT", "LEAVE", "HALF_DAY"]),
    })
    .openapi({ example: examples.attendance })
);

export const ExpenseSchema = registry.register(
  "Expense",
  z
    .object({
      expenseId: uuid,
      description: z.string(),
      amount: z.number(),
      expenseDate: z.string(),
      category: z.string().optional(),
      isActive: z.boolean(),
    })
    .openapi({ example: examples.expense })
);

export const RevenueSchema = registry.register(
  "Revenue",
  z
    .object({
      revenueId: uuid,
      saleId: uuid,
      amount: z.number(),
      receivedDate: z.string(),
      isActive: z.boolean(),
    })
    .openapi({ example: examples.revenue })
);

export const FinanceSummarySchema = registry.register(
  "FinanceSummary",
  z
    .object({
      totalRevenue: z.number(),
      totalExpenses: z.number(),
      profit: z.number(),
    })
    .openapi({ example: examples.financeSummary })
);

export const DashboardSummarySchema = registry.register(
  "DashboardSummary",
  z
    .object({
      productCount: z.number().int(),
      lowStockCount: z.number().int(),
      openBatches: z.number().int(),
      completedSalesCount: z.number().int(),
      totalRevenue: z.number(),
      totalExpenses: z.number(),
      profit: z.number(),
      recentSales: z.array(SaleSchema),
      lowStockMaterials: z.array(MaterialSchema),
    })
    .openapi({ example: examples.dashboardSummary })
);

export const InventoryReportSchema = registry.register(
  "InventoryReport",
  z
    .object({
      products: z.array(ProductSchema),
      materials: z.array(MaterialSchema),
    })
    .openapi({ example: examples.inventoryReport })
);

export const HealthResponseSchema = registry.register(
  "HealthResponse",
  z.object({
    success: z.literal(true),
    message: z.string(),
    env: z.string(),
  })
);

export function singleDataResponse<T extends z.ZodTypeAny>(name: string, dataSchema: T) {
  return registry.register(
    name,
    z.object({
      success: z.literal(true),
      data: dataSchema,
    })
  );
}

export function listDataResponse<T extends z.ZodTypeAny>(name: string, itemSchema: T) {
  return registry.register(
    name,
    z.object({
      success: z.literal(true),
      data: z.array(itemSchema),
      pagination: PaginationSchema,
    })
  );
}

export function arrayDataResponse<T extends z.ZodTypeAny>(name: string, itemSchema: T) {
  return registry.register(
    name,
    z.object({
      success: z.literal(true),
      data: z.array(itemSchema),
    })
  );
}

export const SupplierResponseSchema = singleDataResponse("SupplierResponse", SupplierSchema);
export const SupplierListResponseSchema = listDataResponse("SupplierListResponse", SupplierSchema);

export const MaterialResponseSchema = singleDataResponse("MaterialResponse", MaterialSchema);
export const MaterialListResponseSchema = listDataResponse("MaterialListResponse", MaterialSchema);
export const MaterialArrayResponseSchema = arrayDataResponse("MaterialArrayResponse", MaterialSchema);

export const ProductResponseSchema = singleDataResponse("ProductResponse", ProductSchema);
export const ProductListResponseSchema = listDataResponse("ProductListResponse", ProductSchema);

export const BatchResponseSchema = singleDataResponse("BatchResponse", BatchSchema);
export const BatchListResponseSchema = listDataResponse("BatchListResponse", BatchSchema);
export const BatchArrayResponseSchema = arrayDataResponse("BatchArrayResponse", BatchSchema);

export const CustomerResponseSchema = singleDataResponse("CustomerResponse", CustomerSchema);
export const CustomerListResponseSchema = listDataResponse("CustomerListResponse", CustomerSchema);

export const SaleResponseSchema = singleDataResponse("SaleResponse", SaleSchema);
export const SaleListResponseSchema = listDataResponse("SaleListResponse", SaleSchema);
export const SaleArrayResponseSchema = arrayDataResponse("SaleArrayResponse", SaleSchema);

export const EmployeeResponseSchema = singleDataResponse("EmployeeResponse", EmployeeSchema);
export const EmployeeListResponseSchema = listDataResponse("EmployeeListResponse", EmployeeSchema);

export const AttendanceResponseSchema = singleDataResponse("AttendanceResponse", AttendanceSchema);
export const AttendanceListResponseSchema = listDataResponse(
  "AttendanceListResponse",
  AttendanceSchema
);

export const ExpenseResponseSchema = singleDataResponse("ExpenseResponse", ExpenseSchema);
export const ExpenseListResponseSchema = listDataResponse("ExpenseListResponse", ExpenseSchema);

export const RevenueResponseSchema = singleDataResponse("RevenueResponse", RevenueSchema);
export const RevenueListResponseSchema = listDataResponse("RevenueListResponse", RevenueSchema);

export const FinanceSummaryResponseSchema = singleDataResponse(
  "FinanceSummaryResponse",
  FinanceSummarySchema
);

export const DashboardSummaryResponseSchema = singleDataResponse(
  "DashboardSummaryResponse",
  DashboardSummarySchema
);

export const InventoryReportResponseSchema = singleDataResponse(
  "InventoryReportResponse",
  InventoryReportSchema
);
