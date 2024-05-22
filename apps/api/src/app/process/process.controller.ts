import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { process1Mock, ProcessCreateDto, ProcessDto } from '@forrest-guard/api-interfaces';

@ApiTags('Processes')
@Controller('processes')
export class ProcessController {

  @Get()
  @ApiOperation({ description: 'Get all processes' })
  @ApiOkResponse({ description: 'Successful request.' })
  getProcesses() : ProcessDto[] {
    return [process1Mock];
  }

  @Post()
  @ApiOperation({ description: 'Create a process' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createProcess(@Body() processCreateDto: ProcessCreateDto) : ProcessDto {
    return process1Mock;
  }
}
