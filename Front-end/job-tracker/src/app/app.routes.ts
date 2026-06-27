import { Routes } from '@angular/router';
import { JobListComponent } from './components/job-list/job-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: JobListComponent },
  { path: '**', redirectTo: '' },

];
