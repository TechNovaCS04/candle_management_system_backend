import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import apiRoutes from "./routes/index";
import { authMiddleware } from "./middleware/auth.middleware";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware";
import { setupSwagger } from "./docs/swagger";
import "./models"; // register associations

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "validator.swagger.io"],
        connectSrc: ["'self'"],
      },
    },
  })
);
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "SCMS API is running", env: env.NODE_ENV });
});

setupSwagger(app);

app.use("/api/auth", authRoutes);
app.use("/api", authMiddleware, apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
