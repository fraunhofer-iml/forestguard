import {
  FarmerCreateDto,
  TAuthenticatedUser,
  UserDto,
  UserOrFarmerDto,
  UserUpdateDto,
} from '@forest-guard/api-interfaces';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all users' })
  @ApiOkResponse({ description: 'Successful request.' })
  getUsers(): Promise<UserDto[]> {
    return this.userService.readUsers();
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create a user object' })
  @ApiOkResponse({ description: 'Successful creation.' })
  createUser(@Body() dto: UserUpdateDto, @AuthenticatedUser() user: TAuthenticatedUser): Promise<UserDto> {
    return this.userService.createUser({ dto, companyId: user.sub });
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get user by ID' })
  @ApiOkResponse({ description: 'Successful request.' })
  getUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.readUserById(id);
  }

  @Post('farmers')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create a farmer' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createFarmer(@Body() dto: FarmerCreateDto, @AuthenticatedUser() user: TAuthenticatedUser): Promise<UserOrFarmerDto> {
    return this.userService.createFarmer({ dto, companyId: user.sub });
  }
}
