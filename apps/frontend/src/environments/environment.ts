const BASE_URL = 'http://localhost:3000';

export const environment = {
  production: false,
  AUTH: {
    URL:  `${BASE_URL}/auth`,
  },
  BATCHES: {
    URL:  `${BASE_URL}/batches`
  },
  COMPANIES: {
    URL:  `${BASE_URL}/companies`
  },
  CULTIVATIONS: {
    URL:  `${BASE_URL}/cultitations`
  },
  PLOTSOFLAND: {
    URL: `${BASE_URL}/pols`
  },
  PROCESSES: {
    URL: `${BASE_URL}/processes`
  },
  USERS: {
    URL: `${BASE_URL}/users`
  }
}
