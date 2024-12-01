import express from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "@/routes/v1/routes";
import fs from "fs";
import path from "path";

// Dynamically load swagger.json
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "docs/swagger.json"), "utf8")
);

const app = express();

app.use(express.json());

RegisterRoutes(app);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ========================
// ERROR Handler
// ========================
// gobal error handler

export default app;
