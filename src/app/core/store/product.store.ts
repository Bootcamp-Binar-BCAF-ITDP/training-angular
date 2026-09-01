import { inject, Injectable, DestroyRef } from "@angular/core";
import { BehaviorSubject, Subject, catchError, Observable, tap, throwError, switchMap, map, filter, finalize, of } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MasterProduct } from "../service/master/product/product.services";
import { Product } from "../../models/product.models";

@Injectable({
  providedIn: 'root'
})
export class ProductStore {
  private productService = inject(MasterProduct);
  private destroyRef = inject(DestroyRef);

  private productsSubject = new BehaviorSubject<Product[]>([]);
  private isFetchingSubject = new BehaviorSubject<boolean>(false);
  private isAddingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  private loadProductsAction$ = new Subject<void>();

  products$ = this.productsSubject.asObservable();
  isFetching$ = this.isFetchingSubject.asObservable();
  isAdding$ = this.isAddingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor() {
    this.loadProductsAction$.pipe(
      tap(() => {
        this.isFetchingSubject.next(true);
        this.errorSubject.next(null);
      }),
      switchMap(() =>
        this.productService.getProduct().pipe(
          filter(response => !!response && !!response.products),
          map(response => response.products),
          catchError((error) => {
            console.error('Failed to get products:', error);
            this.errorSubject.next(error?.error?.message || 'Failed to get products');
            return of([] as Product[]);
          }),
          finalize(() => this.isFetchingSubject.next(false))
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((products) => {
      if (products.length > 0 || !this.errorSubject.getValue()) {
        this.productsSubject.next(products);
      }
    });
  }

  loadProducts(): void {
    this.loadProductsAction$.next();
  }

  addProduct(product: Product): Observable<Product> {
    this.isAddingSubject.next(true);
    this.errorSubject.next(null);

    return this.productService.addProduct(product).pipe(
      tap((newProduct) => {
        const currentProducts = this.productsSubject.getValue();
        this.productsSubject.next([...currentProducts, newProduct]);
      }),
      catchError((error) => {
        console.error('Failed to add product:', error);
        this.errorSubject.next(error?.error?.message || 'Failed to add product');
        return throwError(() => error);
      }),
      finalize(() => this.isAddingSubject.next(false))
    );
  }
}
