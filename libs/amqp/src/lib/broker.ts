/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DynamicModule } from '@nestjs/common';
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
      throw new Error('AMQP_URI is not defined');
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
