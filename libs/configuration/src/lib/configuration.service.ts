import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { API_CONFIG_IDENTIFIER, ApiConfiguration } from './configurations/api.configuration';
import {
  ENTITY_MANAGEMENT_CONFIG_IDENTIFIER,
  EntityManagementSvcConfiguration,
} from './configurations/entity-management-svc.configuration';
import { GENERAL_CONFIG_IDENTIFIER, GeneralConfiguration } from './configurations/general.configuration';
import { PROCESS_CONFIG_IDENTIFIER, ProcessSvcConfiguration } from './configurations/process-svc.configuration';

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  public getGeneralConfiguration(): GeneralConfiguration | undefined {
    return this.configService.get<GeneralConfiguration>(GENERAL_CONFIG_IDENTIFIER);
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
