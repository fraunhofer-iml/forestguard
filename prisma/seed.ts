import { PrismaClient } from '@prisma/client';
import { Entity, importEntities } from './data_import';

const addresses = require('./data/addresses.json');
const batches = require('./data/batches.json');
const companies = require('./data/companies.json');
const cultivations = require('./data/cultivations.json');
const entities = require('./data/entities.json');
const plotsOfLands = require('./data/plots-of-lands.json');
const processSteps = require('./data/process-steps.json');
const processes = require('./data/processes.json');
const proofs = require('./data/proofs.json');
const users = require('./data/users.json');

// Do not change the sequence!
const dataSets: Entity[] = [
  {
    name: 'address',
    records: addresses,
    createRecord: async (data: any) => await prisma.address.create({ data }),
  },
  {
    name: 'entity',
    records: entities,
    createRecord: async (data: any) => await prisma.entity.create({ data }),
  },
  {
    name: 'company',
    records: companies,
    createRecord: async (data: any) => await prisma.company.create({ data }),
  },
  {
    name: 'user',
    records: users,
    createRecord: async (data: any) => await prisma.user.create({ data }),
  },
  {
    name: 'cultivation',
    records: cultivations,
    createRecord: async (data: any) => await prisma.cultivation.create({ data }),
  },
  {
    name: 'plotOfLand',
    records: plotsOfLands,
    createRecord: async (data: any) => await prisma.plotOfLand.create({ data }),
  },
  {
    name: 'proof',
    records: proofs,
    createRecord: async (data: any) => await prisma.proof.create({ data }),
  },
  {
    name: 'process',
    records: processes,
    createRecord: async (data: any) => await prisma.process.create({ data }),
  },
  {
    name: 'processStep',
    records: processSteps,
    createRecord: async (data: any) => await prisma.processStep.create({ data }),
  },
  {
    name: 'batch',
    records: batches,
    createRecord: async (data: any) => await prisma.batch.create({ data }),
  },
];

const prisma = new PrismaClient();

importEntities(dataSets)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('### Error during data import:');
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
