import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { parsePagination } from "../utils/pagination";
import { getParamId } from "../utils/params";
import { supplierService } from "../services/supplier.service";
import { materialService } from "../services/material.service";
import { productService } from "../services/product.service";
import { productionService } from "../services/production.service";
import { customerService } from "../services/customer.service";
import { salesService } from "../services/sales.service";
import { attendanceService, employeeService } from "../services/employee.service";
import { dashboardService, financeService } from "../services/finance.service";

function ok(res: Response, data: unknown, status = 200) {
  res.status(status).json({ success: true, ...(typeof data === "object" && data !== null ? data : { data }) });
}

// Suppliers
export const listSuppliers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await supplierService.list(parsePagination(req)));
  } catch (e) {
    next(e);
  }
};
export const getSupplier = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await supplierService.getById(getParamId(req.params.id)) });
  } catch (e) {
    next(e);
  }
};
export const createSupplier = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await supplierService.create(req.body) }, 201);
  } catch (e) {
    next(e);
  }
};
export const updateSupplier = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await supplierService.update(getParamId(req.params.id), req.body) });
  } catch (e) {
    next(e);
  }
};
export const enableSupplier = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await supplierService.setActive(getParamId(req.params.id), true) });
  } catch (e) {
    next(e);
  }
};
export const disableSupplier = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await supplierService.setActive(getParamId(req.params.id), false) });
  } catch (e) {
    next(e);
  }
};
export const deleteSupplier = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await supplierService.remove(getParamId(req.params.id)));
  } catch (e) {
    next(e);
  }
};

// Materials
export const listMaterials = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await materialService.list(parsePagination(req)));
  } catch (e) {
    next(e);
  }
};
export const lowStockMaterials = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await materialService.lowStock() });
  } catch (e) {
    next(e);
  }
};
export const getMaterial = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await materialService.getById(getParamId(req.params.id)) });
  } catch (e) {
    next(e);
  }
};
export const createMaterial = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await materialService.create(req.body) }, 201);
  } catch (e) {
    next(e);
  }
};
export const updateMaterial = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await materialService.update(getParamId(req.params.id), req.body) });
  } catch (e) {
    next(e);
  }
};
export const setMaterialStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await materialService.setActive(getParamId(req.params.id), req.body.isActive) });
  } catch (e) {
    next(e);
  }
};
export const deleteMaterial = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await materialService.remove(getParamId(req.params.id)));
  } catch (e) {
    next(e);
  }
};

// Products
export const listProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await productService.list(parsePagination(req)));
  } catch (e) {
    next(e);
  }
};
export const getProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await productService.getById(getParamId(req.params.id)) });
  } catch (e) {
    next(e);
  }
};
export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await productService.create(req.body) }, 201);
  } catch (e) {
    next(e);
  }
};
export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await productService.update(getParamId(req.params.id), req.body) });
  } catch (e) {
    next(e);
  }
};
export const setProductStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await productService.setActive(getParamId(req.params.id), req.body.isActive) });
  } catch (e) {
    next(e);
  }
};
export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await productService.remove(getParamId(req.params.id)));
  } catch (e) {
    next(e);
  }
};

// Batches
export const listBatches = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await productionService.list(parsePagination(req)));
  } catch (e) {
    next(e);
  }
};
export const getBatch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await productionService.getById(getParamId(req.params.id)) });
  } catch (e) {
    next(e);
  }
};
export const createBatch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await productionService.create(req.body) }, 201);
  } catch (e) {
    next(e);
  }
};
export const updateBatch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await productionService.update(getParamId(req.params.id), req.body) });
  } catch (e) {
    next(e);
  }
};
export const deleteBatch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await productionService.remove(getParamId(req.params.id)));
  } catch (e) {
    next(e);
  }
};

// Customers
export const listCustomers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await customerService.list(parsePagination(req)));
  } catch (e) {
    next(e);
  }
};
export const getCustomer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await customerService.getById(getParamId(req.params.id)) });
  } catch (e) {
    next(e);
  }
};
export const createCustomer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await customerService.create(req.body) }, 201);
  } catch (e) {
    next(e);
  }
};
export const updateCustomer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await customerService.update(getParamId(req.params.id), req.body) });
  } catch (e) {
    next(e);
  }
};
export const setCustomerStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await customerService.setActive(getParamId(req.params.id), req.body.isActive) });
  } catch (e) {
    next(e);
  }
};
export const deleteCustomer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await customerService.remove(getParamId(req.params.id)));
  } catch (e) {
    next(e);
  }
};

