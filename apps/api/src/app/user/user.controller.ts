import { FarmerCreateDto, FarmerDto, UserDto, UserUpdateDto } from '@forrest-guard/api-interfaces';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {
  }

  @Get()
  @ApiOperation({ description: 'Get all users' })
  @ApiOkResponse({ description: 'Successful request.' })
  getUsers(): Promise<UserDto[]> {
    return this.userService.readUsers();
  }

  @Post()
  @ApiOperation({ description: 'Create a user object' })
  @ApiOkResponse({ description: 'Successful creation.' })
  createUser(@Body() dto: UserUpdateDto): Promise<UserDto> {
    return this.userService.createUser(dto);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get user by ID' })
  @ApiOkResponse({ description: 'Successful request.' })
  getUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.readUserById(id);
  }

  @Post('farmers')
  @ApiOperation({ description: 'Create a farmer' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createFarmer(@Body() dto: FarmerCreateDto): Promise<FarmerDto> {
    return this.userService.createFarmer(dto);
  }
}
