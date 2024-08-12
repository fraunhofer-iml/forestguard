import { LoginDto, RegistrationDto } from '@forest-guard/api-interfaces';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ description: 'Login with email and password.' })
  @ApiOkResponse({ description: 'Successful login.' })
  login(@Body() loginDto: LoginDto) {
    return loginDto;
  }

  @Post('register')
  @ApiOperation({ description: 'Register with email and password.' })
  @ApiCreatedResponse({ description: 'Successful registration.' })
  register(@Body() registrationDto: RegistrationDto) {
    return registrationDto;
  }
}
