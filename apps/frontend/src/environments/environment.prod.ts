const BASE_URL = 'https://fg-api.apps.blockchain-europe.iml.fraunhofer.de';

export const environment = {
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
    URL: `${BASE_URL}/cultitations`,
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
  MINIO: {
    URL: 'https://minioo.public.apps.blockchain-europe.iml.fraunhofer.de/forest-guard/',
  },
};
