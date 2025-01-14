/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

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
