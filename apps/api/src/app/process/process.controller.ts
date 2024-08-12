import { process1Mock, ProcessCreateDto, ProcessDto } from '@forest-guard/api-interfaces';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Processes')
@Controller('processes')
export class ProcessController {
  @Get()
  @ApiOperation({ description: 'Get all processes' })
  @ApiOkResponse({ description: 'Successful request.' })
  getProcesses(): ProcessDto[] {
    return [process1Mock];
  }

  @Post()
  @ApiOperation({ description: 'Create a process' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createProcess(@Body() processCreateDto: ProcessCreateDto): ProcessDto {
    return process1Mock;
  }
}
