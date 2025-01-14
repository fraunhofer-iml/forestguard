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

import { mockedPrismaBatchWithRelations1, mockedPrismaBatchWithRelations2 } from '../mocked-data/batch.mock';
import { mapBatchPrismaToBatchDto } from './batch.mapper';

describe('Batch Mapper', () => {
  it('should map BatchWithRelations to BatchDto', () => {
    const expectedBatchDto = {
      ...mockedPrismaBatchWithRelations1,
      processStep: {
        ...mockedPrismaBatchWithRelations1.processStep,
        recordedBy: mockedPrismaBatchWithRelations1.processStep.recordedBy.user,
        executedBy: mockedPrismaBatchWithRelations1.processStep.executedBy.user,
      },
      recipient: {
        ...mockedPrismaBatchWithRelations1.recipient.user,
      },
    };

    const expectedBatchDto2 = {
      ...mockedPrismaBatchWithRelations2,
      processStep: {
        ...mockedPrismaBatchWithRelations2.processStep,
        recordedBy: mockedPrismaBatchWithRelations2.processStep.recordedBy.company,
        executedBy: mockedPrismaBatchWithRelations2.processStep.executedBy.company,
      },
      recipient: {
        ...mockedPrismaBatchWithRelations2.recipient.company,
      },
    };

    const result = mapBatchPrismaToBatchDto(mockedPrismaBatchWithRelations1);
    expect(result).toEqual(expectedBatchDto);

    const result2 = mapBatchPrismaToBatchDto(mockedPrismaBatchWithRelations2);
    expect(result2).toEqual(expectedBatchDto2);
  });
});
