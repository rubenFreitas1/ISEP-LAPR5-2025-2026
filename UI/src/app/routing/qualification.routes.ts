import { Routes } from '@angular/router';
import { roleGuard } from '../auth/role.guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/qualification/qualification').then(m => m.Qualification),
    data: { $localize: 'Qualification', roles: ['Admin', 'LogisticOperator'] },
    canActivate: [roleGuard]
  }
];
