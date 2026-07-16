import { z } from "zod";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { DEMO_UUID } from "./examples";
import { ErrorResponseSchema } from "./response-schemas";

export const IdParamsSchema = z.object({
  id: z.string().uuid().openapi({
    param: { name: "id", in: "path" },
    example: DEMO_UUID,
    description: "Resource UUID",
  }),
});

/** Full list filters: page, pageSize, search, isActive */
export const ListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().openapi({
    param: { name: "page", in: "query" },
    example: 1,
    description: "Page number (default: 1)",
  }),
  pageSize: z.coerce.number().int().min(1).max(100).optional().openapi({
    param: { name: "pageSize", in: "query" },
    example: 10,
    description: "Items per page (default: 10, max: 100)",
  }),
  search: z.string().optional().openapi({
    param: { name: "search", in: "query" },
    example: "lavender",
    description: "Case-insensitive search across entity-specific fields",
  }),
  isActive: z.enum(["true", "false"]).optional().openapi({
    param: { name: "isActive", in: "query" },
    example: "true",
    description: 'Filter by active flag (`"true"` or `"false"`)',
  }),
});

/** Pagination only (no search / isActive) */
export const PageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().openapi({
    param: { name: "page", in: "query" },
    example: 1,
    description: "Page number (default: 1)",
  }),
  pageSize: z.coerce.number().int().min(1).max(100).optional().openapi({
    param: { name: "pageSize", in: "query" },
    example: 10,
    description: "Items per page (default: 10, max: 100)",
  }),
});

/** Pagination + isActive (no search) — e.g. batches */
export const PageActiveQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().openapi({
    param: { name: "page", in: "query" },
    example: 1,
    description: "Page number (default: 1)",
  }),
  pageSize: z.coerce.number().int().min(1).max(100).optional().openapi({
    param: { name: "pageSize", in: "query" },
    example: 10,
    description: "Items per page (default: 10, max: 100)",
  }),
  isActive: z.enum(["true", "false"]).optional().openapi({
    param: { name: "isActive", in: "query" },
    example: "true",
    description: 'Filter by active flag (`"true"` or `"false"`)',
  }),
});

/** Pagination + search (expenses — always active only) */
export const PageSearchQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().openapi({
    param: { name: "page", in: "query" },
    example: 1,
    description: "Page number (default: 1)",
  }),
  pageSize: z.coerce.number().int().min(1).max(100).optional().openapi({
    param: { name: "pageSize", in: "query" },
    example: 10,
    description: "Items per page (default: 10, max: 100)",
  }),
  search: z.string().optional().openapi({
    param: { name: "search", in: "query" },
    example: "packaging",
    description: "Case-insensitive search on description",
  }),
});

/** Optional date range — both `from` and `to` must be present for filtering to apply */
export const DateRangeQuerySchema = z.object({
  from: z.string().optional().openapi({
    param: { name: "from", in: "query" },
    example: "2026-01-01",
    description: "Range start date (YYYY-MM-DD). Must be sent together with `to`.",
  }),
  to: z.string().optional().openapi({
    param: { name: "to", in: "query" },
    example: "2026-07-31",
    description: "Range end date (YYYY-MM-DD). Must be sent together with `from`.",
  }),
});

export function jsonBody<T extends z.ZodTypeAny>(schema: T, description?: string) {
  return {
    description,
    content: {
      "application/json": {
        schema,
      },
    },
  };
}

export function jsonResponse(schema: z.ZodTypeAny, description: string) {
  return {
    description,
    content: {
      "application/json": {
        schema,
      },
    },
  };
}

export const errorResponses = {
  400: jsonResponse(ErrorResponseSchema, "Validation or business rule error"),
  401: jsonResponse(ErrorResponseSchema, "Missing or invalid JWT, or invalid credentials"),
  403: jsonResponse(ErrorResponseSchema, "Forbidden (e.g. registration disabled)"),
  404: jsonResponse(ErrorResponseSchema, "Resource not found"),
  409: jsonResponse(ErrorResponseSchema, "Conflict (e.g. duplicate email or attendance)"),
} as const;

export const secured: Pick<RouteConfig, "security"> = {
  security: [{ bearerAuth: [] }],
};
