import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { JobService } from '../../services/job.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.css',
})
export class JobFormComponent {
  @Output()
  saved = new EventEmitter<void>();

  jobForm: FormGroup;

  private currentJob: Job | null = null;

  @Input()
  set job(value: Job | null) {
    this.currentJob = value;

    if (!value) {
      this.jobForm.reset();
      return;
    }

    this.jobForm.patchValue({
      title: value.title,
      company: value.company,
      url: value.url,
      location: value.location,
      salaryExpect: value.salaryExpect,
      description: value.description,
    });
  }

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
    });
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      return;
    }

    if (this.currentJob) {
      this.update();
      return;
    }

    this.create();
  }

  private create(): void {
    const dto = this.jobForm.getRawValue();

    this.jobService.create(dto).subscribe({
      next: () => {
        this.jobForm.reset();

        this.saved.emit();

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Vaga cadastrada com sucesso!',
        });
      },
      error: (error) => console.error(error),
    });
  }

  private update(): void {
    if (!this.currentJob) {
      return;
    }

    const dto = {
      ...this.jobForm.getRawValue(),
      currentStatus: this.currentJob.currentStatus,
    };

    this.jobService.update(this.currentJob.id, dto).subscribe({
      next: (updatedJob) => {
        this.currentJob = updatedJob;

        this.saved.emit();

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Vaga atualizada com sucesso!',
        });
      },
      error: (error) => console.error(error),
    });
  }
}
