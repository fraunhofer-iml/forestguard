import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [],
  providers: [],
  exports: [PrismaService],
})
export class DatabaseModule {}
