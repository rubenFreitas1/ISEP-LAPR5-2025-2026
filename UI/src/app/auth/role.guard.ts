import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';


export const roleGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const permissions = inject(PermissionService);

  // Ensure role is loaded from localStorage before checking permissions
  let userRole = permissions.getRole();
  if (!userRole) {
    await permissions.loadRoleFromStorage();
    userRole = permissions.getRole();
  }

  const allowedRoles: string[] | undefined = route.data['roles'];

  console.log('RoleGuard:', route.pathFromRoot, route.data, permissions.getRole());

  if (!allowedRoles || allowedRoles.length === 0) return true;

  if (userRole && allowedRoles.includes(userRole)) return true;

  setTimeout(() => router.navigateByUrl('/unauthorized'));
  return false;
};

