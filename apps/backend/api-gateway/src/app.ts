import express, { Request, Response, NextFunction } from "express";
import applyProxy from "./middlewares/proxy";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authenticateToken, routeConfigMiddleware } from "./middlewares/auth";
import corsOptions from "./middlewares/cors";

const app = express();

app.use(cookieParser());
app.use(cors(corsOptions));

app.get("/test", (_req: Request, res: Response, _next: NextFunction) => {
  res.json({ message: "Healthy gateway" });
});

app.use(routeConfigMiddleware);
app.use(authenticateToken);

applyProxy(app);

// ========================
// ERROR Handler / Global
// ========================

export default app;
