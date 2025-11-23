import { Routes } from '@angular/router';
import { roleGuard } from '../auth/role.guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/schedule/schedule').then(m => m.Schedule),
    data: { $localize: 'Schedule', roles: ['Admin', 'LogisticOperator'] },
    canActivate: [roleGuard]
  }
];
