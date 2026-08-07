import { type Request, type Response } from "express";
import JobService from "./job.service.js";
import { createJobSchema, updateJobSchema } from "./job.schema.js";
import { AppError } from "../../shared/errors/app.error.js";

export class JobController {
  static async create(req: Request, res: Response): Promise<void> {
    const dto = createJobSchema.parse(req.body);

    const job = await JobService.createJob(req.userId, dto);

    res.status(201).json(job);
  }

  static async list(req: Request, res: Response): Promise<void> {
    const job = await JobService.findAll(req.userId);
    res.status(200).json(job);
  }

  static async show(req: Request, res: Response): Promise<void> {
    const jobId = req.params.id;
    if (!jobId || Array.isArray(jobId))
      throw new AppError("Id da vaga invalido", 400);

    const job = await JobService.findById(req.userId, jobId);

    res.status(200).json(job);
  }

  static async update(req: Request, res: Response): Promise<void> {
    const jobId = req.params.id;
    if (!jobId || Array.isArray(jobId))
      throw new AppError("Id da vaga invalido", 400);
    const dto = updateJobSchema.parse(req.body);

    const job = await JobService.updateJob(req.userId, jobId, dto);

    res.status(200).json(job);
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const jobId = req.params.id;
    if (!jobId || Array.isArray(jobId))
      throw new AppError("Id da vaga invalido", 400);
    await JobService.deleteJob(req.userId, jobId);

    res.sendStatus(204);
  }
}

export default JobController;
