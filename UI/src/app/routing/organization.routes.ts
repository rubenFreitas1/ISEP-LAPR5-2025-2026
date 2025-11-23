import { Routes } from '@angular/router';
import { roleGuard } from '../auth/role.guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/organization/organization').then(m => m.Organization),
    data: { $localize: 'Organization', roles: ['Admin', 'PortAuthorityOfficer'] },
    canActivate: [roleGuard]
  }
];
