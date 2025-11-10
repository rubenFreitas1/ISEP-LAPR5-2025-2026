import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/vessel/vessel').then(m => m.Vessel),
    data: { $localize: 'Vessel' },
  }
];
