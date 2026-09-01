import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';
import { LoginData, LoginResponse } from '../../../models/auth.models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.baseUrl}/api/auth/karyawan/login`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should login successfully and save the session', () => {
    const loginRequest = {
      username: 'admin@example.com',
      password: 'Password123',
    };

    const payload = {
      sub: 'admin@example.com',
      roles: ['ADMIN'],
      idKaryawan: 1,
      tipe: 'KARYAWAN',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    const encode = (value: unknown) =>
      btoa(JSON.stringify(value))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    const token = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`;

    const loginData: LoginData = {
      token,
      tipe: 'KARYAWAN',
      roles: ['ADMIN'],
    };

    const response = {
      data: loginData,
    } as LoginResponse;

    service.login(loginRequest).subscribe((data) => {
      service.saveSession(data);

      expect(data.token).toBe(token);
      expect(service.getToken()).toBe(token);
      expect(service.currentUser()).not.toBeNull();
      expect(service.currentUser()?.sub).toBe('admin@example.com');
      expect(service.currentUser()?.roles).toEqual(['ADMIN']);
    });

    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(loginRequest);

    request.flush(response);
  });

  it('should return false when the stored token is expired', () => {
    const payload = {
      sub: 'admin@example.com',
      roles: ['ADMIN'],
      idKaryawan: 1,
      tipe: 'KARYAWAN',
      iat: 1000,
      exp: 1000,
    };

    const encode = (value: unknown) =>
      btoa(JSON.stringify(value))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    const expiredToken =
      `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`;

    localStorage.setItem('auth_token', expiredToken);

    expect(service.isLoggedIn()).toBe(false);
  });
});
