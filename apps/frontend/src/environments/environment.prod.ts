/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { version } from 'package.json';

const BASE_URL = 'https://fg-api.public.apps.blockchain-europe.iml.fraunhofer.de';

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
    URLSORTS: `${BASE_URL}/cultivations/sorts`,
    URLQUALITIES: `${BASE_URL}/cultivations/qualities`,
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
    URL: 'https://kc.public.apps.blockchain-europe.iml.fraunhofer.de',
    REALM: 'forest-guard',
    CLIENT_ID: 'frontend',
  },
};
