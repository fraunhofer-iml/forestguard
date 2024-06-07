import { farmer1Mock, FarmerCreateDto, FarmerDto, user1Mock, UserDto, UserUpdateDto } from '@forrest-guard/api-interfaces';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  @Get()
  @ApiOperation({ description: 'Get all users' })
  @ApiOkResponse({ description: 'Successful request.' })
  getUsers(): UserDto[] {
    return [user1Mock];
  }

  @Patch()
  @ApiOperation({ description: 'Create a user object' })
  @ApiOkResponse({ description: 'Successful creation.' })
  createUser(@Body() userUpdateDto: UserUpdateDto): UserDto {
    return user1Mock;
  }

  @Get(':id')
  @ApiOperation({ description: 'Get user by ID' })
  @ApiOkResponse({ description: 'Successful request.' })
  getUser(@Param('id') id: string): UserDto {
    return user1Mock;
  }

  @Post('farmers')
  @ApiOperation({ description: 'Create a farmer' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createFarmer(@Body() farmerCreateDto: FarmerCreateDto): FarmerDto {
    return farmer1Mock;
  }
}
