import { registry } from "../registry";
import {
  errorResponses,
  IdParamsSchema,
  jsonBody,
  jsonResponse,
  PageQuerySchema,
  secured,
} from "../common";
import { SaleBodySchema } from "../request-schemas";
import {
  MessageResponseSchema,
  SaleListResponseSchema,
  SaleResponseSchema,
} from "../response-schemas";

export function registerSalePaths() {
  registry.registerPath({
    method: "get",
    path: "/api/sales",
    tags: ["Sales"],
    summary: "List sales",
    description:
      "Paginated sales with line items. Query supports `page` and `pageSize` only (`search` / `isActive` are ignored).",
    ...secured,
    request: { query: PageQuerySchema },
    responses: {
      200: jsonResponse(SaleListResponseSchema, "Paginated sales"),
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/sales",
    tags: ["Sales"],
    summary: "Create sale",
    description: `Creates a sale with one or more line items.

**Business rule:** When \`status\` is \`COMPLETED\` (on create or later update), the API **once**:
1. Deducts product stock for each line item
2. Creates a revenue row for the sale total

Insufficient product stock returns \`400\`.`,
    ...secured,
    request: { body: jsonBody(SaleBodySchema) },
    responses: {
      201: jsonResponse(SaleResponseSchema, "Sale created"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/sales/{id}",
    tags: ["Sales"],
    summary: "Get sale by ID",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(SaleResponseSchema, "Sale"),
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/sales/{id}",
    tags: ["Sales"],
    summary: "Update sale",
    description:
      "Replaces sale header and items. Completing a sale applies stock + revenue once. Cannot leave `COMPLETED` after stock was applied.",
    ...secured,
    request: {
      params: IdParamsSchema,
      body: jsonBody(SaleBodySchema),
    },
    responses: {
      200: jsonResponse(SaleResponseSchema, "Updated sale"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/api/sales/{id}",
    tags: ["Sales"],
    summary: "Delete sale",
    description: "Deletes a sale. Blocked with `400` if inventory/revenue was already applied.",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(MessageResponseSchema, "Sale deleted"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });
}
