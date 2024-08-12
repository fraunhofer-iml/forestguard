import { FarmerCreateDto, FarmerDto, UserDto, UserUpdateDto } from '@forest-guard/api-interfaces';
import { PrismaService } from '@forest-guard/database';
import { Injectable } from '@nestjs/common';
import * as Mapper from './user.mapper';
import * as Queries from './user.queries';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(dto: UserUpdateDto): Promise<UserDto> {
    const user = await this.prismaService.user.create(Queries.userCreate(dto));
    return Mapper.toUserDto(user);
  }

  async readUsers(): Promise<UserDto[]> {
    const users = await this.prismaService.user.findMany();
    return users.map(Mapper.toUserDto);
  }

  async readUserById(id: string): Promise<UserDto> {
    const user = await this.prismaService.user.findUniqueOrThrow({ where: { id } });
    return Mapper.toUserDto(user);
  }

  async createFarmer(dto: FarmerCreateDto): Promise<FarmerDto> {
    const farmer = await this.prismaService.user.create(Queries.farmerCreate(dto));
    return Mapper.toFarmerDto(farmer);
  }

  async readFarmersByCompanyId(companyId: string): Promise<FarmerDto[]> {
    const farmers = await this.prismaService.user.findMany(Queries.farmerReadByCompanyId(companyId));
    return farmers.map(Mapper.toFarmerDto);
  }
}
