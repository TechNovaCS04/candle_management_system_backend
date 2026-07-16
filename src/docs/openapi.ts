import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { env } from "../config/env";
import { registry } from "./registry";
import { registerHealthPaths } from "./paths/health.paths";
import { registerAuthPaths } from "./paths/auth.paths";
import { registerSupplierPaths } from "./paths/suppliers.paths";
import { registerMaterialPaths } from "./paths/materials.paths";
import { registerProductPaths } from "./paths/products.paths";
import { registerBatchPaths } from "./paths/batches.paths";
import { registerCustomerPaths } from "./paths/customers.paths";
import { registerSalePaths } from "./paths/sales.paths";
import { registerEmployeePaths } from "./paths/employees.paths";
import { registerAttendancePaths } from "./paths/attendance.paths";
import { registerFinancePaths } from "./paths/finance.paths";
import { registerDashboardPaths } from "./paths/dashboard.paths";
import { registerReportPaths } from "./paths/reports.paths";

// Register request/response component schemas via side-effect imports
import "./request-schemas";
import "./response-schemas";

let cachedDocument: ReturnType<OpenApiGeneratorV3["generateDocument"]> | null = null;

function registerAllPaths() {
  registerHealthPaths();
  registerAuthPaths();
  registerSupplierPaths();
  registerMaterialPaths();
  registerProductPaths();
  registerBatchPaths();
  registerCustomerPaths();
  registerSalePaths();
  registerEmployeePaths();
  registerAttendancePaths();
  registerFinancePaths();
  registerDashboardPaths();
  registerReportPaths();
}

export function getOpenApiDocument() {
  if (cachedDocument) return cachedDocument;

  registerAllPaths();

  const generator = new OpenApiGeneratorV3(registry.definitions);

  cachedDocument = generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "SCMS API",
      version: "1.0.0",
      description: `
Sangeetha Candles Management System (SCMS) REST API.

## Authentication

Most endpoints require a JWT Bearer token.

1. Call \`POST /api/auth/login\` with seed admin credentials (after \`npm run db:seed\`):
   - Email: \`admin@sangeetha.lk\`
   - Password: \`admin123\`
2. Copy the \`token\` from the response.
3. Click **Authorize** in this UI and paste the token (Swagger adds the \`Bearer \` prefix).

Public endpoints: \`GET /api/health\`, \`POST /api/auth/register\`, \`POST /api/auth/login\`, \`POST /api/auth/logout\`.

Protected auth endpoints: \`GET /api/auth/me\`, \`PUT /api/auth/password\`.

## Response conventions

- Success list: \`{ success: true, data: T[], pagination }\`
- Success single: \`{ success: true, data: T }\`
- Success message: \`{ success: true, message }\`
- Auth login/register: \`{ success: true, token, admin }\`
- Error: \`{ success: false, message }\`

## Business rules

- Completing a **production batch** deducts raw materials and increases product stock (once).
- Completing a **sale** deducts product stock and creates a revenue row (once).
- Low stock materials: \`quantityInStock <= reorderLevel\`.
`.trim(),
      contact: {
        name: "TechNova",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Local development",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "Liveness and environment checks",
      },
      {
        name: "Auth",
        description:
          "Admin registration, login, profile, and password. Seed: `admin@sangeetha.lk` / `admin123`.",
      },
      { name: "Suppliers", description: "Supplier CRUD, enable/disable" },
      { name: "Materials", description: "Raw materials and low-stock alerts" },
      { name: "Products", description: "Finished goods catalog" },
      {
        name: "Batches",
        description: "Production batches; COMPLETED applies inventory once",
      },
      { name: "Customers", description: "Customer management" },
      {
        name: "Sales",
        description: "Sales orders; COMPLETED applies stock and revenue once",
      },
      { name: "Employees", description: "HR employee records" },
      { name: "Attendance", description: "Daily attendance (unique per employee+date)" },
      { name: "Finance", description: "Revenue, expenses, and finance summary" },
      { name: "Dashboard", description: "Aggregated KPIs for the admin home screen" },
      { name: "Reports", description: "Sales, inventory, production, and finance reports" },
    ],
  });

  return cachedDocument;
}
