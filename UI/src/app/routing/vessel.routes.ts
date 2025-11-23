import { Routes } from '@angular/router';
import { roleGuard } from '../auth/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/vessel/vessel').then(m => m.Vessel),
    data: { $localize: 'Vessel', roles: ['Admin', 'PortAuthorityOfficer'] },
    canActivate: [roleGuard]
  }
];
