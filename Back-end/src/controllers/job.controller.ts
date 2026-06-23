import { type Request, type Response } from "express";
import JobService from "../services/job.service.js";
import { JobStatus } from "@prisma/client";

export class JobController {
  static async create(req: Request, res: Response): Promise<void> {
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
      res
        .status(500)
        .json({ error: "Erro interno do servidor ao salvar a vaga." });
    }
  }

  static async list(req: Request, res: Response): Promise<void> {
    try {
      const jobs = await JobService.getAllJobs();
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar vagas." });
    }
  }

  static async show(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const job = await JobService.getJobId(id);

      if (!job) {
        res.status(404).json({ error: "Vaga nao encontrada." });
        return;
      }
      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar detalhes da vaga" });
    }
  }

  static async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status, notes } = req.body;

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
      res
        .status(500)
        .json({ error: "Erro ao atualizar status da candidatura" });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await JobService.deleteJob(id);
      res.status(200).json({ message: "Vaga excluida com sucesso." });
    } catch (error: any) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "Vaga nao encontrada para exclusao." });
        return;
      }
      res.status(500).json({error: "Erro ao processar a exclusao da vaga."})
    }
  }
}

export default JobController;
