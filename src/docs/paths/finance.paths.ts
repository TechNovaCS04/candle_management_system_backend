import { registry } from "../registry";
import {
  DateRangeQuerySchema,
  errorResponses,
  IdParamsSchema,
  jsonBody,
  jsonResponse,
  PageQuerySchema,
  PageSearchQuerySchema,
  secured,
} from "../common";
import { ExpenseBodySchema, RevenueBodySchema } from "../request-schemas";
import {
  ExpenseListResponseSchema,
  ExpenseResponseSchema,
  FinanceSummaryResponseSchema,
  RevenueListResponseSchema,
  RevenueResponseSchema,
} from "../response-schemas";

export function registerFinancePaths() {
  registry.registerPath({
    method: "get",
    path: "/api/revenue",
    tags: ["Finance"],
    summary: "List revenue records",
    description:
      "Paginated active revenue rows. Query supports `page` and `pageSize` only. Completed sales create revenue automatically.",
    ...secured,
    request: { query: PageQuerySchema },
    responses: {
      200: jsonResponse(RevenueListResponseSchema, "Paginated revenue"),
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/revenue",
    tags: ["Finance"],
    summary: "Create revenue record",
    description: "Manually creates a revenue row linked to an existing `saleId`.",
    ...secured,
    request: { body: jsonBody(RevenueBodySchema) },
    responses: {
      201: jsonResponse(RevenueResponseSchema, "Revenue created"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/revenue/{id}",
    tags: ["Finance"],
    summary: "Get revenue by ID",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(RevenueResponseSchema, "Revenue"),
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/expenses",
    tags: ["Finance"],
    summary: "List expenses",
    description:
      "Paginated **active** expenses only. Supports `search` on description. There is no delete endpoint.",
    ...secured,
    request: { query: PageSearchQuerySchema },
    responses: {
      200: jsonResponse(ExpenseListResponseSchema, "Paginated expenses"),
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/expenses",
    tags: ["Finance"],
    summary: "Create expense",
    ...secured,
    request: { body: jsonBody(ExpenseBodySchema) },
    responses: {
      201: jsonResponse(ExpenseResponseSchema, "Expense created"),
      400: errorResponses[400],
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/expenses/{id}",
    tags: ["Finance"],
    summary: "Get expense by ID",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(ExpenseResponseSchema, "Expense"),
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/expenses/{id}",
    tags: ["Finance"],
    summary: "Update expense",
    ...secured,
    request: {
      params: IdParamsSchema,
      body: jsonBody(ExpenseBodySchema),
    },
    responses: {
      200: jsonResponse(ExpenseResponseSchema, "Updated expense"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/finance/summary",
    tags: ["Finance"],
    summary: "Finance summary",
    description:
      "Returns `{ totalRevenue, totalExpenses, profit }`. Optional `from` and `to` filter by date; **both must be provided** for the range filter to apply.",
    ...secured,
    request: { query: DateRangeQuerySchema },
    responses: {
      200: jsonResponse(FinanceSummaryResponseSchema, "Finance summary"),
      401: errorResponses[401],
    },
  });
}
