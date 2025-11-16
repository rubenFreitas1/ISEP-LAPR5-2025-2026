import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/schedule/schedule').then(m => m.Schedule),
    data: { $localize: 'Schedule' },
  }
];
