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
import { CultivationController } from './cultivation.controller';
import { CultivationService } from './cultivation.service';

describe('CultivationController', () => {
  let controller: CultivationController;
  let service: CultivationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CultivationController],
      providers: [
        {
          provide: CultivationService,
          useValue: {
            readCultivationsByCommodity: jest.fn().mockImplementation((type) => Promise.resolve({ type })),
          },
        },
      ],
    }).compile();

    controller = module.get<CultivationController>(CultivationController);
    service = module.get<CultivationService>(CultivationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
