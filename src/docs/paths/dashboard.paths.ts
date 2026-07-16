import { registry } from "../registry";
import { errorResponses, jsonResponse, secured } from "../common";
import { DashboardSummaryResponseSchema } from "../response-schemas";

export function registerDashboardPaths() {
  registry.registerPath({
    method: "get",
    path: "/api/dashboard/summary",
    tags: ["Dashboard"],
    summary: "Dashboard summary",
    description: `Aggregated KPIs for the admin home screen:

- Product count, low-stock count, open batches, completed sales count
- Total revenue, expenses, and profit
- Latest 5 sales and current low-stock materials`,
    ...secured,
    responses: {
      200: jsonResponse(DashboardSummaryResponseSchema, "Dashboard summary"),
      401: errorResponses[401],
    },
  });
}
