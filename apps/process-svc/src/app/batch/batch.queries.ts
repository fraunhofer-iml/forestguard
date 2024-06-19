import { BatchCreateDto } from '@forrest-guard/api-interfaces';

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
  out: {
    create: relationsPointingToInputBatches(batchCreateDto),
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

const relationsPointingToInputBatches = (batchCreateDto: BatchCreateDto) =>
  batchCreateDto.in.map((batchId) => ({
    in: {
      connect: {
        id: batchId,
      },
    },
  }));

export const readBatchByIdQuery = (id: string) => ({
  where: {
    id: id,
  },
  include: readBatchIncludeQuery(),
});

export const readCoffeeBatchesByCompanyIdQuery = (companyId: string) => ({
  where: {
    recipientId: companyId,
    active: true,
  },
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
});
