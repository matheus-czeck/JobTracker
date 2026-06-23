import { Component, OnInit } from '@angular/core';
import { JobService, Job } from '../../services/job.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { JobFormComponent } from '../job-form/job-form.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { JobDetailComponent } from '../job-detail/job-detail.component';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    JobFormComponent,
    ConfirmDialogModule,
    JobDetailComponent,
  ],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css',
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  displayDialog: boolean = false;
  displayDetailDialog: boolean = false;
  selectedJobId: string | null = null;

  constructor(
    private jobService: JobService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  onJobCreated(): void {
    this.displayDialog = false;
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (data) => (this.jobs = data),
      error: (err) => console.log('Erro ao carregar vagas', err),
    });
  }

  openDetails(id: string): void {
    this.selectedJobId = id;
    this.displayDetailDialog = true;
  }
  delete(id: string): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta tarefa?',
      header: 'Confirmar Exclusao',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.jobService.deleteJob(id).subscribe(() => this.loadJobs());
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Vaga excluida com sucesso!',
        });
      },
    });
  }
}
