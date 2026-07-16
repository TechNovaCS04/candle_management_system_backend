import { registry } from "../registry";
import { errorResponses, jsonBody, jsonResponse, secured } from "../common";
import {
  ChangePasswordBodySchema,
  LoginBodySchema,
  RegisterBodySchema,
} from "../request-schemas";
import {
  AuthTokenResponseSchema,
  MeResponseSchema,
  MessageResponseSchema,
} from "../response-schemas";

export function registerAuthPaths() {
  registry.registerPath({
    method: "post",
    path: "/api/auth/register",
    tags: ["Auth"],
    summary: "Register admin user",
    description: `Creates an admin account and returns a JWT.

**Rules**
- The **first** user can always register.
- After that, registration is allowed only when \`ALLOW_PUBLIC_REGISTER\` is not \`false\`.
- Duplicate emails return \`409\`.

**Seed credentials** (after \`npm run db:seed\`): \`admin@sangeetha.lk\` / \`admin123\`.`,
    request: { body: jsonBody(RegisterBodySchema, "Admin registration payload") },
    responses: {
      201: jsonResponse(AuthTokenResponseSchema, "Registered; JWT issued"),
      400: errorResponses[400],
      403: errorResponses[403],
      409: errorResponses[409],
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/auth/login",
    tags: ["Auth"],
    summary: "Login",
    description: `Authenticates an admin and returns a JWT Bearer token.

Copy the \`token\` from the response, click **Authorize** in Swagger UI, and paste it (without the \`Bearer \` prefix) to call protected endpoints.`,
    request: { body: jsonBody(LoginBodySchema, "Login credentials") },
    responses: {
      200: jsonResponse(AuthTokenResponseSchema, "Login successful"),
      400: errorResponses[400],
      401: errorResponses[401],
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/auth/logout",
    tags: ["Auth"],
    summary: "Logout",
    description:
      "Stateless logout helper. The API does **not** revoke JWTs; the client should discard the stored token. No authentication required.",
    responses: {
      200: jsonResponse(MessageResponseSchema, "Logged out successfully"),
    },
  });

  registry.registerPath({
    method: "get",
    path: "/api/auth/me",
    tags: ["Auth"],
    summary: "Current admin profile",
    description: "Returns the authenticated admin profile from the JWT subject.",
    ...secured,
    responses: {
      200: jsonResponse(MeResponseSchema, "Current admin"),
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/auth/password",
    tags: ["Auth"],
    summary: "Change password",
    description:
      "Updates the authenticated admin password. Requires the current password. New password must be at least 6 characters.",
    ...secured,
    request: { body: jsonBody(ChangePasswordBodySchema, "Password change payload") },
    responses: {
      200: jsonResponse(MessageResponseSchema, "Password updated"),
      400: errorResponses[400],
      401: errorResponses[401],
      404: errorResponses[404],
    },
  });
}
