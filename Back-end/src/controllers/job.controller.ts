import { type NextFunction, type Request, type Response } from "express";
import JobService from "../services/job.service.js";
import { JobStatus } from "@prisma/client";
import type { UpdateJobStatusInput } from "../dtos/job.dto.js";

export class JobController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { title, company, url, location, salaryExpect, description } =
        req.body;
      if (!title || !company || !url) {
        res
          .status(400)
          .json({ error: "Titulo, empresa e URL sao obrigatorios." });
        return;
      }

      const newJob = await JobService.createJob({
        title,
        company,
        url,
        location,
        salaryExpect,
        description,
      });
      res.status(201).json(newJob);
    } catch (error) {
      next(error);
    }
  }

  static async list(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const jobs = await JobService.getAllJobs();
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }

  static async show(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const job = await JobService.getJobId(id);
      res.status(200).json(job);
    } catch (error) {
      next(error);
    }
  }

  static async changeStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status, notes } = req.body as UpdateJobStatusInput;

      if (!status || !Object.values(JobStatus).includes(status as JobStatus)) {
        res.status(400).json({ error: "Status informado invalido." });
        return;
      }

      const updatedJob = await JobService.updateJobStatus(
        id,
        status as JobStatus,
        notes,
      );
      res.status(200).json(updatedJob);
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      await JobService.deleteJob(id);
      res.status(200).json({ message: "Vaga excluida com sucesso." });
    } catch (error) {
      next(error);
    }
  }

  static async getDashboard(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const dashboard = await JobService.getDashboard()
      res.status(200).json(dashboard)
    } catch (error) {
      next(error)
    }
  }
}

export default JobController;
