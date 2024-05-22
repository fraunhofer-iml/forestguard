import { Module } from '@nestjs/common';
import { ProcessController } from './process.controller';

@Module({
  controllers: [ProcessController]
})
export class ProcessModule {}
