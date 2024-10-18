import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const authHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService: AuthenticationService = inject(AuthenticationService);

  const reqHeaders = {
    setHeaders: {
      Accept: 'application/json',
      Authorization: `Bearer ${authenticationService.getCurrentJwt()}`,
    },
  };

  req = req.clone(reqHeaders);

  return next(req);
};
