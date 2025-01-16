/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const logger = new Logger('AllExceptionsFilter');

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object;
    let requestDetails: RequestDetails;

    if (exception instanceof HttpException) {
      if (typeof exception.getStatus() === 'number' && exception.getStatus() >= 100 && exception.getStatus() <= 599) {
        status = exception.getStatus();
      }

      message = exception.getResponse();
      requestDetails = {
        method: request.method,
        url: `${request.protocol}://${request.hostname}:${request.socket.localPort}${request.url}`,
        body: request.body,
      };
    } else {
      message = JSON.stringify(exception);
    }

    const errorResponse = {
      timestamp,
      status,
      message,
      requestDetails,
    };

    logger.error(errorResponse);
    response.status(status).json(errorResponse);
  }
}

type RequestDetails = {
  method: string;
  url: string;
  body: string | object;
};
