import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { LoanApplicationStore } from '../../core/store/loan-application.store';

@Component({
  selector: 'app-loan-application-list',
  standalone: true,
  templateUrl: './loan-application.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanApplicationListComponent implements OnInit {
  readonly store = inject(LoanApplicationStore);

  ngOnInit(): void {
    this.store.loadPage(0, 10);
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.store.meta().totalPages) {
      return;
    }

    this.store.loadPage(page, this.store.meta().size);
  }
}
