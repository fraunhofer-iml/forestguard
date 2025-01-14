/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
