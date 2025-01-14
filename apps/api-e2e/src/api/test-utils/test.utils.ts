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
