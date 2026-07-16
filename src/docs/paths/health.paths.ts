import { registry } from "../registry";
import { jsonResponse } from "../common";
import { HealthResponseSchema } from "../response-schemas";

export function registerHealthPaths() {
  registry.registerPath({
    method: "get",
    path: "/api/health",
    tags: ["Health"],
    summary: "Health check",
    description:
      "Public liveness probe. Returns API status and the current `NODE_ENV`. No authentication required.",
    responses: {
      200: jsonResponse(HealthResponseSchema, "API is running"),
    },
  });
}
