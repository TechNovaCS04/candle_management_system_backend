import { registry } from "../registry";
import {
  errorResponses,
  IdParamsSchema,
  jsonBody,
  jsonResponse,
  ListQuerySchema,
  secured,
} from "../common";
import { MaterialBodySchema, StatusBodySchema } from "../request-schemas";
import {
  MaterialArrayResponseSchema,
  MaterialListResponseSchema,
  MaterialResponseSchema,
  MessageResponseSchema,
} from "../response-schemas";

export function registerMaterialPaths() {
  registry.registerPath({
    method: "get",
    path: "/api/materials/low-stock",
    tags: ["Materials"],
    summary: "List low-stock materials",
    description:
      "Returns active materials where `quantityInStock <= reorderLevel`. Useful for inventory alerts and dashboard widgets.",
    ...secured,
    responses: {
      200: jsonResponse(MaterialArrayResponseSchema, "Low-stock materials"),
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/materials",
    tags: ["Materials"],
    summary: "List materials",
    description: "Paginated raw materials. Supports `search` on material name and `isActive` filter.",
    ...secured,
    request: { query: ListQuerySchema },
    responses: {
      200: jsonResponse(MaterialListResponseSchema, "Paginated materials"),
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/materials",
    tags: ["Materials"],
    summary: "Create material",
    description: "`supplierId` must reference an existing supplier.",
    ...secured,
    request: { body: jsonBody(MaterialBodySchema) },
    responses: {
      201: jsonResponse(MaterialResponseSchema, "Material created"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/materials/{id}",
    tags: ["Materials"],
    summary: "Get material by ID",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(MaterialResponseSchema, "Material"),
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/materials/{id}",
    tags: ["Materials"],
    summary: "Update material",
    ...secured,
    request: {
      params: IdParamsSchema,
      body: jsonBody(MaterialBodySchema),
    },
    responses: {
      200: jsonResponse(MaterialResponseSchema, "Updated material"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/api/materials/{id}/status",
    tags: ["Materials"],
    summary: "Set material active status",
    description: "Enable or disable a material via `{ isActive: boolean }`.",
    ...secured,
    request: {
      params: IdParamsSchema,
      body: jsonBody(StatusBodySchema),
    },
    responses: {
      200: jsonResponse(MaterialResponseSchema, "Updated material status"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/api/materials/{id}",
    tags: ["Materials"],
    summary: "Delete material",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(MessageResponseSchema, "Material deleted"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });
}
