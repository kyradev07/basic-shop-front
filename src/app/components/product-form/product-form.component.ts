import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category/category.service';
import { NotificationService } from '../../services/util/notification.service';
import { Category } from '../../models/category.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AsyncPipe, NgStyle } from '@angular/common';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgStyle
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly productService: ProductService = inject(ProductService);
  private readonly notificationService: NotificationService = inject(NotificationService);

  categorias$: Observable<Category[]>;

  productForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: ['', [Validators.required, Validators.minLength(2)]],
    precio: ['', [Validators.required, Validators.min(1)]],
    stock: ['', [Validators.required, Validators.min(0)]],
    categoria: ['', [Validators.required]]
  });

  constructor() {
    this.categorias$ = this.categoryService.findAll().pipe(
      catchError(error=> {
        this.notificationService.notificationError(error.error.message ?? error.message);
        return of(error);
      }),
    );
  }

  onSubmit() {
    const product: Product = {
      name: this.productForm.controls.nombre.value,
      description: this.productForm.controls.descripcion.value,
      price: +this.productForm.controls.precio.value,
      stock: +this.productForm.controls.stock.value,
      category: +this.productForm.controls.categoria.value,
    };

    this.productService.createProduct(product).subscribe({
      next: (product) => {
        this.notificationService.notificationSuccess(`Producto '${product.name}' creado exitosamente`);
        this.reset();
      },
      error: (error) => this.notificationService.notificationError(error.error.message ?? error.message),
    })
  }

  reset() {
    this.productForm.reset();
  }

}
