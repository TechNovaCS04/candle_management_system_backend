import { registry } from "../registry";
import {
  errorResponses,
  IdParamsSchema,
  jsonBody,
  jsonResponse,
  PageActiveQuerySchema,
  secured,
} from "../common";
import { BatchBodySchema } from "../request-schemas";
import {
  BatchListResponseSchema,
  BatchResponseSchema,
  MessageResponseSchema,
} from "../response-schemas";

export function registerBatchPaths() {
  registry.registerPath({
    method: "get",
    path: "/api/batches",
    tags: ["Batches"],
    summary: "List production batches",
    description:
      "Paginated production batches. Supports `isActive` filter. `search` is not applied on this endpoint.",
    ...secured,
    request: { query: PageActiveQuerySchema },
    responses: {
      200: jsonResponse(BatchListResponseSchema, "Paginated batches"),
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/batches",
    tags: ["Batches"],
    summary: "Create production batch",
    description: `Creates a batch with optional \`materialsUsed\`.

**Business rule:** When \`status\` is \`COMPLETED\` (on create or later update), the API **once**:
1. Deducts each used material from stock
2. Increases the product's \`stockQuantity\` by \`quantityProduced\`

Insufficient material stock returns \`400\`.`,
    ...secured,
    request: { body: jsonBody(BatchBodySchema) },
    responses: {
      201: jsonResponse(BatchResponseSchema, "Batch created"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/batches/{id}",
    tags: ["Batches"],
    summary: "Get batch by ID",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(BatchResponseSchema, "Batch"),
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/batches/{id}",
    tags: ["Batches"],
    summary: "Update production batch",
    description:
      "Updates batch fields and materials. Completing a batch applies inventory changes once. Cannot change status away from `COMPLETED` after stock was applied.",
    ...secured,
    request: {
      params: IdParamsSchema,
      body: jsonBody(BatchBodySchema),
    },
    responses: {
      200: jsonResponse(BatchResponseSchema, "Updated batch"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/api/batches/{id}",
    tags: ["Batches"],
    summary: "Delete production batch",
    description: "Deletes a batch. Blocked with `400` if inventory was already applied (`COMPLETED`).",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(MessageResponseSchema, "Batch deleted"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });
}
