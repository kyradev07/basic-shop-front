import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category/category.service';
import { NotificationService } from '../../services/util/notification.service';
import { Category } from '../../models/category.interface';
import { catchError, filter, Observable, of, switchMap } from 'rxjs';
import { AsyncPipe, NgStyle } from '@angular/common';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product/product.service';
import { CarouselComponent } from '../carousel/carousel.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgStyle,
    CarouselComponent
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly productService: ProductService = inject(ProductService);
  private readonly notificationService: NotificationService = inject(NotificationService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  categories$: Observable<Category[]>;
  imagesBase64: string[] = [];
  isEditing: boolean = false;
  productEdit!: Product;

  productForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: ['', [Validators.required, Validators.minLength(2)]],
    precio: ['', [Validators.required, Validators.min(1)]],
    stock: ['', [Validators.required, Validators.min(0)]],
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

    this.activatedRoute.params.pipe(
      filter(params => params['id'] != null),
      switchMap(params => this.productService.findById(params['id'])),
    ).subscribe({
      next: product => {
        this.productEdit = { ...product };
        this.isEditing = true;
        this.loadProduct(product);
      },
      error: error => this.notificationService.notificationError(error.error.message ?? error.message)
    });
  }

  private loadProduct(product: Product): void {
    this.productForm.controls.nombre.setValue(product.name);
    this.productForm.controls.descripcion.setValue(product.description);
    this.productForm.controls.precio.setValue(product.price.toString());
    this.productForm.controls.stock.setValue(product.stock.toString());
    this.productForm.controls.categoria.setValue(this.getCategory(product));
    this.imagesBase64 = [...product.images];
  }

  private getCategory(product: Product): string {
    let idCategory: string = '';

    if (typeof product.category === 'object') {
      idCategory = product.category.id!.toString()
    }
    return idCategory;
  }


  onSubmit() {
    const product: Product = {
      name: this.productForm.controls.nombre.value,
      description: this.productForm.controls.descripcion.value,
      price: +this.productForm.controls.precio.value,
      stock: +this.productForm.controls.stock.value,
      category: +this.productForm.controls.categoria.value,
      images: [...this.imagesBase64]
    };

    if (this.isEditing) {
      this.productService.updateProduct(this.productEdit.id, product).subscribe({
        next: (product) => {
          this.notificationService.notificationSuccess(`Producto '${product.name}' editado exitosamente`);
          //this.reset();
        },
        error: (error) => this.notificationService.notificationError(error.error.message ?? error.message),
      });

    } else {
      this.productService.createProduct(product).subscribe({
        next: (product) => {
          this.notificationService.notificationSuccess(`Producto '${product.name}' creado exitosamente`);
          this.reset();
        },
        error: (error) => this.notificationService.notificationError(error.error.message ?? error.message),
      });
    }
  }

  reset() {
    if (this.isEditing) {
      this.productForm.reset();
      this.loadProduct(this.productEdit);
    } else {
      this.productForm.reset();
      this.imagesBase64 = [];
    }
  }

  onFileChange(event: Event): void {
    this.imagesBase64 = [];
    let input: HTMLInputElement | null = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    if (input.files.length > 5) {
      this.productForm.controls.images.reset();
      this.notificationService.notificationWarning(`No puede seleccionar más de 5 fotos`);
      return;
    }

    Array.from(input.files).forEach((file: File) => {
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
            const webpBase64 = canvas.toDataURL('image/webp', 0.5);
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
