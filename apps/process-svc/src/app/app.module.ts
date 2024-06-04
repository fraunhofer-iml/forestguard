import { ConfigurationModule } from '@forrest-guard/configuration';
import { PrismaService } from '@forrest-guard/database';
import { Module } from '@nestjs/common';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [ConfigurationModule, BatchModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
