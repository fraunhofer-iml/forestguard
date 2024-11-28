import { FarmerCreateDto, UserDto, UserOrFarmerDto, UserUpdateDto } from '@forest-guard/api-interfaces';
import { PrismaService } from '@forest-guard/database';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as Mapper from './user.mapper';
import * as Queries from './user.queries';
import { AmqpException } from '@forest-guard/amqp';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(payload: { dto: UserUpdateDto; companyId: string }): Promise<UserDto> {
    const entity = await this.prismaService.entity.create({data: {}});
    const user = await this.prismaService.user.create(Queries.userCreate({ dto: payload.dto, entityId: entity.id, companyId: payload.companyId }));
    return Mapper.toUserDto(user);
  }

  async readUsers(): Promise<UserDto[]> {
    const users = await this.prismaService.user.findMany();
    return users.map(Mapper.toUserDto);
  }

  async readUserById(id: string): Promise<UserOrFarmerDto> {
    const user = await this.prismaService.user.findUniqueOrThrow(Queries.userOrFarmerReadById(id));
    return Mapper.toUserOrFarmerDto(user);
  }

  async createFarmer(payload: { dto: FarmerCreateDto; companyId: string }): Promise<UserOrFarmerDto> {
      const fetchedUser = await this.prismaService.user.findFirst({ where: { personalId: payload.dto.personalId, companyId: payload.companyId }});
      if(fetchedUser) {
        throw new AmqpException(`Farmer with local id '${payload.dto.personalId}' already exists for this company.`, HttpStatus.CONFLICT);
      }
      const entity = await this.prismaService.entity.create({data: {}});
      const farmer = await this.prismaService.user.create(Queries.farmerCreate({ dto: payload.dto, entityId: entity.id, companyId: payload.companyId }));
      return Mapper.toUserOrFarmerDto(farmer);
  }

  async readFarmersByCompanyId(companyId: string): Promise<UserOrFarmerDto[]> {
    const farmers = await this.prismaService.user.findMany(Queries.farmerReadByCompanyId(companyId));
    return farmers.map(Mapper.toUserOrFarmerDto);
  }
}
