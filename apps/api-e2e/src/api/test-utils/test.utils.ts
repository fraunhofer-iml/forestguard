/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConfigurationModule, ConfigurationService } from '@forest-guard/configuration';
import axios from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

type HttpHeader = {
  headers: {
    Authorization: string;
  };
};

const prisma = new PrismaClient();

function beforeEachAndAfterAll(): void {
  beforeEach(async () => {
    await truncateTables();
  });

  afterAll(async () => {
    await truncateTables();
    await prisma.$disconnect();
  });
}

async function truncateTables(): Promise<void> {
  await prisma.$executeRaw`TRUNCATE TABLE "Address", "Entity", "Company", "User", "PlotOfLand", "Cultivation", "Proof", "Process", "ProcessStep", "Batch" RESTART IDENTITY CASCADE`;
}

async function createHttpHeader(): Promise<HttpHeader> {
  const jwt: string = await fetchJwt();
  return { headers: { Authorization: 'Bearer ' + jwt } };
}

async function fetchJwt(): Promise<string> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [ConfigurationModule],
  }).compile();
  const configurationService: ConfigurationService = moduleRef.get<ConfigurationService>(ConfigurationService);
  const keycloakConfig = configurationService.getKeycloakConfig();
  let jwt = '';

  try {
    const url = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/${keycloakConfig.tokenUri}`;
    const payload = new URLSearchParams({
      client_id: keycloakConfig.clientId,
      client_secret: keycloakConfig.clientSecret,
      grant_type: keycloakConfig.grantType,
      username: keycloakConfig.username,
      password: keycloakConfig.password,
    });
    const config = {
      headers: {
        Accept: 'application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const response = await axios.post(url, payload, config);
    jwt = response.data.access_token;
  } catch (e) {
    throw new Error('Failed to get JWT');
  }
  return jwt;
}

export { HttpHeader, prisma, beforeEachAndAfterAll, createHttpHeader };
