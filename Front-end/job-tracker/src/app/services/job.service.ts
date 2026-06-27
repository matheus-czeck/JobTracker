import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, JobDetail, CreateJobInput, JobDashboard} from '../models/job.model';
import { environment } from '../environment/environments';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }
  getJobById(id: string): Observable<JobDetail> {
    return this.http.get<JobDetail>(`${this.apiUrl}/${id}`);
  }
  
  getJobDashboard(): Observable<JobDashboard>{
    return this.http.get<JobDashboard>(`${this.apiUrl}/dashboard`)
  }

  createJob(job: CreateJobInput): Observable<Job> {
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
