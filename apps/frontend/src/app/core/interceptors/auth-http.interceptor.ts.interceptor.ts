import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Uris } from '../../shared/uris';
import { AuthenticationService } from '../services/authentication.service';

export const authHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService: AuthenticationService = inject(AuthenticationService);

  const reqHeaders = {
    setHeaders: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${authenticationService.getCurrentJwt()}`,
    },
  };

  if (req.url.includes(Uris.proofs) && req.method === 'POST') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delete reqHeaders.setHeaders['Content-Type'];
  }

  req = req.clone(reqHeaders);

  return next(req);
};
