import { registry } from "../registry";
import {
  errorResponses,
  IdParamsSchema,
  jsonBody,
  jsonResponse,
  ListQuerySchema,
  secured,
} from "../common";
import { EmployeeBodySchema } from "../request-schemas";
import {
  EmployeeListResponseSchema,
  EmployeeResponseSchema,
  MessageResponseSchema,
} from "../response-schemas";

export function registerEmployeePaths() {
  registry.registerPath({
    method: "get",
    path: "/api/employees",
    tags: ["Employees"],
    summary: "List employees",
    description: "Paginated employees. Supports `search` on name/phone and `isActive` filter.",
    ...secured,
    request: { query: ListQuerySchema },
    responses: {
      200: jsonResponse(EmployeeListResponseSchema, "Paginated employees"),
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/employees",
    tags: ["Employees"],
    summary: "Create employee",
    description:
      "`position` must be one of: `MANAGER`, `PRODUCTION_STAFF`, `SALES_STAFF`, `ACCOUNTANT`, `OTHER`.",
    ...secured,
    request: { body: jsonBody(EmployeeBodySchema) },
    responses: {
      201: jsonResponse(EmployeeResponseSchema, "Employee created"),
      400: errorResponses[400],
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/employees/{id}",
    tags: ["Employees"],
    summary: "Get employee by ID",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(EmployeeResponseSchema, "Employee"),
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/employees/{id}",
    tags: ["Employees"],
    summary: "Update employee",
    ...secured,
    request: {
      params: IdParamsSchema,
      body: jsonBody(EmployeeBodySchema),
    },
    responses: {
      200: jsonResponse(EmployeeResponseSchema, "Updated employee"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/api/employees/{id}",
    tags: ["Employees"],
    summary: "Delete employee",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(MessageResponseSchema, "Employee deleted"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });
}
