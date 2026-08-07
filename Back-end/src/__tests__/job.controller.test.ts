import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";

import JobController from "../modules/job/job.controller.js";
import JobService from "../modules/job/job.service.js";

vi.mock("../modules/job/job.service.js", () => ({
  default: {
    createJob: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    updateJob: vi.fn(),
    deleteJob: vi.fn(),
  },
}));

const mockResponse = () => {
  const res = {} as Response;

  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);

  return res;
};

const next = vi.fn() as NextFunction;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("JobController.create", () => {
  it("deve criar uma vaga", async () => {
    const req = {
      userId: "user-id",
      body: {
        title: "Backend",
        company: "OpenAI",
        url: "https://openai.com/jobs",
      },
    } as Request;

    const res = mockResponse();

    vi.mocked(JobService.createJob).mockResolvedValue({} as never);

    await JobController.create(req, res);

    expect(JobService.createJob).toHaveBeenCalledWith(
      "user-id",
      req.body,
    );

    expect(res.status).toHaveBeenCalledWith(201);
  });
});
describe("JobController.findAll", () => {
  it("deve listar as vagas", async () => {
    const req = {
      userId: "user-id",
    } as Request;

    const res = mockResponse();

    vi.mocked(JobService.findAll).mockResolvedValue([]);

    await JobController.list(req, res);

    expect(JobService.findAll).toHaveBeenCalledWith(
      "user-id",
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });
});