import { Broker } from '@forest-guard/amqp';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [new Broker().getEntityManagementBroker()],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
