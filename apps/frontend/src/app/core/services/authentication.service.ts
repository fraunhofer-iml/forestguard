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

import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private readonly keycloak: KeycloakService) {
    this.setUpTokenRefresh();
  }

  getCurrentCompanyId() {
    const token = this.keycloak.getKeycloakInstance().tokenParsed;
    return token ? token.sub : null;
  }

  getCurrentJwt() {
    return this.keycloak.getKeycloakInstance().token;
  }

  hasRole(role: string): boolean {
    return this.keycloak.getUserRoles().includes(role);
  }

  isAccountEnabled(): boolean {
    return this.hasRole('enabled');
  }

  logout(): void {
    this.keycloak.logout(window.location.origin);
  }

  private setUpTokenRefresh(): void {
    this.keycloak.keycloakEvents$.subscribe({
      next: (event) => {
        if (event.type === KeycloakEventType.OnTokenExpired) {
          this.keycloak.updateToken(10).catch(() => {
            console.error('Failed to refresh token');
          });
        }
      },
    });
  }
}
