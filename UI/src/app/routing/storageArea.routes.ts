import { Routes } from '@angular/router';
import { roleGuard } from '../auth/role.guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/storageArea/storageArea').then(m => m.StorageArea),
    data: { $localize: 'Storage Area', roles: ['Admin', 'PortAuthorityOfficer'] },
    canActivate: [roleGuard]
  }
];
