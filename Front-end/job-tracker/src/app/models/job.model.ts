export interface Job {
  id: string;
  title: string;
  company: string;
  url: string;
  currentStatus: string;
  updateAt: Date;

  location?: string;
  salaryExpect?: string;
  description?: string;
}

export interface JobHistory {
  id: string;
  newStatus: string;
  notes: string;
  changedAt: Date;
}

export interface JobDetail extends Job {
  history: JobHistory[];
}

export interface CreateJobInput {
  title: string
  company: string
  url: string
  location?:string 
  salaryExpect?: string
  description?: string
}

export interface JobDashboard {
  total: number
   APLICADO: number
  TRIAGEM: number
  ENTREVISTA: number
  TESTE_TECNICO: number
  PROPOSTA: number
  PROPOSTA_ACEITA: number
  REJEITADO: number
  DESISTENCIA: number
}