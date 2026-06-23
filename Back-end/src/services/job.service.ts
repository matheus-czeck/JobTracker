import prisma from "../repositories/database.js";
import { JobStatus } from "@prisma/client";

interface CreateJobInput {
  title: string;
  company: string;
  url: string;
  location?: string;
  salaryExpect?: string;
  description?: string;
}

class JobService {
  static async createJob(data: CreateJobInput) {
    return await prisma.$transaction(async (tx: any) => {
      const job = await tx.jobOpportunity.create({
        data: {
          title: data.title,
          company: data.company,
          url: data.url,
          location: data.location,
          salaryExpect: data.salaryExpect,
          description: data.description,
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
    return await prisma.jobOpportunity.findUnique({
      where: { id },
      include: {
        history: {
          orderBy: {
            changedAt: "desc",
          },
        },
      },
    });
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
        throw new Error("Vaga nao encontrada.");
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
    return await prisma.jobOpportunity.delete({
      where: { id },
    });
  }
}

export default JobService;
