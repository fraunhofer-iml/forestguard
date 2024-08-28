import { KeycloakService } from 'keycloak-angular';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: KeycloakService,
          useValue: {
            keycloakInstance: () => {
              return {
                token: 'token',
                tokenParsed: {
                  sub: '',
                },
              };
            },
            keycloakEvents$: of({ type: 'OnTokenExpired' }),
            logout: jest.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
