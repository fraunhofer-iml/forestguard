/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { version } from 'package.json';

const BASE_URL = 'http://localhost:3000';

export const environment = {
  VERSION: version,
  production: false,
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
    URL: 'http://localhost:9000/forest-guard/',
  },
  KEYCLOAK: {
    URL: 'http://localhost:8080',
    REALM: 'forest-guard',
    CLIENT_ID: 'frontend',
  },
};
