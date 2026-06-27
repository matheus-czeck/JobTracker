import express from "express";
import cors from "cors";
import jobRoutes from "./routes/job.routes.js";
import { defaultError } from "./middleware/error.handler.js";

const app = express();

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());
app.use("/api", jobRoutes);
app.use(defaultError);

export default app;
