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
