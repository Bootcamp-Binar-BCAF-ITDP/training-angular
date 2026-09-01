import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { LoanApplication, LoanApplicationQuery, PagedResponse } from '../../../models/loan-application.models';

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/api/loan-application`;

  getPage(query: LoanApplicationQuery): Observable<PagedResponse<LoanApplication>> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('size', query.size);

    if (query.sort) {
      params = params.set('sort', query.sort);
    }

    return this.http.get<PagedResponse<LoanApplication>>(this.apiUrl, { params });
  }
}
