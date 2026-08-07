import { JobStatus } from "@prisma/client";
import { z } from "zod";
import { createJobSchema, updateJobSchema } from "./job.schema.js";

export type CreateJobDto = z.infer<typeof createJobSchema>;

export type UpdateJobDto = z.infer<typeof updateJobSchema>;

export interface ResponseJobDto {
  id: string;
  title: string;
  company: string;
  url: string;

  location: string | undefined;
  salaryExpect: string | undefined;
  description: string | undefined;

  currentStatus: JobStatus;
}