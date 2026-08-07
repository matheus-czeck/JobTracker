import { Component, OnInit } from '@angular/core';
import { Job } from '../../models/job.model';
import { JobService } from '../../services/job.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { JobFormComponent } from '../job-form/job-form.component';
import { JobEditComponent } from '../job-edit/job-edit.component';
import { JobDetailComponent } from '../job-detail/job-detail.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ReplaceUnderscorePipe } from '../../pipes/replace-underscore.pipe';
import { statusOrder } from '../../constants/job-status.constants';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    JobFormComponent,
    JobEditComponent,
    JobDetailComponent,
    ConfirmDialogModule,
    FormsModule,
    DropdownModule,
    ReplaceUnderscorePipe,
  ],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css',
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];

  searchTerm = '';
  selectedStatus: string | null = null;

  displayDialog = false;
  displayEditDialog = false;
  displayDetailDialog = false;

  selectedJob: Job | null = null;

  readonly statusOrder = statusOrder;

  constructor(
    private readonly jobService: JobService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.findAll().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.applyFilters();
      },
      error: (error) => console.error(error),
    });
  }

  applyFilters(): void {
    this.filteredJobs = this.jobs.filter((job) => {
      const matchesText =
        !this.searchTerm ||
        job.company.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.title.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        !this.selectedStatus ||
        job.currentStatus === this.selectedStatus;

      return matchesText && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = null;
    this.applyFilters();
  }

  openCreate(): void {
    this.selectedJob = null;
    this.displayDialog = true;
  }

  openEdit(job: Job): void {
    this.selectedJob = job;
    this.displayEditDialog = true;
  }

  openDetails(job: Job): void {
    this.selectedJob = job;
    this.displayDetailDialog = true;
  }

  onSaved(): void {
    this.displayDialog = false;
    this.displayEditDialog = false;

    this.selectedJob = null;

    this.loadJobs();
  }

  delete(id: string): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta vaga?',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        this.jobService.delete(id).subscribe({
          next: () => {
            this.loadJobs();

            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Vaga excluída com sucesso!',
            });
          },
          error: (error) => console.error(error),
        });
      },
    });
  }
}