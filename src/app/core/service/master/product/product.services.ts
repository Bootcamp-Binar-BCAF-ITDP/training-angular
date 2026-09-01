import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product, ProductResponse } from '../../../../models/product.models';

@Injectable({
  providedIn: 'root',
})
export class MasterProduct {
  private http = inject(HttpClient);

  private readonly API_URL = 'https://dummyjson.com/products';

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/add`, product);
  }

  getProduct(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.API_URL);
  }
}
