import { registry } from "../registry";
import {
  errorResponses,
  IdParamsSchema,
  jsonBody,
  jsonResponse,
  ListQuerySchema,
  secured,
} from "../common";
import { ProductBodySchema, StatusBodySchema } from "../request-schemas";
import {
  MessageResponseSchema,
  ProductListResponseSchema,
  ProductResponseSchema,
} from "../response-schemas";

export function registerProductPaths() {
  registry.registerPath({
    method: "get",
    path: "/api/products",
    tags: ["Products"],
    summary: "List products",
    description: "Paginated finished goods. Supports `search` on name/category and `isActive` filter.",
    ...secured,
    request: { query: ListQuerySchema },
    responses: {
      200: jsonResponse(ProductListResponseSchema, "Paginated products"),
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/products",
    tags: ["Products"],
    summary: "Create product",
    ...secured,
    request: { body: jsonBody(ProductBodySchema) },
    responses: {
      201: jsonResponse(ProductResponseSchema, "Product created"),
      400: errorResponses[400],
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/products/{id}",
    tags: ["Products"],
    summary: "Get product by ID",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(ProductResponseSchema, "Product"),
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/products/{id}",
    tags: ["Products"],
    summary: "Update product",
    ...secured,
    request: {
      params: IdParamsSchema,
      body: jsonBody(ProductBodySchema),
    },
    responses: {
      200: jsonResponse(ProductResponseSchema, "Updated product"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/api/products/{id}/status",
    tags: ["Products"],
    summary: "Set product active status",
    description: "Enable or disable a product via `{ isActive: boolean }`.",
    ...secured,
    request: {
      params: IdParamsSchema,
      body: jsonBody(StatusBodySchema),
    },
    responses: {
      200: jsonResponse(ProductResponseSchema, "Updated product status"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/api/products/{id}",
    tags: ["Products"],
    summary: "Delete product",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(MessageResponseSchema, "Product deleted"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });
}
