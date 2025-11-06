import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/staff/staff').then(s => s.Staff),
    data: { $localize: 'Staff' },
  }
];
