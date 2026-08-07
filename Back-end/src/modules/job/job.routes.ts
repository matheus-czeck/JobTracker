import { Router } from "express";
import { JobController } from "./job.controller.js";
import AuthMiddleware from "../../shared/middleware/auth.middleware.js";

const jobRoutes = Router();

jobRoutes.use(AuthMiddleware.authenticate);

jobRoutes.get("/jobs", JobController.list);
jobRoutes.post("/jobs", JobController.create);
jobRoutes.get("/jobs/:id", JobController.show);
jobRoutes.put("/jobs/:id", JobController.update);
jobRoutes.delete("/jobs/:id", JobController.delete);

export default jobRoutes;
