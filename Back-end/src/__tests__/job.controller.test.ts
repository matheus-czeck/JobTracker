import { describe, it, expect, vi, beforeEach } from "vitest";
import { JobStatus } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
import { AppError } from "../errors/app.error.js";

vi.mock("../services/job.service.js", () => ({
  default: {
    createJob: vi.fn(),
    getAllJobs: vi.fn(),
    getJobId: vi.fn(),
    updateJobStatus: vi.fn(),
    deleteJob: vi.fn(),
  },
}));

import JobController from "../controllers/job.controller.js";
import JobService from "../services/job.service.js";

// ============================================================
// Helpers
// ============================================================

const mockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  body: {},
  params: {},
  ...overrides,
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

// mockNext é declarado fora para ser reutilizado em todos os testes
// O beforeEach limpa as chamadas anteriores antes de cada teste
const mockNext = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

// ============================================================
// CREATE
// Testamos: criação com sucesso, validações de campo, erro do service
// ============================================================

describe("JobController.create", () => {
  it("deve criar uma vaga e retornar status 201", async () => {
    const req = mockRequest({
      body: {
        title: "Dev Full Stack",
        company: "Tech Co",
        url: "https://tech.com",
        location: "Remoto",
      },
    });
    const res = mockResponse();

    const vagaCriada = {
      id: "uuid-123",
      title: "Dev Full Stack",
      company: "Tech Co",
      url: "https://tech.com",
      currentStatus: JobStatus.APLICADO,
    };

    vi.mocked(JobService.createJob).mockResolvedValue(vagaCriada as any);

    await JobController.create(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(vagaCriada);
  });

  it("deve retornar 400 quando título está faltando", async () => {
    const req = mockRequest({
      body: { company: "Tech Co", url: "https://tech.com" },
    });
    const res = mockResponse();

    await JobController.create(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Titulo, empresa e URL sao obrigatorios.",
    });
    expect(JobService.createJob).not.toHaveBeenCalled();
  });

  it("deve retornar 400 quando empresa está faltando", async () => {
    const req = mockRequest({
      body: { title: "Dev Full Stack", url: "https://tech.com" },
    });
    const res = mockResponse();

    await JobController.create(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(JobService.createJob).not.toHaveBeenCalled();
  });

  it("deve repassar erro para o next quando o service falha", async () => {
    // O controller não trata mais o erro — repassa via next
    // Por isso verificamos o next, não o res.status
    const req = mockRequest({
      body: { title: "Dev", company: "Tech Co", url: "https://tech.com" },
    });
    const res = mockResponse();
    const erro = new Error("Erro no banco");

    vi.mocked(JobService.createJob).mockRejectedValue(erro);

    await JobController.create(req as Request, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(erro);
    expect(res.status).not.toHaveBeenCalled();
  });
});

// ============================================================
// LIST
// ============================================================

describe("JobController.list", () => {
  it("deve retornar lista de vagas com status 200", async () => {
    const vagas = [
      { id: "1", title: "Dev Frontend", company: "Empresa A" },
      { id: "2", title: "Dev Backend", company: "Empresa B" },
    ];
    vi.mocked(JobService.getAllJobs).mockResolvedValue(vagas as any);

    const req = mockRequest();
    const res = mockResponse();

    await JobController.list(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(vagas);
  });

  it("deve repassar erro para o next quando o service falha", async () => {
    const erro = new Error("Falha no banco");
    vi.mocked(JobService.getAllJobs).mockRejectedValue(erro);

    const req = mockRequest();
    const res = mockResponse();

    await JobController.list(req as Request, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(erro);
    expect(res.status).not.toHaveBeenCalled();
  });
});

// ============================================================
// SHOW
// ============================================================

describe("JobController.show", () => {
  it("deve retornar a vaga com status 200", async () => {
    const vaga = {
      id: "uuid-123",
      title: "Dev Full Stack",
      company: "Tech Co",
      history: [],
    };
    vi.mocked(JobService.getJobId).mockResolvedValue(vaga as any);

    const req = mockRequest({ params: { id: "uuid-123" } });
    const res = mockResponse();

    await JobController.show(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(vaga);
  });

  it("deve repassar AppError para o next quando vaga não existe", async () => {
    // O service agora lança AppError — o controller repassa via next
    // O errorHandler é quem converte isso em res.status(404)
    const erro = new AppError("Vaga nao encontrada.", 404);
    vi.mocked(JobService.getJobId).mockRejectedValue(erro);

    const req = mockRequest({ params: { id: "id-inexistente" } });
    const res = mockResponse();

    await JobController.show(req as Request, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(erro);
    expect(res.status).not.toHaveBeenCalled();
  });
});

// ============================================================
// CHANGE STATUS
// ============================================================

describe("JobController.changeStatus", () => {
  it("deve atualizar o status e retornar 200", async () => {
    const vagaAtualizada = {
      id: "uuid-123",
      currentStatus: JobStatus.ENTREVISTA,
    };
    vi.mocked(JobService.updateJobStatus).mockResolvedValue(vagaAtualizada as any);

    const req = mockRequest({
      params: { id: "uuid-123" },
      body: { status: "ENTREVISTA", notes: "Chamado para entrevista" },
    });
    const res = mockResponse();

    await JobController.changeStatus(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(vagaAtualizada);
  });

  it("deve retornar 400 quando o status é inválido", async () => {
    const req = mockRequest({
      params: { id: "uuid-123" },
      body: { status: "STATUS_INVALIDO" },
    });
    const res = mockResponse();

    await JobController.changeStatus(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Status informado invalido." });
    expect(JobService.updateJobStatus).not.toHaveBeenCalled();
  });

  it("deve retornar 400 quando o status não é enviado", async () => {
    const req = mockRequest({
      params: { id: "uuid-123" },
      body: {},
    });
    const res = mockResponse();

    await JobController.changeStatus(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(JobService.updateJobStatus).not.toHaveBeenCalled();
  });
});

// ============================================================
// DELETE
// ============================================================

describe("JobController.delete", () => {
  it("deve deletar uma vaga e retornar mensagem de sucesso", async () => {
    vi.mocked(JobService.deleteJob).mockResolvedValue({} as any);

    const req = mockRequest({ params: { id: "uuid-123" } });
    const res = mockResponse();

    await JobController.delete(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Vaga excluida com sucesso." });
  });

  it("deve repassar AppError 404 para o next quando vaga não existe", async () => {
    // O service agora lança AppError — não é mais o controller que trata P2025
    const erro = new AppError("Vaga nao encontrada para exclusao.", 404);
    vi.mocked(JobService.deleteJob).mockRejectedValue(erro);

    const req = mockRequest({ params: { id: "id-inexistente" } });
    const res = mockResponse();

    await JobController.delete(req as Request, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(erro);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("deve repassar erro genérico para o next", async () => {
    const erro = new Error("Erro inesperado");
    vi.mocked(JobService.deleteJob).mockRejectedValue(erro);

    const req = mockRequest({ params: { id: "uuid-123" } });
    const res = mockResponse();

    await JobController.delete(req as Request, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(erro);
    expect(res.status).not.toHaveBeenCalled();
  });
}); 