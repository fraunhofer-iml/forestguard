import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigurationService } from '@forrest-guard/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configuration = app.get(ConfigurationService);

  const swaggerConfig = new DocumentBuilder().setTitle('ForestGuard Process Service').setVersion('0.1').build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(configuration.getSwaggerPath(), app, document);
  // Add pipeline for validation.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.useLogger(configuration.getLogLevel());

  await app.listen(configuration.getProcessConfiguration().port);
  Logger.log(`🚀 Process service is running on: http://localhost:${configuration.getProcessConfiguration().port}`);
}

bootstrap();
