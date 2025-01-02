import { Role } from '@forest-guard/api-interfaces';
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

  isRoleCooperative() {
    return this.keycloak.getUserRoles().some((role: string) => role === Role.Cooperative);
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
