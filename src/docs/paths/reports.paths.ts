import { registry } from "../registry";
import {
  DateRangeQuerySchema,
  errorResponses,
  jsonResponse,
  secured,
} from "../common";
import {
  BatchArrayResponseSchema,
  FinanceSummaryResponseSchema,
  InventoryReportResponseSchema,
  SaleArrayResponseSchema,
} from "../response-schemas";

export function registerReportPaths() {
  registry.registerPath({
    method: "get",
    path: "/api/reports/sales",
    tags: ["Reports"],
    summary: "Sales report",
    description:
      "All sales (with items). Optional `from`/`to` filter on sale date — **both required** for filtering.",
    ...secured,
    request: { query: DateRangeQuerySchema },
    responses: {
      200: jsonResponse(SaleArrayResponseSchema, "Sales report"),
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/reports/inventory",
    tags: ["Reports"],
    summary: "Inventory report",
    description: "Active products and materials (materials include supplier name when available).",
    ...secured,
    responses: {
      200: jsonResponse(InventoryReportResponseSchema, "Inventory report"),
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/reports/production",
    tags: ["Reports"],
    summary: "Production report",
    description:
      "Active production batches. Optional `from`/`to` filter on production date — **both required** for filtering.",
    ...secured,
    request: { query: DateRangeQuerySchema },
    responses: {
      200: jsonResponse(BatchArrayResponseSchema, "Production report"),
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/reports/finance",
    tags: ["Reports"],
    summary: "Finance report",
    description:
      "Same payload as `GET /api/finance/summary`: totals and profit. Optional `from`/`to` — **both required** for filtering.",
    ...secured,
    request: { query: DateRangeQuerySchema },
    responses: {
      200: jsonResponse(FinanceSummaryResponseSchema, "Finance report"),
      401: errorResponses[401],
    },
  });
}
