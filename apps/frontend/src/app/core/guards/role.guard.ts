import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const requiredRoles = (route.data?.['roles'] as string[]) || [];

  return requiredRoles.some((role) => authService.hasRole(role)) ? true : router.navigateByUrl('/batches');
};
