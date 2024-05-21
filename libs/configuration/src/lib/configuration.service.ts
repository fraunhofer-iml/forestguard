import { Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { API_CONFIG_IDENTIFIER, ApiConfiguration } from './configurations/api.configuration';
import { ENTITY_MANAGEMENT_CONFIG_IDENTIFIER, EntityManagementSvcConfiguration } from './configurations/entity-management-svc.configuration';
import { PROCESS_CONFIG_IDENTIFIER, ProcessSvcConfiguration } from './configurations/process-svc.configuration';

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  public getLogLevel(): LogLevel[] {
    const logLevel = this.configService.get<string>('LOG_SETTINGS', 'error,verbose').split(',');
    return <LogLevel[]>logLevel;
  }

  public getSwaggerPath(): string {
    return this.configService.get<string>('SWAGGER_PATH', 'api');
  }

  public getApiConfiguration(): ApiConfiguration | undefined {
    return this.configService.get<ApiConfiguration>(API_CONFIG_IDENTIFIER);
  }

  public getEntityManagementConfiguration(): EntityManagementSvcConfiguration | undefined {
    return this.configService.get<EntityManagementSvcConfiguration>(ENTITY_MANAGEMENT_CONFIG_IDENTIFIER);
  }

  public getProcessConfiguration(): ProcessSvcConfiguration | undefined {
    return this.configService.get<ProcessSvcConfiguration>(PROCESS_CONFIG_IDENTIFIER);
  }
}
