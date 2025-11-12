import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/organization/organization').then(m => m.Organization),
    data: { $localize: 'Organization' },
  }
];
