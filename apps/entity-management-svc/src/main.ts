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

import { AmqpClientEnum, PrismaErrorsInterceptor } from '@forest-guard/amqp';
import { ConfigurationService } from '@forest-guard/configuration';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  const configuration = appContext.get(ConfigurationService);
  const amqpUri = configuration.getGeneralConfiguration().amqpUri;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [amqpUri],
      queue: AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT,
      queueOptions: {
        durable: false,
      },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.useGlobalInterceptors(new PrismaErrorsInterceptor());
  app.useLogger(configuration.getGeneralConfiguration().logLevel);

  await app.listen().then(() =>
    Logger.log(
      `🗂️ Entity Manager service is running with RMQ:
        ${amqpUri}:${AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT}`
    )
  );
}

bootstrap();
