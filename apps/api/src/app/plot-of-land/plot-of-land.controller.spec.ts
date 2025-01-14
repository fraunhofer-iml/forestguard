/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PlotOfLandController } from './plot-of-land.controller';
import { PlotOfLandService } from './plot-of-land.service';

describe('PlotOfLandController', () => {
  let controller: PlotOfLandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlotOfLandController],
      providers: [
        {
          provide: PlotOfLandService,
          useValue: {
            readPlotOfLand: jest.fn().mockImplementation((id) => Promise.resolve({ id })),
            readPlotsOfLand: jest.fn().mockImplementation((farmerId?) => Promise.resolve([{ farmerId }])),
            createPlotOfLand: jest
              .fn()
              .mockImplementation((plotOfLandCreateDto, farmerId) => Promise.resolve({ ...plotOfLandCreateDto, farmerId })),
            updatePlotOfLand: jest.fn().mockImplementation((plotOfLandUpdateDto, id) => Promise.resolve({ ...plotOfLandUpdateDto, id })),
          },
        },
      ],
    }).compile();

    controller = module.get<PlotOfLandController>(PlotOfLandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
