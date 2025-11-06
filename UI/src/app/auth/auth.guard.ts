import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { createAuthGuard, AuthGuardData } from 'keycloak-angular';


const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
   state : RouterStateSnapshot,
   authData : AuthGuardData
): Promise<boolean | UrlTree> => {
  const router = inject(Router);
  const { authenticated, grantedRoles} = authData;

  const requiredRole = route.data['role'];
  if(!requiredRole){

  }

  const hasRequiredRole = (role: string): boolean =>  Object.values(grantedRoles.resourceRoles || {}).some((roles) => roles.includes(role));

  if(authenticated && hasRequiredRole(requiredRole)){
    return true;
  }

  return router.parseUrl('/forbidden');

};


export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);
