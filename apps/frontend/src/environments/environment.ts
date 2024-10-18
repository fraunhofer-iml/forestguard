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
  MINIO: {
    URL: 'http://localhost:9000/forest-guard/',
  },
  KEYCLOAK: {
    URL: 'http://localhost:8080',
    REALM: 'forest-guard',
    CLIENT_ID: 'frontend',
  },
};
