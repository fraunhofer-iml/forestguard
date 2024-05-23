import { ConfigurationService } from '@forrest-guard/configuration';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configuration = app.get(ConfigurationService);

  const swaggerConfig = new DocumentBuilder().setTitle('ForestGuard Process Service').setVersion('0.1').build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(configuration.getGeneralConfiguration().swaggerPath, app, document);
  // Add pipeline for validation.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.useLogger(configuration.getGeneralConfiguration().logLevel);

  await app.listen(configuration.getProcessConfiguration().port);
  Logger.log(`🚀 Process service is running on: http://localhost:${configuration.getProcessConfiguration().port}`);
}

bootstrap();
