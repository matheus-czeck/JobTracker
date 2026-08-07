import { JobStatus } from "@prisma/client";
import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório"),
  company: z.string().trim().min(1, "Empresa é obrigatória"),
  url: z
    .string()
    .trim()
    .pipe(
      z.url({
        error: "URL invalida",
      }),
    ),

  location: z.string().trim().optional(),
  salaryExpect: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

export const updateJobSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório"),
  company: z.string().trim().min(1, "Empresa é obrigatória"),
  url: z
    .string()
    .trim()
    .pipe(
      z.url({
        error: "URL inválida",
      }),
    ),

  location: z.string().trim().optional(),
  salaryExpect: z.string().trim().optional(),
  description: z.string().trim().optional(),

  currentStatus: z.enum(JobStatus),
});
