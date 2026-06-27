import { AppError } from "../errors/app.error.js";
import prisma from "../repositories/database.js";
import { JobStatus } from "@prisma/client";
import type { CreateJobInput } from "../dtos/job.dto.js";

class JobService {
  static async createJob(data: CreateJobInput) {
    return await prisma.$transaction(async (tx) => {
      const job = await tx.jobOpportunity.create({
        data: {
          title: data.title,
          company: data.company,
          url: data.url,
          location: data.location ?? null,
          salaryExpect: data.salaryExpect ?? null,
          description: data.description ?? null,
          currentStatus: JobStatus.APLICADO,
        },
      });

      await tx.jobHistory.create({
        data: {
          jobOpportunityId: job.id,
          oldStatus: null,
          newStatus: JobStatus.APLICADO,
          notes: "Candidatura registrada no JobTracker",
        },
      });

      return job;
    });
  }

  static async getAllJobs() {
    return await prisma.jobOpportunity.findMany({
      include: {
        _count: {
          select: { history: true },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }
  static async getJobId(id: string) {
    const job = await prisma.jobOpportunity.findUnique({
      where: { id },
      include: {
        history: {
          orderBy: {
            changedAt: "desc",
          },
        },
      },
    });

    if (!job) {
      throw new AppError("Vaga nao encontrada.", 404);
    }

    return job;
  }

  static async updateJobStatus(
    id: string,
    newStatus: JobStatus,
    notes?: string,
  ) {
    return await prisma.$transaction(async (tx) => {
      const currentJob = await tx.jobOpportunity.findUnique({
        where: { id },
        select: { currentStatus: true },
      });
      if (!currentJob) {
        throw new AppError("Vaga nao encontrada.", 404);
      }

      if (currentJob.currentStatus === newStatus) {
        return tx.jobOpportunity.findUnique({ where: { id } });
      }

      const updatedJob = await tx.jobOpportunity.update({
        where: { id },
        data: {
          currentStatus: newStatus,
        },
      });

      await tx.jobHistory.create({
        data: {
          jobOpportunityId: id,
          oldStatus: currentJob.currentStatus,
          newStatus: newStatus,
          notes: notes || `Status atualizado para ${newStatus}`,
        },
      });
      return updatedJob;
    });
  }

  static async deleteJob(id: string) {
    try {
      return await prisma.jobOpportunity.delete({
        where: { id },
      });
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        err.code === "P2025"
      ) {
        throw new AppError("Vaga nao encontrada para exclusao.", 404);
      }
      throw new AppError("Erro ao processar a exclusao da vaga.", 500);
    }
  }

  static async getDashboard() {
    const counts = await prisma.jobOpportunity.groupBy({
      by: ["currentStatus"],
      _count: { currentStatus: true },
    });

    const total = await prisma.jobOpportunity.count();

    const dashBoard = {
      APLICADO: 0,
      TRIAGEM: 0,
      ENTREVISTA: 0,
      TESTE_TECNICO: 0,
      PROPOSTA: 0,
      PROPOSTA_ACEITA: 0,
      REJEITADO: 0,
      DESISTENCIA: 0,
    };

    counts.forEach((item) => {
      dashBoard[item.currentStatus] = item._count.currentStatus 
    });

    return { total, ...dashBoard}
  }
}

export default JobService;
