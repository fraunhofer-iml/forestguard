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

import { version } from 'package.json';

const BASE_URL = 'https://fg-api.apps.blockchain-europe.iml.fraunhofer.de';

export const environment = {
  VERSION: version,
  production: true,
  AUTH: {
    URL: `${BASE_URL}/auth`,
  },
  BATCHES: {
    URL: `${BASE_URL}/batches`,
  },
  COMPANIES: {
    URL: `${BASE_URL}/companies`,
  },
  CULTIVATIONS: {
    URL: `${BASE_URL}/cultivations`,
  },
  PLOTSOFLAND: {
    URL: `${BASE_URL}/pols`,
  },
  PROCESSES: {
    URL: `${BASE_URL}/processes`,
  },
  USERS: {
    URL: `${BASE_URL}/users`,
  },
  PROCESSSTEPS: {
    URL: `${BASE_URL}/process-steps`,
  },
  IMPORT: {
    URL: `${BASE_URL}/import`,
  },
  MINIO: {
    URL: 'https://minioo.public.apps.blockchain-europe.iml.fraunhofer.de/forest-guard/',
  },
  KEYCLOAK: {
    URL: 'https://kc.apps.blockchain-europe.iml.fraunhofer.de',
    REALM: 'forest-guard',
    CLIENT_ID: 'frontend',
  },
};
