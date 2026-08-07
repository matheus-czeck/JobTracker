export interface Job {
  id: string;
  title: string;
  company: string;
  url: string;
  currentStatus: string;
  updateAt: string;

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

export interface CreateJobRequest {
  title: string
  company: string
  url: string
  location?:string 
  salaryExpect?: string
  description?: string
}

export interface UpdateJobRequest {
  title: string;
  company: string;
  url: string

  location?: string;
  salarayExpect?: string;
  description?: string
  currentSttatus: string;

}

