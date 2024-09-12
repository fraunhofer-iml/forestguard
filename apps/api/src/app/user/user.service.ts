import { AmqpClientEnum, UserMessagePatterns } from '@forest-guard/amqp';
import { FarmerCreateDto, UserDto, UserOrFarmerDto, UserUpdateDto } from '@forest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(@Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy) {}

  readUsers(): Promise<UserDto[]> {
    return firstValueFrom(this.entityManagementService.send(UserMessagePatterns.READ_ALL, {}));
  }

  createUser(payload: { dto: UserUpdateDto; companyId: string }): Promise<UserDto> {
    return firstValueFrom(this.entityManagementService.send(UserMessagePatterns.CREATE, payload));
  }

  readUserById(id: string): Promise<UserDto> {
    return firstValueFrom(this.entityManagementService.send(UserMessagePatterns.READ_BY_ID, { id }));
  }

  createFarmer(payload: { dto: FarmerCreateDto; companyId: string }): Promise<UserOrFarmerDto> {
    return firstValueFrom(this.entityManagementService.send(UserMessagePatterns.CREATE_FARMER, payload));
  }
}
