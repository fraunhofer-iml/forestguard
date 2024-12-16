import { Role } from '@forest-guard/api-interfaces';

export class KeycloakUtil {
  static toRealmRole(role: Role) {
    return 'realm:' + role;
  }
}
