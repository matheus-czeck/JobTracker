import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { JobListComponent } from './components/job-list/job-list.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'jobs',
    component: JobListComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];