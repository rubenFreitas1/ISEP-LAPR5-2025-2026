import { Routes } from '@angular/router';
import { roleGuard } from '../auth/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/vesselType/vesselType').then(m => m.VesselType),
    data: { $localize: 'vesselType', roles: ['Admin', 'PortAuthorityOfficer'] },
    canActivate: [roleGuard]
  }
];
