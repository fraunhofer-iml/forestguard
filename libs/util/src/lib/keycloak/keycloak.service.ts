import { ConfigurationService } from '@forest-guard/configuration';
import { firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class KeycloakService {
  private readonly logger = new Logger(KeycloakService.name);
  private authHeader = '';
  constructor(private readonly httpService: HttpService, private readonly config: ConfigurationService) {}

  getAuthHeader(): string {
    return this.authHeader;
  }

  setAuthHeader(authHeader: string) {
    this.authHeader = authHeader;
  }

  async refreshAuthHeaderFromKeycloak(): Promise<string> {
    await this.requestAccessToken().then(
      (value) => {
        this.authHeader = 'Bearer ' + value;
      },
      (reason) => {
        const text = `could not obtain JWT: ${JSON.stringify(reason)}`;
        this.logger.error(text);
        throw Error(text);
      }
    );
    return this.authHeader;
  }

  private async requestAccessToken(): Promise<string> {
    const keycloakRefreshTokenUrl = `${this.config.getKeycloakConfig().url}/realms/${
      this.config.getKeycloakConfig().realm
    }/protocol/openid-connect/token`;

    return await firstValueFrom(
      this.httpService
        .post(
          keycloakRefreshTokenUrl,
          {
            grant_type: this.config.getKeycloakConfig().grantType,
            client_id: this.config.getKeycloakConfig().clientId,
            client_secret: this.config.getKeycloakConfig().clientSecret,
            username: this.config.getKeycloakConfig().username,
            password: this.config.getKeycloakConfig().password,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .pipe(map((response) => response?.data['access_token']))
    );
  }
}
