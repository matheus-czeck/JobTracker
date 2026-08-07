import { beforeEach, describe, expect, it, vi } from "vitest";
import { JobStatus } from "@prisma/client";

import JobService from "../modules/job/job.service.js";
import JobRepository from "../modules/job/job.repository.js";
import JobMapper from "../modules/job/job.mapper.js";
import JobEntity from "../modules/job/job.entity.js";
import { AppError } from "../shared/errors/app.error.js";

vi.mock("../modules/job/job.repository.js", () => ({
  default: {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../modules/job/job.mapper.js", () => ({
  default: {
    toResponse: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("JobService.createJob", () => {
  it("deve criar uma vaga com sucesso", async () => {
    const dto = {
      title: "Backend Developer",
      company: "OpenAI",
      url: "https://openai.com/jobs",
      location: "Remoto",
      salaryExpect: "10000",
      description: "Node.js",
    };

    const entity = JobEntity.create({
      id: undefined,
      userId: "user-id",
      ...dto,
      currentStatus: JobStatus.APLICADO,
    });

    vi.mocked(JobRepository.create).mockResolvedValue(entity);
    vi.mocked(JobMapper.toResponse).mockReturnValue(entity as never);

    const result = await JobService.createJob("user-id", dto);

    expect(JobRepository.create).toHaveBeenCalledTimes(1);
    expect(JobMapper.toResponse).toHaveBeenCalledWith(entity);
    expect(result).toEqual(entity);
  });
});
describe("JobService.findAll", () => {
  it("deve retornar todas as vagas do usuário", async () => {
    const entity = JobEntity.create({
      id: "job-id",
      userId: "user-id",
      title: "Backend Developer",
      company: "OpenAI",
      url: "https://openai.com/jobs",
      location: "Remoto",
      salaryExpect: "10000",
      description: "Node.js",
      currentStatus: JobStatus.APLICADO,
    });

    vi.mocked(JobRepository.findAll).mockResolvedValue([entity]);
    vi.mocked(JobMapper.toResponse).mockImplementation((job) => job as never);

    const result = await JobService.findAll("user-id");

    expect(JobRepository.findAll).toHaveBeenCalledWith("user-id");
    expect(JobMapper.toResponse).toHaveBeenCalledTimes(1);
    expect(result).toEqual([entity]);
  });
});
describe("JobService.findById", () => {
  it("deve retornar uma vaga existente", async () => {
    const entity = JobEntity.create({
      id: "job-id",
      userId: "user-id",
      title: "Backend Developer",
      company: "OpenAI",
      url: "https://openai.com/jobs",
      location: "Remoto",
      salaryExpect: "10000",
      description: "Node.js",
      currentStatus: JobStatus.APLICADO,
    });

    vi.mocked(JobRepository.findById).mockResolvedValue(entity);
    vi.mocked(JobMapper.toResponse).mockReturnValue(entity as never);

    const result = await JobService.findById("user-id", "job-id");

    expect(JobRepository.findById).toHaveBeenCalledWith("user-id", "job-id");

    expect(result).toEqual(entity);
  });

  it("deve lançar AppError quando a vaga não existir", async () => {
    vi.mocked(JobRepository.findById).mockResolvedValue(null);

    await expect(
      JobService.findById("user-id", "job-id"),
    ).rejects.toBeInstanceOf(AppError);
  });
});

describe("JobService.updateJob", () => {
  it("deve atualizar uma vaga com sucesso", async () => {
    const entity = JobEntity.create({
      id: "job-id",
      userId: "user-id",
      title: "Backend Developer",
      company: "OpenAI",
      url: "https://openai.com/jobs",
      location: "Remoto",
      salaryExpect: "10000",
      description: "Node.js",
      currentStatus: JobStatus.APLICADO,
    });

    const dto = {
      title: "Senior Backend Developer",
      company: "OpenAI",
      url: "https://openai.com/jobs",
      location: "Remoto",
      salaryExpect: "15000",
      description: "Node.js + NestJS",
      currentStatus: JobStatus.ENTREVISTA,
    };

    const updatedEntity = JobEntity.create({
      id: "job-id",
      userId: "user-id",
      ...dto,
    });

    vi.mocked(JobRepository.findById).mockResolvedValue(entity);
    vi.mocked(JobRepository.update).mockResolvedValue(updatedEntity);
    vi.mocked(JobMapper.toResponse).mockReturnValue(updatedEntity as never);

    const result = await JobService.updateJob("user-id", "job-id", dto);

    expect(JobRepository.findById).toHaveBeenCalledWith("user-id", "job-id");

    expect(JobRepository.update).toHaveBeenCalled();

    expect(JobMapper.toResponse).toHaveBeenCalledWith(updatedEntity);

    expect(result).toEqual(updatedEntity);
  });

  it("deve lançar AppError quando a vaga não existir", async () => {
    vi.mocked(JobRepository.findById).mockResolvedValue(null);

    await expect(
      JobService.updateJob("user-id", "job-id", {} as never),
    ).rejects.toBeInstanceOf(AppError);
  });
});
describe("JobService.deleteJob", () => {
  describe("JobService.deleteJob", () => {
    it("deve excluir uma vaga", async () => {
      vi.mocked(JobRepository.delete).mockResolvedValue(undefined);

      await JobService.deleteJob("user-id", "job-id");

      expect(JobRepository.delete).toHaveBeenCalledWith("user-id", "job-id");
    });
  });

});
