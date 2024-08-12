import { ConfigurationModule } from '@forest-guard/configuration';
import { PrismaService } from '@forest-guard/database';
import { Module } from '@nestjs/common';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [ConfigurationModule, BatchModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
