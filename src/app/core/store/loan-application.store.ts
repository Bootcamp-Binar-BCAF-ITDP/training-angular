// store/loan-application.store.ts
import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { LoanApplication, PageMeta } from '../../models/loan-application.models';
import { LoanApplicationService } from '../service/loan-application/loan-application.services';

interface LoanApplicationState {
  items: LoanApplication[];
  meta: PageMeta;
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: LoanApplicationState = {
  items: [],
  meta: { page: 0, size: 10, totalElements: 0, totalPages: 0 },
  loading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class LoanApplicationStore {
  private readonly loanApplicationService = inject(LoanApplicationService);

  private readonly state = signal<LoanApplicationState>(INITIAL_STATE);

  readonly items = () => this.state().items;
  readonly meta = () => this.state().meta;
  readonly loading = () => this.state().loading;
  readonly error = () => this.state().error;

  loadPage(page: number, size: number, sort?: string): void {
    this.state.update((s) => ({ ...s, loading: true, error: null }));

    this.loanApplicationService
      .getPage({ page, size, sort })
      .pipe(finalize(() => this.state.update((s) => ({ ...s, loading: false }))))
      .subscribe({
        next: (response) => {
          this.state.update((s) => ({
            ...s,
            items: response.data,
            meta: response.meta,
          }));
        },
        error: () => {
          this.state.update((s) => ({
            ...s,
            error: 'Gagal memuat data pengajuan pinjaman.',
          }));
        },
      });
  }
}
