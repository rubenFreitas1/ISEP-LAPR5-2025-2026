import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/docks/docks').then(m => m.Docks),
    data: { $localize: 'Docks' },
  }
];
