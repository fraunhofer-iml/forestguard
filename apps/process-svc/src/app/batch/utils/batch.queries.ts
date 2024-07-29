import { BatchCreateDto } from '@forrest-guard/api-interfaces';
import JSON5 from 'json5';

export const batchQuery = (batchCreateDto: BatchCreateDto) => ({
  euInfoSystemId: batchCreateDto.idEUInfoSystem,
  weight: batchCreateDto.weight,
  active: true,
  recipient: {
    connect: {
      id: batchCreateDto.recipient,
    },
  },
  processStep: {
    create: processStepQuery(batchCreateDto),
  },
});

export const createBatchQuery = (batchCreateDto: BatchCreateDto) => ({
  ...batchQuery(batchCreateDto),
  ins: {
    connect: batchCreateDto.ins.map((batchId) => ({
      id: batchId,
    })),
  },
  processStep: {
    create: {
      ...processStepQuery(batchCreateDto),
      farmedLand: batchCreateDto.processStep.harvestedLand
        ? {
            connect: {
              id: batchCreateDto.processStep.harvestedLand,
            },
          }
        : undefined,
    },
  },
});

export const readBatchByIdQuery = (id: string) => ({
  where: {
    id: id,
  },
  include: readBatchIncludeQuery(),
});

export const readBatchesByIdsQuery = (ids: string[]) => ({
  where: {
    id: { in: ids },
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

const processStepQuery = (batchCreateDto: BatchCreateDto) => ({
  location: batchCreateDto.processStep.location,
  date: batchCreateDto.processStep.date,
  process: {
    connectOrCreate: {
      create: {
        name: batchCreateDto.processStep.process,
      },
      where: {
        name: batchCreateDto.processStep.process,
      },
    },
  },
  recordedBy: {
    connect: {
      id: batchCreateDto.processStep.recordedBy,
    },
  },
  executedBy: {
    connect: {
      id: batchCreateDto.processStep.executedBy,
    },
  },
  farmedLand: {
    connect: {
      id: batchCreateDto.processStep.harvestedLand,
    },
  },
});

export const exportBatchIncludeQuery = () => ({
  ...readBatchIncludeQuery(),
  ins: true,
  outs: true,
});

const readBatchIncludeQuery = () => ({
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
