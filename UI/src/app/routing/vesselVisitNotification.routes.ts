import { Routes } from '@angular/router';
import { roleGuard } from '../auth/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/vesselVisitNotification/vesselVisitNotification').then(m => m.VesselVisitNotification),
    data: { $localize: 'Vessel Visit Notification', roles: ['Admin', 'Representative'] },
    canActivate: [roleGuard]
  }
];
