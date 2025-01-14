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

  const swaggerConfig = new DocumentBuilder().setTitle('ForestGuard API').setVersion('0.1').addBearerAuth().build();
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
