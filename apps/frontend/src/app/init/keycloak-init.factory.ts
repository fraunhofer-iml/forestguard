import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.KEYCLOAK.URL,
        realm: environment.KEYCLOAK.REALM,
        clientId: environment.KEYCLOAK.CLIENT_ID,
      },
      loadUserProfileAtStartUp: true,
      initOptions: {
        onLoad: 'login-required',
      },
    });
}
