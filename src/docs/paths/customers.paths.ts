import { registry } from "../registry";
import {
  errorResponses,
  IdParamsSchema,
  jsonBody,
  jsonResponse,
  ListQuerySchema,
  secured,
} from "../common";
import { CustomerBodySchema, StatusBodySchema } from "../request-schemas";
import {
  CustomerListResponseSchema,
  CustomerResponseSchema,
  MessageResponseSchema,
} from "../response-schemas";

export function registerCustomerPaths() {
  registry.registerPath({
    method: "get",
    path: "/api/customers",
    tags: ["Customers"],
    summary: "List customers",
    description:
      "Paginated customers with `totalOrders`. Supports `search` on name/email/phone and `isActive` filter.",
    ...secured,
    request: { query: ListQuerySchema },
    responses: {
      200: jsonResponse(CustomerListResponseSchema, "Paginated customers"),
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/customers",
    tags: ["Customers"],
    summary: "Create customer",
    ...secured,
    request: { body: jsonBody(CustomerBodySchema) },
    responses: {
      201: jsonResponse(CustomerResponseSchema, "Customer created"),
      400: errorResponses[400],
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/customers/{id}",
    tags: ["Customers"],
    summary: "Get customer by ID",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(CustomerResponseSchema, "Customer"),
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/customers/{id}",
    tags: ["Customers"],
    summary: "Update customer",
    ...secured,
    request: {
      params: IdParamsSchema,
      body: jsonBody(CustomerBodySchema),
    },
    responses: {
      200: jsonResponse(CustomerResponseSchema, "Updated customer"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/api/customers/{id}/status",
    tags: ["Customers"],
    summary: "Set customer active status",
    ...secured,
    request: {
      params: IdParamsSchema,
      body: jsonBody(StatusBodySchema),
    },
    responses: {
      200: jsonResponse(CustomerResponseSchema, "Updated customer status"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/api/customers/{id}",
    tags: ["Customers"],
    summary: "Delete customer",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(MessageResponseSchema, "Customer deleted"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });
}
