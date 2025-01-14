/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CallHandler, Catch, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
@Catch()
export class AllErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        throw new HttpException(err.message, err.status);
      })
    );
  }
}
