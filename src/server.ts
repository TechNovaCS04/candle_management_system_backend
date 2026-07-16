import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

async function bootstrap() {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`SCMS backend listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
