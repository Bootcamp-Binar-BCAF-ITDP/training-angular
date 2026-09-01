import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { LoginChallengeComponent } from './login-challenge.component';
import { AuthService } from '../../../core/service/auth/auth.service';
import { AuthStore } from '../../../core/store/auth.store';
import { LoginData } from '../../../models/auth.models';

describe('LoginChallengeComponent Integration', () => {
  let component: LoginChallengeComponent;
  let fixture: ComponentFixture<LoginChallengeComponent>;

  let authService: {
    login: ReturnType<typeof vi.fn>;
    saveSession: ReturnType<typeof vi.fn>;
  };

  let authStore: {
    setSession: ReturnType<typeof vi.fn>;
  };

  let router: {
    navigateByUrl: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authService = {
      login: vi.fn(),
      saveSession: vi.fn(),
    };

    authStore = {
      setSession: vi.fn(),
    };

    router = {
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [LoginChallengeComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: AuthStore,
          useValue: authStore,
        },
        {
          provide: Router,
          useValue: router,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => null,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginChallengeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should login successfully and navigate to dashboard', () => {
    const loginData: LoginData = {
      token: 'valid-token',
      tipe: 'KARYAWAN',
      roles: ['ADMIN'],
    };

    authService.login.mockReturnValue(of(loginData));

    component.form.setValue({
      email: 'admin@example.com',
      password: 'Password123',
      rememberMe: false,
    });

    component.submit();

    expect(authService.login).toHaveBeenCalledWith({
      username: 'admin@example.com',
      password: 'Password123',
    });

    expect(authService.saveSession).toHaveBeenCalledWith(loginData);

    expect(authStore.setSession).toHaveBeenCalledWith(loginData);

    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('should not login when the form is invalid', () => {
    component.form.setValue({
      email: '',
      password: '',
      rememberMe: false,
    });

    component.submit();

    expect(component.form.invalid).toBe(true);
    expect(authService.login).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
