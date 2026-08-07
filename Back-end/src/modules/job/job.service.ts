import { AppError } from "../../shared/errors/app.error.js";
import { JobStatus } from "@prisma/client";
import type { CreateJobDto, UpdateJobDto } from "./job.dto.js";
import JobEntity from "./job.entity.js";
import JobRepository from "./job.repository.js";
import JobMapper from "./job.mapper.js";

class JobService {
  static async createJob(userId: string, dto: CreateJobDto) {
    const job = JobEntity.create({
      id: undefined,
      userId,
      title: dto.title,
      company: dto.company,
      url: dto.url,
      location: dto.location ?? undefined,
      salaryExpect: dto.salaryExpect ?? undefined,
      description: dto.description ?? undefined,
      currentStatus: JobStatus.APLICADO,
    });

    const createdJob = await JobRepository.create(job);

    return JobMapper.toResponse(createdJob);
  }

  static async findAll(userId: string) {
    const jobs = await JobRepository.findAll(userId);
    return jobs.map((job) => JobMapper.toResponse(job));
  }

  static async findById(userId: string, jobId: string) {
    const job = await JobRepository.findById(userId, jobId);

    if (!job) throw new AppError("Vaga nao encontrada.", 404);

    return JobMapper.toResponse(job);
  }

  static async updateJob(userId: string, jobId: string, dto: UpdateJobDto) {
    const job = await JobRepository.findById(userId, jobId);

    if (!job) throw new AppError("Vaga nao encontrada", 404);

    const oldStatus = job.currentStatus;

    job.update({
      title: dto.title,
      company: dto.company,
      url: dto.url,
      location: dto.location,
      salaryExpect: dto.salaryExpect,
      description: dto.description,
      currentStatus: dto.currentStatus,
    });

    const updatedJob = await JobRepository.update(job, oldStatus);

    return JobMapper.toResponse(updatedJob);
  }

  static async deleteJob(userId: string, jobId: string): Promise<void> {
    await JobRepository.delete(userId, jobId);
  }


}

export default JobService;
