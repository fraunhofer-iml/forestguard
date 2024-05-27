import { DynamicModule, NotFoundException } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AmqpClientEnum } from './queues';

export class Broker {
  public getEntityManagementBroker(): DynamicModule {
    return this.getMessageBroker(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT);
  }

  public getProcessBroker(): DynamicModule {
    return this.getMessageBroker(AmqpClientEnum.QUEUE_PROCESS);
  }

  private getMessageBroker(queue: string): DynamicModule {
    const amqpUri = process.env['AMQP_URI'];

    if (!amqpUri) {
      throw new NotFoundException('AMQP_URI is not defined');
    }

    return ClientsModule.register([
      {
        name: queue,
        transport: Transport.RMQ,
        options: {
          urls: [amqpUri],
          queue: queue,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]);
  }
}
