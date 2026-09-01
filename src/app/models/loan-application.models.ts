// models/loan-application.models.ts
import { ApiResponse } from './auth.models'; // reuse if you already have this; else define below

export interface PageMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// TODO: replace with real fields once the API returns populated rows
export interface LoanApplication {
  id: number;
  applicantName: string;
  loanAmount: number;
  status: string;
  submittedAt: string;
}

export interface PagedResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
  meta: PageMeta;
}

export interface LoanApplicationQuery {
  page: number;
  size: number;
  sort?: string;
}
