import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { authGuard } from './auth.guard';

describe('RoleGuard', () => {
  const roleGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(roleGuard).toBeTruthy();
  });
});
