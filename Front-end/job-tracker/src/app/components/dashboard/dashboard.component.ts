import { Component } from '@angular/core';
import { JobService } from '../../services/job.service';
import { JobDashboard } from '../../models/job.model';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(private jobService: JobService) {}

  dashboard: JobDashboard | null = null;

  ngOnInit(): void {
    this.loadDashboard()
  }

  loadDashboard() {
    this.jobService.getJobDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
      },
    });
  }
}
