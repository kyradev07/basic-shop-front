import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.interface';
import { NotificationService } from '../../services/util/notification.service';
import { TitleCasePipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories-list',
  imports: [
    TitleCasePipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent implements OnInit {

  categories: Category[] = [];
  isEditing: boolean[] = [];
  formControls: FormControl[] = []

  constructor(
    private readonly categoryService: CategoryService,
    private readonly notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.findAll();
  }

  private findAll() {
    this.isEditing = [];
    this.formControls = [];
    this.categories = [];
    this.categoryService.findAll().subscribe({
      next: (categories) => {
        this.categories = [...categories];
        this.createForm();
      },
      error: (error) => this.notificationService.notificationError(error.error.message ?? error.message),
    });
  }

  private createForm() {
    this.categories.forEach((category, index) => {
      this.isEditing[index] = false;
      this.formControls[index] = new FormControl(category.name, [Validators.required, Validators.minLength(3)]);
    });
  }

  edit(index: number) {
    this.isEditing[index] = true;
    this.formControls[index].setValue(this.categories[index].name);
  }

  save(index: number) {
    const id: number = this.categories[index].id || 0;
    const category: Category = {
      name: this.formControls[index].value
    }

    this.categoryService.updateCategory(id, category).subscribe({
      next: (category: Category) => {
        this.notificationService.notificationSuccess(`Categoría con ID ${category.id} actualizada exitosamente`);
        this.findAll();
      },
      error: (error) => {
        this.cancel(index);
        this.notificationService.notificationError(error.error.message ?? error.message)
      }
    });

  }

  cancel(index: number) {
    this.isEditing[index] = false;
    this.formControls[index].reset(this.categories[index].name);
  }

  delete(category: Category) {
    Swal.fire({
      title: "¿Está seguro de eliminar este categoría?",
      text: "¡No puedes revertir la acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteById(category.id || 0).subscribe({
          next: () => {
            this.findAll();
            this.notificationService.notificationSuccess(`Categoría ${category.name} eliminada exitosamente`)
          },
          error: (error) => this.notificationService.notificationError(error.error.message ?? error.message),
        })
      }
    });

  }
}
