import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { JobService, JobDetail } from '../../services/job.service';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [TimelineModule, CommonModule],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css',
})
export class JobDetailComponent implements OnChanges {
  @Input() jobId: string | null = null;
  job: JobDetail | null = null;

  readonly statusOrder = [
    'APLICADO',
    'TRIAGEM',
    'ENTREVISTA',
    'TESTE TECNICO',
    'PROPOSTA',
    'PROPOSTA ACEITA',
    'REJEITADO',
    'DESISTENCIA',
  ];

  constructor(private jobService: JobService) {}

  ngOnChanges(): void {
    if (this.jobId) {
      this.loadJobDetails();
    }
  }

  isStatusReached(status: string): boolean {
    if (!this.job) return false;

    const currentIndex = this.statusOrder.indexOf(this.job.currentStatus);
    const statusIndex = this.statusOrder.indexOf(status);
    return statusIndex <= currentIndex;
  }

  getStatusDate(status: string): string | null {
    if (!this.job) return null;
    const entry = this.job.history.find((h) => h.newStatus === status);
    return entry ? entry.changedAt.toString() : null;
  }

  loadJobDetails() {
    this.jobService.getJobById(this.jobId!).subscribe((data) => {
      this.job = data;
    });
  }
}
