import { PrismaClient } from '@prisma/client';
import { Entity, importEntities } from './data_import';

const addresses = require('./data/addresses.json');
const companies = require('./data/companies.json');
const entities = require('./data/entities.json');
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
