import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category/category.service';
import { NotificationService } from '../../services/util/notification.service';
import { Category } from '../../models/category.interface';
import { catchError, Observable, of } from 'rxjs';
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

  categories$: Observable<Category[]>;
  imagesBase64: string[] = [];

  productForm = this.fb.nonNullable.group({
    nombre: ['fdf', [Validators.required, Validators.minLength(2)]],
    descripcion: ['fdf', [Validators.required, Validators.minLength(2)]],
    precio: [1, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoria: ['', [Validators.required]],
    images: ['', [Validators.required]]
  });

  constructor() {
    this.categories$ = this.categoryService.findAll().pipe(
      catchError(error => {
        this.notificationService.notificationError(error.error.message ?? error.message);
        return of(error);
      }),
    );
  }

  onSubmit() {
    if (this.imagesBase64.length > 5) {
      this.notificationService.notificationWarning(`No puede seleccionar más de 5 fotos`);
      return;
    }

    const product: Product = {
      name: this.productForm.controls.nombre.value,
      description: this.productForm.controls.descripcion.value,
      price: +this.productForm.controls.precio.value,
      stock: +this.productForm.controls.stock.value,
      category: +this.productForm.controls.categoria.value,
      images: this.imagesBase64.length === 0 ? null : [...this.imagesBase64]
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
    this.imagesBase64 = [];
  }

  onFileChange(event: Event) {
    this.imagesBase64 = [];
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    Array.from(input.files).forEach((file: File) => {
      const maxSizeKB = 200;
      if (file.size / 1024 > maxSizeKB) {
        this.notificationService.notificationWarning(`La imagen ${file.name} excede el límite de ${maxSizeKB}KB`);
        return;
      }

      const reader: FileReader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        const img: HTMLImageElement = new Image();
        img.src = result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const webpBase64 = canvas.toDataURL('image/webp', 0.6);
            this.imagesBase64.push(webpBase64);
          }
        };

        img.onerror = () => {
          this.notificationService.notificationError(`Error cargando la imagen: ${file.name}`);
        };
      };

      reader.onerror = () => {
        this.notificationService.notificationError(`Error leyendo el archivo: ${file.name}`);
      };

      reader.readAsDataURL(file);
    });
  }
}
