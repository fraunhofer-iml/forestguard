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

import { BatchCreateDto, ProcessStepCreateDto } from '@forest-guard/api-interfaces';
import JSON5 from 'json5';

export const createOriginBatchQuery = (batchCreateDto: BatchCreateDto) => ({
  euInfoSystemId: batchCreateDto.euInfoSystemId,
  weight: batchCreateDto.weight,
  active: true,
  recipient: {
    connect: {
      id: batchCreateDto.recipient,
    },
  },
  processStep: {
    create: processStepQuery(batchCreateDto.processStep),
  },
});

export const createBatchQuery = (batchCreateDto: BatchCreateDto, existingProcessStepId = '') => ({
  ...createOriginBatchQuery(batchCreateDto),
  ins: {
    connect: batchCreateDto.ins.map((batchId) => ({
      id: batchId,
    })),
  },
  processStep: {
    connectOrCreate: {
      where: {
        id: existingProcessStepId,
      },
      create: {
        ...processStepQuery(batchCreateDto.processStep),
      },
    },
  },
});

export const processStepQuery = (processStep: ProcessStepCreateDto) => ({
  location: processStep.location,
  dateOfProcess: processStep.dateOfProcess,
  process: {
    connectOrCreate: {
      create: {
        name: processStep.process,
      },
      where: {
        name: processStep.process,
      },
    },
  },
  recordedBy: {
    connect: {
      id: processStep.recordedBy,
    },
  },
  executedBy: {
    connect: {
      id: processStep.executedBy,
    },
  },
  farmedLand: processStep.harvestedLand
    ? {
        connect: {
          id: processStep.harvestedLand,
        },
      }
    : undefined,
});

export const readBatchByIdQuery = (id: string) => ({
  where: {
    id: id,
  },
  include: readBatchIncludeQuery(),
});

export const readCoffeeBatchesByCompanyIdQuery = (companyId: string, query: string, sorting: string) => ({
  where: {
    recipientId: companyId,
    ...JSON5.parse(query),
  },
  orderBy: JSON5.parse(sorting),
  include: readBatchIncludeQuery(),
});

export const readBatchIncludeQuery = () => ({
  recipient: {
    include: {
      company: {
        include: {
          address: true,
        },
      },
      user: {
        include: {
          address: true,
        },
      },
    },
  },
  processStep: {
    include: {
      process: true,
      recordedBy: {
        include: {
          company: {
            include: {
              address: true,
            },
          },
          user: {
            include: {
              address: true,
            },
          },
        },
      },
      executedBy: {
        include: {
          company: {
            include: {
              address: true,
            },
          },
          user: {
            include: {
              address: true,
            },
          },
        },
      },
      documents: true,
      farmedLand: {
        include: {
          cultivatedWith: true,
          proofs: true,
        },
      },
    },
  },
  ins: true,
  outs: true,
});