// Sales
export const listSales = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await salesService.list(parsePagination(req)));
  } catch (e) {
    next(e);
  }
};
export const getSale = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await salesService.getById(getParamId(req.params.id)) });
  } catch (e) {
    next(e);
  }
};
export const createSale = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await salesService.create(req.body) }, 201);
  } catch (e) {
    next(e);
  }
};
export const updateSale = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await salesService.update(getParamId(req.params.id), req.body) });
  } catch (e) {
    next(e);
  }
};
export const deleteSale = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await salesService.remove(getParamId(req.params.id)));
  } catch (e) {
    next(e);
  }
};

// Employees
export const listEmployees = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await employeeService.list(parsePagination(req)));
  } catch (e) {
    next(e);
  }
};
export const getEmployee = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await employeeService.getById(getParamId(req.params.id)) });
  } catch (e) {
    next(e);
  }
};
export const createEmployee = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await employeeService.create(req.body) }, 201);
  } catch (e) {
    next(e);
  }
};
export const updateEmployee = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await employeeService.update(getParamId(req.params.id), req.body) });
  } catch (e) {
    next(e);
  }
};
export const deleteEmployee = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await employeeService.remove(getParamId(req.params.id)));
  } catch (e) {
    next(e);
  }
};

// Attendance
export const listAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await attendanceService.list(parsePagination(req)));
  } catch (e) {
    next(e);
  }
};
export const getAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await attendanceService.getById(getParamId(req.params.id)) });
  } catch (e) {
    next(e);
  }
};
export const createAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await attendanceService.create(req.body) }, 201);
  } catch (e) {
    next(e);
  }
};
export const updateAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await attendanceService.update(getParamId(req.params.id), req.body) });
  } catch (e) {
    next(e);
  }
};
export const deleteAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await attendanceService.remove(getParamId(req.params.id)));
  } catch (e) {
    next(e);
  }
};

// Finance
export const listExpenses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await financeService.listExpenses(parsePagination(req)));
  } catch (e) {
    next(e);
  }
};
export const getExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await financeService.getExpense(getParamId(req.params.id)) });
  } catch (e) {
    next(e);
  }
};
export const createExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await financeService.createExpense(req.body) }, 201);
  } catch (e) {
    next(e);
  }
};
export const updateExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await financeService.updateExpense(getParamId(req.params.id), req.body) });
  } catch (e) {
    next(e);
  }
};
export const listRevenue = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, await financeService.listRevenue(parsePagination(req)));
  } catch (e) {
    next(e);
  }
};
export const getRevenue = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await financeService.getRevenue(getParamId(req.params.id)) });
  } catch (e) {
    next(e);
  }
};
export const createRevenue = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await financeService.createRevenue(req.body) }, 201);
  } catch (e) {
    next(e);
  }
};
export const financeSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const from = typeof req.query.from === "string" ? req.query.from : undefined;
    const to = typeof req.query.to === "string" ? req.query.to : undefined;
    ok(res, { data: await financeService.summary(from, to) });
  } catch (e) {
    next(e);
  }
};

// Dashboard / Reports
export const dashboardSummary = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await dashboardService.summary() });
  } catch (e) {
    next(e);
  }
};
export const reportSales = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const from = typeof req.query.from === "string" ? req.query.from : undefined;
    const to = typeof req.query.to === "string" ? req.query.to : undefined;
    ok(res, { data: await dashboardService.salesReport(from, to) });
  } catch (e) {
    next(e);
  }
};
export const reportInventory = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    ok(res, { data: await dashboardService.inventoryReport() });
  } catch (e) {
    next(e);
  }
};
export const reportProduction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const from = typeof req.query.from === "string" ? req.query.from : undefined;
    const to = typeof req.query.to === "string" ? req.query.to : undefined;
    ok(res, { data: await dashboardService.productionReport(from, to) });
  } catch (e) {
    next(e);
  }
};
export const reportFinance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const from = typeof req.query.from === "string" ? req.query.from : undefined;
    const to = typeof req.query.to === "string" ? req.query.to : undefined;
    ok(res, { data: await financeService.summary(from, to) });
  } catch (e) {
    next(e);
  }
};
