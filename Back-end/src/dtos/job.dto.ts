export interface CreateJobInput {
  title: string;
  company: string;
  url: string;
  location?: string;
  salaryExpect?: string;
  description?: string;
}

export interface UpdateJobStatusInput {
    status: string
    notes?: string
}