import { Routes } from '@angular/router';
import { roleGuard } from '../auth/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/physicalResources/physicalResources').then(m => m.PhysicalResources),
    data: { title: 'Physical Resources', roles: ['Admin', 'LogisticOperator'] },
    canActivate: [roleGuard]
  }
];
