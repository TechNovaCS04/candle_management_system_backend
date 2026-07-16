import { registry } from "../registry";
import {
  errorResponses,
  IdParamsSchema,
  jsonBody,
  jsonResponse,
  ListQuerySchema,
  secured,
} from "../common";
import { SupplierBodySchema } from "../request-schemas";
import {
  MessageResponseSchema,
  SupplierListResponseSchema,
  SupplierResponseSchema,
} from "../response-schemas";

export function registerSupplierPaths() {
  registry.registerPath({
    method: "get",
    path: "/api/suppliers",
    tags: ["Suppliers"],
    summary: "List suppliers",
    description:
      "Paginated supplier list. Supports `search` on name, email, and contact number, and `isActive` filter.",
    ...secured,
    request: { query: ListQuerySchema },
    responses: {
      200: jsonResponse(SupplierListResponseSchema, "Paginated suppliers"),
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/suppliers",
    tags: ["Suppliers"],
    summary: "Create supplier",
    description: "Creates a new supplier. New records are active by default.",
    ...secured,
    request: { body: jsonBody(SupplierBodySchema) },
    responses: {
      201: jsonResponse(SupplierResponseSchema, "Supplier created"),
      400: errorResponses[400],
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/suppliers/{id}",
    tags: ["Suppliers"],
    summary: "Get supplier by ID",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(SupplierResponseSchema, "Supplier"),
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/suppliers/{id}",
    tags: ["Suppliers"],
    summary: "Update supplier",
    description: "Full update of supplier fields (name, contact, email, address).",
    ...secured,
    request: {
      params: IdParamsSchema,
      body: jsonBody(SupplierBodySchema),
    },
    responses: {
      200: jsonResponse(SupplierResponseSchema, "Updated supplier"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/api/suppliers/{id}/enable",
    tags: ["Suppliers"],
    summary: "Enable supplier",
    description: "Sets `isActive` to `true`.",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(SupplierResponseSchema, "Supplier enabled"),
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/api/suppliers/{id}/disable",
    tags: ["Suppliers"],
    summary: "Disable supplier",
    description: "Sets `isActive` to `false` (soft disable).",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(SupplierResponseSchema, "Supplier disabled"),
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/api/suppliers/{id}",
    tags: ["Suppliers"],
    summary: "Delete supplier",
    description: "Permanently deletes a supplier. May fail if referenced by materials.",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(MessageResponseSchema, "Supplier deleted"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });
}
