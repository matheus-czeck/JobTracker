import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { JobService, JobDetail } from '../../services/job.service';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { PipesReplaceUnderscorePipe } from '../../pipes.replace-underscore.pipe';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [TimelineModule, CommonModule, PipesReplaceUnderscorePipe],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css',
})
export class JobDetailComponent implements OnInit, OnChanges {
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

  ngOnInit(): void {
    this.loadJobDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobId'] && !changes['jobId'].firstChange) {
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
    if (!this.jobId) return;

    this.jobService.getJobById(this.jobId).subscribe({
      next: (data) => {
        this.job = data;
      },
      error: (err) =>
        console.error('Erro ao carregar os detalhes da vaga', err),
    });
  }
}
