import { Component, Output, EventEmitter } from '@angular/core';
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
  @Output() jobCreated = new EventEmitter<void>();
  jobForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private messageService: MessageService,
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      url: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.jobForm.valid) {
      this.jobService.createJob(this.jobForm.value).subscribe(() => {
        this.jobForm.reset();
        this.jobCreated.emit();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Vaga cadastrada com sucesso!',
        });
      });
    }
  }
}
