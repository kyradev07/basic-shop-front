import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.interface';
import { NotificationService } from '../../services/util/notification.service';

@Component({
  selector: 'app-category-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent {

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly categoryService: CategoryService = inject(CategoryService);
  private readonly notificationService: NotificationService = inject(NotificationService);

  categoryForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
  });

  onSubmit(): void {
    const category: Category = {
      name: this.categoryForm.controls.nombre.value
    }

    this.categoryService.createCategory(category).subscribe({
      next: (category) => {
        this.notificationService.notificationSuccess(`Categoría '${category.name}' creada exitosamente`);
        this.reset();
      },
      error: (error) => this.notificationService.notificationError(error.error.message),
    });
  }

  reset(): void {
    this.categoryForm.reset();
  }
}
