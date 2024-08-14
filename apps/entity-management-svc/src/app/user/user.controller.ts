import { UserMessagePatterns } from '@forest-guard/amqp';
import { FarmerCreateDto, UserDto, UserOrFarmerDto, UserUpdateDto } from '@forest-guard/api-interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @MessagePattern(UserMessagePatterns.CREATE)
  async createUser(@Payload() payload: { dto: UserUpdateDto }): Promise<UserDto> {
    return this.service.createUser(payload.dto);
  }

  @MessagePattern(UserMessagePatterns.READ_ALL)
  async readUsers(): Promise<UserDto[]> {
    return this.service.readUsers();
  }

  @MessagePattern(UserMessagePatterns.READ_BY_ID)
  async readUserById(@Payload() payload: { id: string }): Promise<UserOrFarmerDto> {
    return this.service.readUserById(payload.id);
  }

  @MessagePattern(UserMessagePatterns.CREATE_FARMER)
  async createFarmer(@Payload() payload: { dto: FarmerCreateDto }): Promise<UserOrFarmerDto> {
    return this.service.createFarmer(payload.dto);
  }

  @MessagePattern(UserMessagePatterns.READ_FARMER_BY_COMPANY_ID)
  async readFarmersByCompanyId(@Payload() payload: { companyId: string }): Promise<UserOrFarmerDto[]> {
    return this.service.readFarmersByCompanyId(payload.companyId);
  }
}
