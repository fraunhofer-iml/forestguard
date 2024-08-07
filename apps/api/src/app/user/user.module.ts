import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Broker } from '@forrest-guard/amqp';

@Module({
  imports: [new Broker().getEntityManagementBroker()],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
