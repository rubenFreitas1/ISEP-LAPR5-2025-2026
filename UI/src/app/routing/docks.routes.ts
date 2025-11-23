import { Routes } from '@angular/router';
import { roleGuard } from '../auth/role.guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/docks/docks').then(m => m.Docks),
    data: { $localize: 'Docks', roles: ['Admin', 'PortAuthorityOfficer'] },
    canActivate: [roleGuard]
  }
];
