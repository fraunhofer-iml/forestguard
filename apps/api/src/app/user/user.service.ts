import { Inject, Injectable } from '@nestjs/common';
import { FarmerCreateDto, FarmerDto, UserDto, UserUpdateDto } from '@forrest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { AmqpClientEnum, UserMessagePatterns } from '@forrest-guard/amqp';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(@Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy) {
  }

  readUsers(): Promise<UserDto[]> {
    return firstValueFrom(this.entityManagementService.send(UserMessagePatterns.READ_ALL, {}));
  }

  createUser(dto: UserUpdateDto): Promise<UserDto> {
    return firstValueFrom(this.entityManagementService.send(UserMessagePatterns.CREATE, { dto }));
  }

  readUserById(id: string): Promise<UserDto> {
    return firstValueFrom(this.entityManagementService.send(UserMessagePatterns.READ_BY_ID, { id }));
  }

  createFarmer(dto: FarmerCreateDto): Promise<FarmerDto> {
    return firstValueFrom(this.entityManagementService.send(UserMessagePatterns.CREATE_FARMER, { dto }));
  }
}
