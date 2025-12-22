import { Routes } from '@angular/router';
import { roleGuard } from '../auth/role.guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/complementaryTaskCategory/complementaryTaskCategory').then(m => m.ComplementaryTaskCategory),
    data: { $localize: 'Complementary Task Categories', roles: ['Admin', 'PortAuthorityOfficer'] },
    canActivate: [roleGuard]
  }
];
