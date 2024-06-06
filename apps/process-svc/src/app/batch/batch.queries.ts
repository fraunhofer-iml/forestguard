import { BatchCreateDto } from '@forrest-guard/api-interfaces';

export const createHarvestQuery = (batchCreateDto: BatchCreateDto, harvestProcessId: string) => ({
  euInfoSystemId: batchCreateDto.idEUInfoSystem,
  weight: batchCreateDto.weight,
  active: true,
  recipient: {
    connect: {
      id: batchCreateDto.recipient,
    },
  },
  processStep: {
    create: {
      location: batchCreateDto.processStep.location,
      date: batchCreateDto.processStep.date,
      process: {
        connect: {
          id: harvestProcessId,
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
    },
  },
});

export const readBatchByIdQuery = (id: string) => ({
  where: {
    id: id,
  },
  include: readBatchIncludeQuery(),
});

export const readCoffeeBatchesByCompanyIdQuery = (companyId: string) => ({
  where: {
    recipientId: companyId,
  },
  include: readBatchIncludeQuery(),
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
