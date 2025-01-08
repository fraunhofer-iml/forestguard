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
