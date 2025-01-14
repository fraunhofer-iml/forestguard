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

import { registerAs } from '@nestjs/config';

export const KEYCLOAK_IDENTIFIER = 'keycloak';

export interface KeycloakConfiguration {
  url: string;
  realm: string;
  tokenUri: string;
  clientId: string;
  clientSecret: string;
  grantType: string;
  username: string;
  password: string;
}

export default registerAs(KEYCLOAK_IDENTIFIER, () => ({
  url: process.env['KEYCLOAK_URL'] || 'http://localhost:8080',
  realm: process.env['KEYCLOAK_REALM'] || 'forest-guard',
  tokenUri: process.env['KEYCLOAK_TOKEN_URI'] || 'protocol/openid-connect/token',
  clientId: process.env['KEYCLOAK_CLIENT_ID'] || 'api',
  clientSecret: process.env['KEYCLOAK_SECRET'] || 'BBSCFxCigdhm1vXSKetWYhaiJiZ8J0OY',
  username: process.env['KEYCLOAK_USER'] || '',
  password: process.env['KEYCLOAK_PASSWORD'] || '',
  grantType: process.env['KEYCLOAK_GRANT_TYPE'] || 'client_credentials',
}));
