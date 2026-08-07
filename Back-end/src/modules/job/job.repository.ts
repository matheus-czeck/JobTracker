import { JobStatus } from "@prisma/client";
import prisma from "../../shared/database.js";
import JobEntity from "./job.entity.js";
import { AppError } from "../../shared/errors/app.error.js";
import { error } from "node:console";

class JobRepository {
  static async create(job: JobEntity): Promise<JobEntity> {
    const data = job.toPersistence();

    const createdJob = await prisma.$transaction(async (tx) => {
      const job = await tx.jobOpportunity.create({
        data: {
          userId: data.userId,
          title: data.title,
          company: data.company,
          url: data.url,
          location: data.location ?? null,
          salaryExpect: data.salaryExpect ?? null,
          description: data.description ?? null,
          currentStatus: data.currentStatus,
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

    return JobEntity.restore({
      id: createdJob.id,
      userId: createdJob.userId,
      title: createdJob.title,
      company: createdJob.company,
      url: createdJob.url,
      location: createdJob.location ?? undefined,
      salaryExpect: createdJob.salaryExpect ?? undefined,
      description: createdJob.description ?? undefined,
      currentStatus: createdJob.currentStatus,
    });
  }

  static async findById(
    userId: string,
    jobId: string,
  ): Promise<JobEntity | null> {
    const job = await prisma.jobOpportunity.findFirst({
      where: {
        id: jobId,
        userId,
      },
    });
    if (!job) return null;

    return JobEntity.restore({
      id: job.id,
      userId: job.userId,
      title: job.title,
      company: job.company,
      url: job.url,
      location: job.location ?? undefined,
      salaryExpect: job.salaryExpect ?? undefined,
      description: job.description ?? undefined,
      currentStatus: job.currentStatus,
    });
  }

  static async findAll(userId: string): Promise<JobEntity[]> {
    const jobs = await prisma.jobOpportunity.findMany({
      where: {
        userId,
      },
    });

    return jobs.map((job) =>
      JobEntity.restore({
        id: job.id,
        userId: job.userId,
        title: job.title,
        company: job.company,
        url: job.url,
        location: job.location ?? undefined,
        salaryExpect: job.salaryExpect ?? undefined,
        description: job.description ?? undefined,
        currentStatus: job.currentStatus,
      }),
    );
  }

  static async update(
    job: JobEntity,
    oldStatus: JobStatus,
  ): Promise<JobEntity> {
    const data = job.toPersistence();

    const updatedJob = await prisma.$transaction(async (tx) => {
      const job = await tx.jobOpportunity.update({
        where: {
          id: data.id!,
        },
        data: {
          title: data.title,
          company: data.company,
          url: data.url,
          location: data.location ?? null,
          salaryExpect: data.salaryExpect ?? null,
          description: data.description ?? null,
          currentStatus: data.currentStatus,
        },
      });
      if (oldStatus !== data.currentStatus) {
        await tx.jobHistory.create({
          data: {
            jobOpportunityId: job.id,
            oldStatus,
            newStatus: data.currentStatus,
            notes: "Status atualizado",
          },
        });
      }
      return job;
    });

    return JobEntity.restore({
      id: updatedJob.id,
      userId: updatedJob.userId,
      title: updatedJob.title,
      company: updatedJob.company,
      url: updatedJob.url,
      location: updatedJob.location ?? undefined,
      salaryExpect: updatedJob.salaryExpect ?? undefined,
      description: updatedJob.description ?? undefined,
      currentStatus: updatedJob.currentStatus,
    });
  }

  static async delete(userId: string, jobId: string): Promise<void> {
    const result = await prisma.jobOpportunity.deleteMany({
      where: {
        id: jobId,
        userId,
      },
    });

    if (result.count === 0) throw new AppError("Vaga nao encontrada.", 404);
  }
}

export default JobRepository;
