import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { getOpenApiDocument } from "./openapi";

export function setupSwagger(app: Express) {
  const document = getOpenApiDocument();

  app.get("/api/docs.json", (_req: Request, res: Response) => {
    res.json(document);
  });

  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(document, {
      customSiteTitle: "SCMS API Docs",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "list",
        filter: true,
        tryItOutEnabled: true,
      },
    })
  );
}
