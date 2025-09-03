/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConfigurationService } from '@forest-guard/configuration';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllErrorsInterceptor } from './all-errors.interceptor';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const configuration = app.get(ConfigurationService);

  const swaggerConfig = new DocumentBuilder().setTitle('Unisoft API').setVersion('0.1').addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(configuration.getGeneralConfiguration().swaggerPath, app, document);

  // Add pipeline for validation.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.useGlobalInterceptors(new AllErrorsInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useLogger(configuration.getGeneralConfiguration().logLevel);

  await app.listen(configuration.getApiConfiguration().port);
  Logger.log(`🚀 Forest guard API is running on: http://localhost:${configuration.getApiConfiguration().port}`);
}

bootstrap();
