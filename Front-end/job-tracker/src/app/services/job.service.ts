import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, CreateJobRequest, UpdateJobRequest } from '../models/job.model';
import { environment } from '../environment/environments';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly apiUrl = `${environment.apiUrl}/jobs`;

  private readonly http = inject(HttpClient);

  findAll(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  findById(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

//  getJobDashboard(){
//    return this.http.get(`${this.apiUrl}/dashboard`)
// }

  create(job: CreateJobRequest): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, job);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  update(id: string, dto: UpdateJobRequest): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/${id}`, dto);
  }
}
