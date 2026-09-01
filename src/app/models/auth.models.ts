// auth.models.ts
export interface LoginRequest {
  username: string;
  password: string;
}

// The actual payload inside "data"
export interface LoginData {
  token: string;
  tipe: string;
  roles: string[];
}

// Generic wrapper matching your API's envelope shape
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export type LoginResponse = ApiResponse<LoginData>;
