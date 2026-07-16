import { User } from "../models/User";
import { Supplier } from "../models/Supplier";
import { RawMaterial } from "../models/RawMaterial";
import { Product } from "../models/Product";
import { Customer } from "../models/Customer";
import { Employee } from "../models/Employee";
import { Attendance } from "../models/Attendance";
import { Expense } from "../models/Expense";
import { Revenue } from "../models/Revenue";
import { ProductionBatch } from "../models/ProductionBatch";
import { BatchMaterial } from "../models/BatchMaterial";
import { Sale } from "../models/Sale";
import { ProductSaleDetail } from "../models/ProductSaleDetail";

export function mapAdmin(user: User) {
  return {
    adminId: user.id,
    email: user.email,
    fullName: user.name,
  };
}

export function mapSupplier(s: Supplier) {
  return {
    supplierId: s.id,
    name: s.name,
    contactNo: s.contact_no,
    email: s.email_address,
    address: s.address,
    isActive: s.is_active,
  };
}

export function mapRawMaterial(m: RawMaterial & { supplier?: Supplier }) {
  return {
    materialId: m.id,
    name: m.material_name,
    unit: m.unit,
    quantityInStock: Number(m.stock_qty),
    reorderLevel: Number(m.reorder_level),
    supplierId: m.supplier_id,
    supplierName: m.supplier?.name,
    isActive: m.is_active,
  };
}

export function mapProduct(p: Product) {
  return {
    productId: p.id,
    name: p.product_name,
    description: p.description,
    price: Number(p.price),
    stockQuantity: Number(p.stock_qty),
    category: p.category ?? undefined,
    imageUrl: p.image_url ?? undefined,
    isActive: p.is_active,
  };
}

export function mapBatchMaterial(bm: BatchMaterial & { material?: RawMaterial }) {
  return {
    batchId: bm.batch_id,
    materialId: bm.material_id,
    materialName: bm.material?.material_name,
    quantityUsed: Number(bm.used_qty),
    unit: bm.material?.unit,
  };
}

export function mapProductionBatch(
  b: ProductionBatch & {
    product?: Product;
    materialsUsed?: (BatchMaterial & { material?: RawMaterial })[];
  }
) {
  return {
    batchId: b.id,
    productId: b.product_id,
    productName: b.product?.product_name,
    productionDate: b.production_date,
    quantityProduced: Number(b.produced_qty),
    status: b.status,
    materialsUsed: (b.materialsUsed ?? []).map(mapBatchMaterial),
    isActive: b.is_active,
  };
}

export function mapCustomer(c: Customer, totalOrders?: number) {
  return {
    customerId: c.id,
    name: c.name,
    phone: c.contact_no,
    email: c.email_address,
    address: c.address,
    totalOrders,
    isActive: c.is_active,
  };
}

export function mapSaleItem(item: ProductSaleDetail & { product?: Product }) {
  return {
    saleItemId: item.id,
    saleId: item.sale_id,
    productId: item.product_id,
    productName: item.product?.product_name,
    quantity: Number(item.buy_qty),
    unitPrice: Number(item.unit_price),
  };
}

export function mapSale(
  sale: Sale & {
    customer?: Customer;
    items?: (ProductSaleDetail & { product?: Product })[];
  }
) {
  const items = (sale.items ?? []).map(mapSaleItem);
  const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  return {
    saleId: sale.id,
    customerId: sale.customer_id,
    customerName: sale.customer?.name,
    saleDate: sale.sale_date,
    totalAmount,
    status: sale.status,
    items,
  };
}

export function mapEmployee(e: Employee) {
  return {
    employeeId: e.id,
    name: e.name,
    position: e.position,
    phone: e.contact_no,
    salary: Number(e.salary),
    joinedDate: e.joined_date ?? undefined,
    email: e.email_address ?? undefined,
    address: e.address ?? undefined,
    isActive: e.is_active,
  };
}

export function mapAttendance(a: Attendance & { employee?: Employee }) {
  return {
    attendanceId: a.id,
    employeeId: a.employee_id,
    employeeName: a.employee?.name,
    date: a.date,
    status: a.status,
  };
}

export function mapExpense(e: Expense) {
  return {
    expenseId: e.id,
    description: e.description,
    amount: Number(e.amount),
    expenseDate: e.expense_date,
    category: e.category ?? undefined,
    isActive: e.is_active,
  };
}

export function mapRevenue(r: Revenue) {
  return {
    revenueId: r.id,
    saleId: r.sale_id,
    amount: Number(r.amount),
    receivedDate: r.received_date,
    isActive: r.is_active,
  };
}
