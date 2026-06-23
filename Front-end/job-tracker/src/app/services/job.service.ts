import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Job {
  id: string;
  title: string;
  company: string;
  url: string;
  currentStatus: string;
  updateAt: Date;
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

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = 'http://localhost:3000/jobs';

  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }
  getJobById(id: string): Observable<JobDetail> {
    return this.http.get<JobDetail>(`${this.apiUrl}/${id}`);
  }

  createJob(job: any): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, job);
  }

  updateStatus(id: string, status: string, notes?: string): Observable<Job> {
    return this.http.patch<Job>(`${this.apiUrl}/${id}/status`, {
      status,
      notes,
    });
  }

  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
