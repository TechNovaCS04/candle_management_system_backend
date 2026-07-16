import { registry } from "../registry";
import {
  errorResponses,
  IdParamsSchema,
  jsonBody,
  jsonResponse,
  PageQuerySchema,
  secured,
} from "../common";
import { AttendanceBodySchema } from "../request-schemas";
import {
  AttendanceListResponseSchema,
  AttendanceResponseSchema,
  MessageResponseSchema,
} from "../response-schemas";

export function registerAttendancePaths() {
  registry.registerPath({
    method: "get",
    path: "/api/attendance",
    tags: ["Attendance"],
    summary: "List attendance records",
    description:
      "Paginated attendance. Query supports `page` and `pageSize` only (`search` / `isActive` are ignored).",
    ...secured,
    request: { query: PageQuerySchema },
    responses: {
      200: jsonResponse(AttendanceListResponseSchema, "Paginated attendance"),
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/attendance",
    tags: ["Attendance"],
    summary: "Create attendance record",
    description:
      "Records attendance for an employee on a date. Duplicate employee+date returns `409`. Status: `PRESENT` | `ABSENT` | `LEAVE` | `HALF_DAY`.",
    ...secured,
    request: { body: jsonBody(AttendanceBodySchema) },
    responses: {
      201: jsonResponse(AttendanceResponseSchema, "Attendance created"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
      409: errorResponses[409],
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/attendance/{id}",
    tags: ["Attendance"],
    summary: "Get attendance by ID",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(AttendanceResponseSchema, "Attendance"),
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/attendance/{id}",
    tags: ["Attendance"],
    summary: "Update attendance record",
    ...secured,
    request: {
      params: IdParamsSchema,
      body: jsonBody(AttendanceBodySchema),
    },
    responses: {
      200: jsonResponse(AttendanceResponseSchema, "Updated attendance"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
      409: errorResponses[409],
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/api/attendance/{id}",
    tags: ["Attendance"],
    summary: "Delete attendance record",
    ...secured,
    request: { params: IdParamsSchema },
    responses: {
      200: jsonResponse(MessageResponseSchema, "Attendance deleted"),
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });
}
