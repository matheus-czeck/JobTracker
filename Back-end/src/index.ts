import express from "express";
import cors from "cors";
import jobRoutes from "./modules/job/job.routes.js";
import AuthRoutes from "./modules/auth/auth.routes.js";
import { defaultError } from "./shared/middleware/error.handler.js";

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") ?? [
      "http://localhost:4200",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api", AuthRoutes);
app.use("/api", jobRoutes);
app.use(defaultError);

export default app;
