import { Routes } from '@angular/router';
import { roleGuard } from '../auth/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/systemUser/systemUser').then(m => m.SystemUser),
    data: { $localize: 'System Users', roles: ['Admin'] },
    canActivate: [roleGuard]
  }
];
