import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.interface';
import { NotificationService } from '../../services/util/notification.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-categories-list',
  imports: [
    TitleCasePipe
  ],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent implements OnInit {

  categories: Category[] = [];
  isEditing: boolean = false;

  constructor(private readonly categoryService: CategoryService, private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.categoryService.findAll().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => this.notificationService.notificationError(error.error.message ?? error.message),
    });
  }



}
