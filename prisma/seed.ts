/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { env } from 'process';
import { PrismaClient } from '@prisma/client';
import { Entity, importEntities } from './data_import';

let dataSets: Entity[] = [];

if (!env.IMPORT_REWE_DATA) {
  console.log('### Importing default test data ###');
  const addresses = require('./data/addresses.json');
  const companies = require('./data/companies.json');
  const entities = require('./data/entities.json');
  const users = require('./data/users.json');
  dataSets = [
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
} else {
  console.log('### Importing rewe data set ###');
  const addresses = require('./rewe-data/Address.json');
  const companies = require('./rewe-data/Company.json');
  const entities = require('./rewe-data/Entity.json');
  const users = require('./rewe-data/User.json');
  const cultivations = require('./rewe-data/Cultivation.json');
  const processes = require('./rewe-data/Process.json');
  const plotsOfLand = require('./rewe-data/PlotOfLand.json');
  const batches = require('./rewe-data/Batch.json');
  const processSteps = require('./rewe-data/ProcessStep.json');
  const documents = require('./rewe-data/Document.json');
  const batchRelations = require('./rewe-data/_BatchRelation.json');
  dataSets = [
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
      name: 'process',
      records: processes,
      createRecord: async (data: any) => await prisma.process.create({ data }),
    },
    {
      name: 'plotOfLand',
      records: plotsOfLand,
      createRecord: async (data: any) => await prisma.plotOfLand.create({ data }),
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
    {
      name: 'document',
      records: documents,
      createRecord: async (data: any) => await prisma.document.create({ data }),
    },
    {
      name: 'batchRelation',
      records: batchRelations,
      createRecord: async (data: any) => await prisma.batch.update({ where: { id: data.B }, data: { outs: { connect: { id: data.A } } } }),
    },
  ];
}

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
