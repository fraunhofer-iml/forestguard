import { RpcException } from '@nestjs/microservices';

export class AmqpException extends RpcException {
  constructor(message: string, status: number) {
    super({ message, status });
  }
}
