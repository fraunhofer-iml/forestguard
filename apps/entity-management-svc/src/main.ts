/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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

  // TODO-MP: otherwise this microservice will crash
  // Reason: When proofs are created but the corresponding NFT does not exist, requeueBlockchainRequest() will be called 10 times, causing the microservice to crash.
  process.on('unhandledRejection', (reason, promise) => {
    Logger.error('Unhandled Rejection:', reason);
  });

  await app.listen().then(() =>
    Logger.log(
      `🗂️ Entity Manager service is running with RMQ:
        ${amqpUri}:${AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT}`
    )
  );
}

bootstrap();
