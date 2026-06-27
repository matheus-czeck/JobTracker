// ============================================================
// TESTES UNITÁRIOS — JobService
// ============================================================
// O que é um mock?
// Como o service usa o Prisma para acessar o banco, precisamos
// "fingir" que o banco existe durante os testes. Isso se chama
// mock — uma versão falsa e controlada de uma dependência.
// Assim os testes rodam sem precisar do PostgreSQL.
// ============================================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import { JobStatus } from "@prisma/client";

// 1. Criamos o mock do Prisma ANTES de importar o service
vi.mock("../repositories/database.js", () => {
  return {
    default: {
      $transaction: vi.fn(),
      jobOpportunity: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

// 2. Agora importamos o service e o mock do prisma
import JobService from "../services/job.service.js";
import prisma from "../repositories/database.js";
import { AppError } from "../errors/app.error.js";

// ============================================================
// beforeEach — roda antes de cada teste
// Limpa os mocks para que um teste não influencie o outro
// ============================================================
beforeEach(() => {
  vi.clearAllMocks();
});

// ============================================================
// describe — agrupa testes relacionados
// ============================================================

describe("JobService.createJob", () => {
  it("deve criar uma vaga com status APLICADO", async () => {
    // ARRANGE — prepara os dados e o comportamento esperado
    const inputData = {
      title: "Desenvolvedor Full Stack",
      company: "Tech Company",
      url: "https://empresa.com/vaga",
      location: "Remoto",
    };

    const vagaCriada = {
      id: "uuid-123",
      ...inputData,
      currentStatus: JobStatus.APLICADO,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Simulamos o $transaction executando a função que recebe
    const mockTransaction = vi.mocked(prisma.$transaction);
    mockTransaction.mockImplementation(async (fn: any) => {
      const tx = {
        jobOpportunity: {
          create: vi.fn().mockResolvedValue(vagaCriada),
        },
        jobHistory: {
          create: vi.fn().mockResolvedValue({}),
        },
      };
      return fn(tx);
    });

    // ACT — executa o que queremos testar
    const resultado = await JobService.createJob(inputData);

    // ASSERT — verifica se o resultado é o esperado
    expect(resultado).toEqual(vagaCriada);
    expect(resultado.currentStatus).toBe(JobStatus.APLICADO);
  });
});

// ============================================================

describe("JobService.getAllJobs", () => {
  it("deve retornar lista de vagas ordenada por data", async () => {
    // ARRANGE
    const vagasMock = [
      {
        id: "uuid-1",
        title: "Dev Frontend",
        company: "Empresa A",
        url: "https://a.com",
        currentStatus: JobStatus.APLICADO,
        _count: { history: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "uuid-2",
        title: "Dev Backend",
        company: "Empresa B",
        url: "https://b.com",
        currentStatus: JobStatus.ENTREVISTA,
        _count: { history: 3 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(prisma.jobOpportunity.findMany).mockResolvedValue(vagasMock as any);

    // ACT
    const resultado = await JobService.getAllJobs();

    // ASSERT
    expect(resultado).toHaveLength(2);
    expect(resultado[0].company).toBe("Empresa A");
    expect(prisma.jobOpportunity.findMany).toHaveBeenCalledTimes(1);
  });

  it("deve retornar lista vazia quando não há vagas", async () => {
    vi.mocked(prisma.jobOpportunity.findMany).mockResolvedValue([]);

    const resultado = await JobService.getAllJobs();

    expect(resultado).toEqual([]);
  });
});

// ============================================================

describe("JobService.getJobId", () => {
  it("deve retornar uma vaga com seu histórico", async () => {
    // ARRANGE
    const vagaMock = {
      id: "uuid-123",
      title: "Dev Full Stack",
      company: "Tech Co",
      url: "https://tech.com",
      currentStatus: JobStatus.ENTREVISTA,
      history: [
        {
          id: "hist-1",
          oldStatus: null,
          newStatus: JobStatus.APLICADO,
          changedAt: new Date(),
        },
        {
          id: "hist-2",
          oldStatus: JobStatus.APLICADO,
          newStatus: JobStatus.ENTREVISTA,
          changedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.jobOpportunity.findUnique).mockResolvedValue(vagaMock as any);

    // ACT
    const resultado = await JobService.getJobId("uuid-123");

    // ASSERT
    expect(resultado).not.toBeNull();
    expect(resultado?.history).toHaveLength(2);
    expect(prisma.jobOpportunity.findUnique).toHaveBeenCalledWith({
      where: { id: "uuid-123" },
      include: { history: { orderBy: { changedAt: "desc" } } },
    });
  });

  it("deve retornar null quando a vaga não existe", async () => {
    vi.mocked(prisma.jobOpportunity.findUnique).mockResolvedValue(null);

    await expect(JobService.getJobId("id-inexistente")).rejects.toThrow(AppError)
  });
});

// ============================================================

describe("JobService.updateJobStatus", () => {
  it("deve atualizar o status e registrar no histórico", async () => {
    // ARRANGE
    const vagaAtualizada = {
      id: "uuid-123",
      title: "Dev Full Stack",
      company: "Tech Co",
      url: "https://tech.com",
      currentStatus: JobStatus.ENTREVISTA,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => {
      const tx = {
        jobOpportunity: {
          findUnique: vi.fn().mockResolvedValue({
            currentStatus: JobStatus.APLICADO,
          }),
          update: vi.fn().mockResolvedValue(vagaAtualizada),
        },
        jobHistory: {
          create: vi.fn().mockResolvedValue({}),
        },
      };
      return fn(tx);
    });

    // ACT
    const resultado = await JobService.updateJobStatus(
      "uuid-123",
      JobStatus.ENTREVISTA,
      "Chamado para entrevista técnica"
    );

    // ASSERT
    expect(resultado?.currentStatus).toBe(JobStatus.ENTREVISTA);
  });

  it("deve lançar erro quando a vaga não existe", async () => {
    // ARRANGE
    vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => {
      const tx = {
        jobOpportunity: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      };
      return fn(tx);
    });

    // ACT & ASSERT
    await expect(
      JobService.updateJobStatus("id-inexistente", JobStatus.ENTREVISTA)
    ).rejects.toThrow("Vaga nao encontrada.");
  });

  it("não deve atualizar quando o status já é o mesmo", async () => {
    // ARRANGE
    const vagaMesmoStatus = {
      id: "uuid-123",
      currentStatus: JobStatus.APLICADO,
    };

    vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => {
      const tx = {
        jobOpportunity: {
          findUnique: vi.fn()
            .mockResolvedValueOnce({ currentStatus: JobStatus.APLICADO })
            .mockResolvedValueOnce(vagaMesmoStatus),
        },
      };
      return fn(tx);
    });

    // ACT
    const resultado = await JobService.updateJobStatus(
      "uuid-123",
      JobStatus.APLICADO
    );

    // ASSERT — retorna a vaga mas não cria histórico
    expect(resultado).toEqual(vagaMesmoStatus);
  });
});

// ============================================================

describe("JobService.deleteJob", () => {
  it("deve deletar uma vaga pelo id", async () => {
    // ARRANGE
    const vagaDeletada = {
      id: "uuid-123",
      title: "Dev Full Stack",
      company: "Tech Co",
      url: "https://tech.com",
      currentStatus: JobStatus.REJEITADO,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.jobOpportunity.delete).mockResolvedValue(vagaDeletada as any);

    // ACT
    const resultado = await JobService.deleteJob("uuid-123");

    // ASSERT
    expect(resultado.id).toBe("uuid-123");
    expect(prisma.jobOpportunity.delete).toHaveBeenCalledWith({
      where: { id: "uuid-123" },
    });
  });
});