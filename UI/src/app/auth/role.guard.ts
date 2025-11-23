import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';


export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const permissions = inject(PermissionService);

  const userRole = permissions.getRole();
  const allowedRoles: string[] | undefined = route.data['roles'];

  console.log('RoleGuard:', route.pathFromRoot, route.data, permissions.getRole());

  if (!allowedRoles || allowedRoles.length === 0) return true;

  if (userRole && allowedRoles.includes(userRole)) return true;

  setTimeout(() => router.navigateByUrl('/unauthorized'));
  return false;
};

