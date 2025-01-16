/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PlotsOfLandService } from '../plots-of-land/plots-of-land.service';
import { UserService } from '../user/user.service';
import { ImportDto, MasterDataImportService, PlotOfLandDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { ImportService } from './import.service';
import { CompanyService } from '../company/company.service';
import { FARMER_AND_PLOT_OF_LAND_MOCK, IMPORT_DTO_MOCK } from './mocked-data/import.mock';
import { COMPANY_IMPORT_SERVICES } from './import.constants';

describe('ImportService', () => {
  const COMPANY_IDENTIFIER = 'COMPANY_IDENTIFIER';
  let importService: ImportService;
  let masterDataImportService: MasterDataImportService;
  let companyService: CompanyService;
  let userService: UserService;
  let plotsOfLandService: PlotsOfLandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportService,
        {
          provide: COMPANY_IMPORT_SERVICES,
          useValue: [{
            COMPANY_IDENTIFIER: COMPANY_IDENTIFIER,
            import: jest.fn()
          }],
        },
        {
          provide: CompanyService,
          useValue: { readCompanyById: jest.fn().mockResolvedValue({
              id: '',
              name: COMPANY_IDENTIFIER,
              address: null,
            }) },
        },
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            createFarmer: jest.fn(),
            readFarmerByPersonalId: jest.fn(),
          },
        },
        {
          provide: PlotsOfLandService,
          useValue: { createPlotOfLand: jest.fn() },
        },
      ],
    }).compile();

    importService = module.get<ImportService>(ImportService);
    masterDataImportService = module.get<MasterDataImportService[]>(COMPANY_IMPORT_SERVICES)[0];
    companyService = module.get<CompanyService>(CompanyService);
    userService = module.get<UserService>(UserService);
    plotsOfLandService = module.get<PlotsOfLandService>(PlotsOfLandService);
  });

  it('should be defined', () => {
    expect(importService).toBeDefined();
    expect(masterDataImportService).toBeDefined();
    expect(companyService).toBeDefined();
    expect(userService).toBeDefined();
    expect(plotsOfLandService).toBeDefined();
  });

  it('should accept empty data', async () => {
    jest.spyOn(masterDataImportService, 'import').mockResolvedValue({
      employees: [],
      farmersAndPlotsOfLand: [],
    });

    const companyId = '1';
    const actualResult = await importService.importMasterData({ file: null, companyId: companyId });

    expect(actualResult).toEqual({
      employeesCreated: 0,
      farmersCreated: 0,
      plotsOfLandCreated: 0,
      errors: [],
    });
    expect(companyService.readCompanyById).toHaveBeenCalledWith(companyId);
    expect(masterDataImportService.import).toHaveBeenCalled();
    expect(userService.createUser).toHaveBeenCalledTimes(0);
    expect(userService.createFarmer).toHaveBeenCalledTimes(0);
    expect(plotsOfLandService.createPlotOfLand).toHaveBeenCalledTimes(0);
  });

  it('should import master data successfully', async () => {
    const resolvedFarmer = new UserOrFarmerDto('farmerId1', '', '', '', '', '', '');
    jest.spyOn(masterDataImportService, 'import').mockResolvedValue(IMPORT_DTO_MOCK);
    jest.spyOn(userService, 'readFarmerByPersonalId').mockResolvedValue(null);
    jest.spyOn(userService, 'createFarmer').mockResolvedValue(resolvedFarmer);

    const companyId = 'companyId1';
    const actualResult = await importService.importMasterData({ file: null, companyId: companyId });

    expect(actualResult).toEqual({
      employeesCreated: 1,
      farmersCreated: 1,
      plotsOfLandCreated: 1,
      errors: [],
    });
    expect(companyService.readCompanyById).toHaveBeenCalledWith(companyId);
    expect(masterDataImportService.import).toHaveBeenCalled();
    expect(userService.createUser).toHaveBeenCalledWith({
      dto: IMPORT_DTO_MOCK.employees[0],
      companyId: companyId,
    });
    expect(userService.readFarmerByPersonalId).toHaveBeenCalledWith(
      IMPORT_DTO_MOCK.farmersAndPlotsOfLand[0].farmer.personalId,
      companyId,
    );
    expect(userService.createFarmer).toHaveBeenCalledWith({
      dto: IMPORT_DTO_MOCK.farmersAndPlotsOfLand[0].farmer,
      companyId: companyId,
    });
    expect(plotsOfLandService.createPlotOfLand).toHaveBeenCalledWith(
      IMPORT_DTO_MOCK.farmersAndPlotsOfLand[0].plotOfLand,
      resolvedFarmer.id,
    );
  });

  it('should import master data with errors', async () => {
    const importDto: ImportDto = {
      employees: [{
        lastName: '',
      }],
      farmersAndPlotsOfLand: [FARMER_AND_PLOT_OF_LAND_MOCK, FARMER_AND_PLOT_OF_LAND_MOCK, FARMER_AND_PLOT_OF_LAND_MOCK],
    };
    const resolvedFarmer = new UserOrFarmerDto('farmerId1', '', '', '', '', '', '');
    const resolvedPlotOfLand = new PlotOfLandDto('');
    const errorMessage = 'Something is wrong with this data entry';
    jest.spyOn(masterDataImportService, 'import').mockResolvedValue(importDto);
    jest.spyOn(userService, 'readFarmerByPersonalId').mockResolvedValue(null);
    jest.spyOn(userService, 'createFarmer').mockResolvedValue(resolvedFarmer);
    jest.spyOn(plotsOfLandService, 'createPlotOfLand')
      .mockResolvedValueOnce(resolvedPlotOfLand)
      .mockRejectedValue(new Error(errorMessage))
      .mockResolvedValueOnce(resolvedPlotOfLand);

    const companyId = 'companyId1';
    const actualResult = await importService.importMasterData({ file: null, companyId: companyId });

    expect(actualResult).toEqual({
      employeesCreated: importDto.employees.length,
      farmersCreated: importDto.farmersAndPlotsOfLand.length,
      plotsOfLandCreated: importDto.farmersAndPlotsOfLand.length - 1,
      errors: ['Error: ' + errorMessage],
    });
  });

  it('should import master data with existing farmer', async () => {
    const resolvedFarmer = new UserOrFarmerDto('farmerId1', '', '', '', '', '', '');
    jest.spyOn(masterDataImportService, 'import').mockResolvedValue(IMPORT_DTO_MOCK);
    jest.spyOn(userService, 'readFarmerByPersonalId').mockResolvedValue(resolvedFarmer);

    const companyId = 'companyId1';
    const actualResult = await importService.importMasterData({ file: null, companyId: companyId });

    expect(actualResult).toEqual({
      employeesCreated: 1,
      farmersCreated: 0,
      plotsOfLandCreated: 1,
      errors: [],
    });
    expect(userService.createUser).toHaveBeenCalledWith({
      dto: IMPORT_DTO_MOCK.employees[0],
      companyId: companyId,
    });
    expect(userService.readFarmerByPersonalId).toHaveBeenCalledWith(
      IMPORT_DTO_MOCK.farmersAndPlotsOfLand[0].farmer.personalId,
      companyId,
    );
    expect(userService.createFarmer).toHaveBeenCalledTimes(0);
    expect(plotsOfLandService.createPlotOfLand).toHaveBeenCalledWith(
      IMPORT_DTO_MOCK.farmersAndPlotsOfLand[0].plotOfLand,
      resolvedFarmer.id,
    );
  });

});
