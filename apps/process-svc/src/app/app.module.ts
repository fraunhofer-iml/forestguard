import { ConfigurationModule } from '@forrest-guard/configuration';
import { PrismaService } from '@forrest-guard/database';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigurationModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
