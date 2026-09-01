import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  DestroyRef
} from '@angular/core';

import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { Product } from '../../models/product.models';
import { ProductStore } from '../../core/store/product.store';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ConfirmModalComponent
  ],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(ProductStore);
  private destroyRef = inject(DestroyRef);

  products = toSignal(
    this.store.products$,
    { initialValue: [] as Product[] }
  );

  isLoadingProducts = toSignal(
    this.store.isFetching$,
    { initialValue: false }
  );

  isLoading = toSignal(
    this.store.isAdding$,
    { initialValue: false }
  );

  errorMessage = toSignal(
    this.store.error$,
    { initialValue: null as string | null }
  );

  isFilterButtonClicked = signal(false);
  filterTitle = signal('');

  showDeleteConfirmation = signal(false);
  selectedProduct: Product | null = null;

  productForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    description: [''],
  });

  filteredProducts = computed(() => {
    const allProducts = this.products();
    const isClicked = this.isFilterButtonClicked();
    const searchTerm = this.filterTitle().toLowerCase().trim();

    if (!isClicked || !searchTerm) {
      return allProducts;
    }

    return allProducts.filter(product =>
      product.title.toLowerCase().includes(searchTerm)
    );
  });

  ngOnInit(): void {
    this.store.loadProducts();
  }

  triggerComputedFilter(): void {
    this.isFilterButtonClicked.set(true);
  }

  onFilterInputReset(): void {
    this.isFilterButtonClicked.set(false);
  }

  addProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const product: Product = this.productForm.getRawValue();

    this.store.addProduct(product).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.productForm.reset({
          title: '',
          price: 0,
          description: '',
        });
      },
      error: () => {
      }
    });
  }

  openDeleteModal(product: Product): void {
    this.selectedProduct = product;
    this.showDeleteConfirmation.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteConfirmation.set(false);
    this.selectedProduct = null;
  }

  confirmDelete(): void {
    if (!this.selectedProduct) {
      return;
    }

    const product = this.selectedProduct;

    this.showDeleteConfirmation.set(false);
    this.selectedProduct = null;

    console.log("Delete Product: ", product);

    // this.store.deleteProduct(product.id).pipe(
    //   takeUntilDestroyed(this.destroyRef)
    // ).subscribe({
    //   next: () => {
    //     this.store.loadProducts();
    //   },
    //   error: () => {
    //   }
    // });
  }
}
