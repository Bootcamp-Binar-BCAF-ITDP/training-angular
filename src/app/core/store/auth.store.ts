import { computed, Injectable, signal } from "@angular/core";
import { LoginData } from "../../models/auth.models";

interface AuthState {
  accessToken: string | null;
  tipe: string | null;
  roles: string[];
}

const INITIAL_AUTH_STATE: AuthState = {
  accessToken: null,
  tipe: null,
  roles: [],
};

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly state = signal<AuthState>(INITIAL_AUTH_STATE);

  readonly accessToken = computed(() => this.state().accessToken);
  readonly roles = computed(() => this.state().roles);
  readonly isAuthenticated = computed(() => this.state().accessToken !== null);

  setSession(data: LoginData): void {
    this.state.set({
      accessToken: data.token,
      tipe: data.tipe,
      roles: data.roles,
    });
  }

  clearSession(): void {
    this.state.set(INITIAL_AUTH_STATE);
  }
}
