/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CallHandler, Catch, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AmqpException } from './amqp.exception';

@Injectable()
@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientRustPanicError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientValidationError
)
export class PrismaErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const errorMessage = err.message
          .replace(/\n/g, ' ') // Remove new lines
          .replace(/[ \t]+/g, ' ') // Remove multiple spaces
          .replace(/"/g, "'"); // Replace double quotes with single quotes

        const errorCode = err?.error?.status ? err.error.status : HttpStatus.BAD_REQUEST;

        throw new AmqpException(errorMessage, errorCode);
      })
    );
  }
}
