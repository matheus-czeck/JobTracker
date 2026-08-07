import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';

import { Job } from '../../models/job.model';
import { UpdateJobRequest } from '../../models/job.model';
import { JobService } from '../../services/job.service';
import { statusOrder } from '../../constants/job-status.constants';

@Component({
  selector: 'app-job-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    FloatLabelModule,
    ButtonModule,
  ],
  templateUrl: './job-edit.component.html',
  styleUrl: './job-edit.component.css',
})
export class JobEditComponent implements OnChanges {
  @Input({ required: true })
  job!: Job;

  @Output()
  saved = new EventEmitter<void>();

  readonly statusOrder = statusOrder;

  jobForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly jobService: JobService,
    private readonly messageService: MessageService,
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      url: ['', Validators.required],
      location: [''],
      salaryExpect: [''],
      description: [''],
      currentStatus: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['job'] || !this.job) {
      return;
    }

    this.jobForm.patchValue({
      title: this.job.title,
      company: this.job.company,
      url: this.job.url,
      location: this.job.location,
      salaryExpect: this.job.salaryExpect,
      description: this.job.description,
      currentStatus: this.job.currentStatus,
    });
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      return;
    }

    const dto: UpdateJobRequest = this.jobForm.getRawValue();

    this.jobService.update(this.job.id, dto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Vaga atualizada com sucesso!',
        });

        this.saved.emit();
      },
      error: (error) => console.error(error),
    });
  }
}