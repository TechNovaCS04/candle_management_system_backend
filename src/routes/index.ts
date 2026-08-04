import { Request, Router } from "express";
import * as c from "../controllers/modules.controller";
import { validateBody } from "../middleware/validate.middleware";
import {
  attendanceSchema,
  batchSchema,
  customerSchema,
  employeeSchema,
  expenseSchema,
  materialSchema,
  productSchema,
  revenueSchema,
  saleSchema,
  statusSchema,
  supplierSchema,
} from "../validators/schemas";

const router = Router();

// Suppliers
router.get("/suppliers", c.listSuppliers);
router.post("/suppliers", validateBody(supplierSchema), c.createSupplier);
router.get("/suppliers/:id", c.getSupplier);
router.put("/suppliers/:id", validateBody(supplierSchema), c.updateSupplier);
router.patch("/suppliers/:id/enable", c.enableSupplier);
router.patch("/suppliers/:id/disable", c.disableSupplier);
router.delete("/suppliers/:id", c.deleteSupplier);

// Raw materials
router.get("/materials/low-stock", c.lowStockMaterials);
router.get("/materials", c.listMaterials);
router.post("/materials", validateBody(materialSchema), c.createMaterial);
router.get("/materials/:id", c.getMaterial);
router.put("/materials/:id", validateBody(materialSchema), c.updateMaterial);
router.patch("/materials/:id/status", validateBody(statusSchema), c.setMaterialStatus);
router.delete("/materials/:id", c.deleteMaterial);

// Products
router.get("/products", c.listProducts);
router.post("/products", validateBody(productSchema), c.createProduct);
router.get("/products/:id", c.getProduct);
router.put("/products/:id", validateBody(productSchema), c.updateProduct);
router.patch("/products/:id/status", validateBody(statusSchema), c.setProductStatus);
router.delete("/products/:id", c.deleteProduct);

// Production batches
router.get("/batches", c.listBatches);
router.post("/batches", validateBody(batchSchema), c.createBatch);
router.get("/batches/:id", c.getBatch);
router.put("/batches/:id", validateBody(batchSchema), c.updateBatch);
router.delete("/batches/:id", c.deleteBatch);

// Customers
router.get("/customers", c.listCustomers);
router.post("/customers", validateBody(customerSchema), c.createCustomer);
router.get("/customers/:id", c.getCustomer);
router.put("/customers/:id", validateBody(customerSchema), c.updateCustomer);
router.patch("/customers/:id/status", validateBody(statusSchema), c.setCustomerStatus);
router.delete("/customers/:id", c.deleteCustomer);

// Sales
router.get("/sales", c.listSales);
router.post("/sales", validateBody(saleSchema), c.createSale);
router.get("/sales/:id", c.getSale);
router.put("/sales/:id", validateBody(saleSchema), c.updateSale);
router.delete("/sales/:id", c.deleteSale);

// Employees
router.get("/employees", c.listEmployees);
router.post("/employees", validateBody(employeeSchema), c.createEmployee);
router.get("/employees/:id", c.getEmployee);
router.put("/employees/:id", validateBody(employeeSchema), c.updateEmployee);
router.delete("/employees/:id", c.deleteEmployee);

// Attendance
router.get("/attendance", c.listAttendance);
router.post("/attendance", validateBody(attendanceSchema), c.createAttendance);
router.get("/attendance/:id", c.getAttendance);
router.put("/attendance/:id", validateBody(attendanceSchema), c.updateAttendance);
router.delete("/attendance/:id", c.deleteAttendance);

// Revenue & Expenses
router.get("/revenue", c.listRevenue);
router.post("/revenue", validateBody(revenueSchema), c.createRevenue);
router.get("/revenue/:id", c.getRevenue);
router.put("/revenue/:id", validateBody(revenueSchema), c.updateRevenue);
router.delete("/revenue/:id", c.deleteRevenue);

router.get("/expenses", c.listExpenses);
router.post("/expenses", validateBody(expenseSchema), c.createExpense);
router.get("/expenses/:id", c.getExpense);
router.put("/expenses/:id", validateBody(expenseSchema), c.updateExpense);
router.delete("/expenses/:id", c.deleteExpense);

router.get("/finance/summary", c.financeSummary);

// Dashboard & Reports
router.get("/dashboard/summary", c.dashboardSummary);
router.get("/reports/sales", c.reportSales);
router.get("/reports/inventory", c.reportInventory);
router.get("/reports/production", c.reportProduction);
router.get("/reports/finance", c.reportFinance);

export default router;
