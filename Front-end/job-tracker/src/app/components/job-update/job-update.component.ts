import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { JobService } from '../../services/job.service';
import { statusOrder } from '../../constants/job-status.constants';

@Component({
  selector: 'app-job-update',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    InputTextareaModule,
  ],
  templateUrl: './job-update.component.html',
  styleUrl: './job-update.component.css',
})
export class JobUpdateComponent {
  @Input() jobId: string | null = null;
  @Output() updateSuccess = new EventEmitter<void>();

  newStatus: string = '';
  newNotes: string = '';
  readonly statusOrder = statusOrder

  constructor(private jobService: JobService) {}

  updateJobStatus(): void {
    if (!this.jobId || !this.newStatus) return;

    this.jobService
      .updateStatus(this.jobId, this.newStatus, this.newNotes)
      .subscribe({
        next: () => {
          this.newStatus = '';
          this.newNotes = '';
          this.updateSuccess.emit();
        },
        error: (err) => {
          console.log('Erro ao atualizar o status da vaga:', err);
        },
      });
  }
}
