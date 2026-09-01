import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { LoginData, LoginRequest, LoginResponse } from '../../../models/auth.models';
import { environment } from '../../../../environments/environment';

export interface DecodedToken {
  sub: string;
  roles: string[];
  idKaryawan: number;
  tipe: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.baseUrl;

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user_info';

  currentUser = signal<DecodedToken | null>(this.getStoredUser());

  login(request: LoginRequest): Observable<LoginData> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/api/auth/karyawan/login`, request)
      .pipe(map((response) => response.data));
  }

  saveSession(data: LoginData): void {
    const decoded = this.getDecodedAccessToken(data.token);

    if (!decoded) {
      throw new Error('Token yang diterima tidak valid.');
    }

    localStorage.setItem(this.TOKEN_KEY, data.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(decoded));
    this.currentUser.set(decoded);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    const decoded = this.getDecodedAccessToken(token);

    if (!decoded || decoded.exp * 1000 < Date.now()) {
      return false;
    }

    return true;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  private getStoredUser(): DecodedToken | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const data = localStorage.getItem(this.USER_KEY);

    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data) as DecodedToken;
    } catch {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }

  private getDecodedAccessToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }
}
