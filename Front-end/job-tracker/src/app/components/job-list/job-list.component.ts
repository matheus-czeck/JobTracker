import { Component, OnInit, ViewChild } from '@angular/core';
import { Job } from '../../models/job.model';
import { JobService } from '../../services/job.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { JobFormComponent } from '../job-form/job-form.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { JobDetailComponent } from '../job-detail/job-detail.component';
import { JobUpdateComponent } from '../job-update/job-update.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ReplaceUnderscorePipe } from '../../pipes/replace-underscore.pipe';
import { statusOrder } from '../../constants/job-status.constants';

import { DashboardComponent } from '../dashboard/dashboard.component';

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
    JobUpdateComponent,
    DashboardComponent,
    FormsModule,
    DropdownModule,
    ReplaceUnderscorePipe,
  ],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css',
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: any[] = [];

  searchTerm: string = '';
  selectedStatus: string | null = null;

  displayDialog: boolean = false;
  displayDetailDialog: boolean = false;
  displayUpdateDialog: boolean = false;
  selectedJobId: string | null = null;

  readonly statusOrder = statusOrder;

  @ViewChild(DashboardComponent) dashboard!: DashboardComponent

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
      next: (data) => {
        this.jobs = data;
        this.applyFilters();
        this.dashboard.loadDashboard()
      },
      error: (err) => console.log('Erro ao carregar vagas', err),
    });
  }

  applyFilters(): void {
    this.filteredJobs = this.jobs.filter((job) => {
      const matchesText =
        !this.searchTerm ||
        job.company
          .toLocaleLowerCase()
          .includes(this.searchTerm.toLocaleLowerCase()) ||
        job.title
          .toLocaleLowerCase()
          .includes(this.searchTerm.toLocaleLowerCase());

      const matchesStatus =
        !this.selectedStatus || job.currentStatus === this.selectedStatus;

      return matchesText && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = null;
    this.applyFilters();
  }

  openDetails(id: string): void {
    this.selectedJobId = id;
    this.displayDetailDialog = true;
  }
  openUpdate(id: string): void {
    this.selectedJobId = id;
    this.displayUpdateDialog = true;
  }

  onUpdateSuccess(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Status alterado com sucesso!',
    });
    this.displayUpdateDialog = false;
    this.selectedJobId = null;
    this.loadJobs();
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
