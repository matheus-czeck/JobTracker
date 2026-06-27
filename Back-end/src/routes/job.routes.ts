import { Router } from "express";
import { JobController } from "../controllers/job.controller.js";

const jobRoutes = Router();

jobRoutes.post("/jobs", JobController.create);
jobRoutes.get("/jobs", JobController.list);
jobRoutes.get("/jobs/dashboard", JobController.getDashboard)
jobRoutes.get("/jobs/:id", JobController.show);
jobRoutes.patch("/jobs/:id/status", JobController.changeStatus);
jobRoutes.delete("/jobs/:id", JobController.delete);

export default jobRoutes;
