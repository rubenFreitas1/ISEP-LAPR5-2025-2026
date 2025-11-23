import { Routes } from '@angular/router';
import { roleGuard } from '../auth/role.guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/staff/staff').then(s => s.Staff),
    data: { $localize: 'Staff', roles: ['Admin', 'LogisticOperator'] },
    canActivate: [roleGuard]
  }
];
