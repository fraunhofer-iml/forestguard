/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import 'multer';
import {
  FarmerAndPlotOfLand,
  ImportResponseDto,
  MasterDataImportService,
  UserCreateDto,
} from '@forest-guard/api-interfaces';
import { UserService } from '../user/user.service';
import { PlotsOfLandService } from '../plots-of-land/plots-of-land.service';
import { CompanyService } from '../company/company.service';
import { COMPANY_IMPORT_SERVICES } from './import.constants';
import { AmqpException } from '@forest-guard/amqp';

@Injectable()
export class ImportService {

  constructor(
    @Inject(COMPANY_IMPORT_SERVICES) private readonly companyImportServices: MasterDataImportService[],
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
    private readonly plotsOfLandService: PlotsOfLandService,
  ) {
  }

  async importMasterData(payload: { file: Express.Multer.File, companyId: string }): Promise<ImportResponseDto> {
    const masterDataImportService = await this.getCompanyImportService(payload.companyId);
    const masterDataEntities = await masterDataImportService.import(payload.file);
    const employeesDto = await this.createEmployees(masterDataEntities.employees, payload.companyId);
    const farmersDto = await this.createFarmersWithPlotsOfLand(masterDataEntities.farmersAndPlotsOfLand, payload.companyId);
    return {
      employeesCreated: employeesDto.numberOfCreatedEmployees,
      farmersCreated: farmersDto.numberOfCreatedFarmers,
      plotsOfLandCreated: farmersDto.numberOfCreatedPlotsOfLand,
      errors: [...employeesDto.employeeErrors, ...farmersDto.farmerAndPlotOfLandErrors],
    };
  }

  private async getCompanyImportService(companyId: string): Promise<MasterDataImportService> {
    const company = await this.companyService.readCompanyById(companyId);
    const masterDataImportService = this.companyImportServices.find(service => service.COMPANY_IDENTIFIER === company.name);
    if (!masterDataImportService) {
      throw new AmqpException(`Master data import service with company identifier '${company.name}' not found.`, HttpStatus.NOT_FOUND);
    }
    return masterDataImportService;
  }

  private async createEmployees(employees: UserCreateDto[], companyId: string) {
    const employeesDto = {
      numberOfCreatedEmployees: 0,
      employeeErrors: Array<string>(),
    };
    for (const employee of employees) {
      try {
        await this.userService.createUser({
          dto: employee,
          companyId: companyId,
        });
        employeesDto.numberOfCreatedEmployees++;
      } catch (e) {
        employeesDto.employeeErrors.push(e.toString());
      }
    }
    return employeesDto;
  }

  private async createFarmersWithPlotsOfLand(farmersAndPlotsOfLand: FarmerAndPlotOfLand[], companyId: string) {
    const farmersDto = {
      numberOfCreatedFarmers: 0,
      numberOfCreatedPlotsOfLand: 0,
      farmerAndPlotOfLandErrors: Array<string>(),
    };

    for (const farmerAndPlotOfLand of farmersAndPlotsOfLand) {
      try {
        let farmer = await this.userService.readFarmerByPersonalId(farmerAndPlotOfLand.farmer.personalId, companyId);
        if (farmer === null) {
          farmer = await this.userService.createFarmer({
            dto: farmerAndPlotOfLand.farmer,
            companyId: companyId,
          });
          farmersDto.numberOfCreatedFarmers++;
        }

        await this.plotsOfLandService.createPlotOfLand(
          farmerAndPlotOfLand.plotOfLand,
          farmer.id,
        );
        farmersDto.numberOfCreatedPlotsOfLand++;

      } catch (e) {
        farmersDto.farmerAndPlotOfLandErrors.push(e.toString());
      }
    }

    return farmersDto;
  }
}
