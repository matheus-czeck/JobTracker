import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { Job } from '../../models/job.model';
import { ReplaceUnderscorePipe } from '../../pipes/replace-underscore.pipe';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ReplaceUnderscorePipe
  ],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css',
})
export class JobDetailComponent {
  @Input({ required: true })
  job!: Job;
}