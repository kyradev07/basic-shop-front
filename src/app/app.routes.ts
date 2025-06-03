import { Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { CategoriesListComponent } from './components/categories-list/categories-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UsersListComponent } from './components/users-list/users-list.component';

export const routes: Routes = [
  {
    path: 'products',
    component: ProductsListComponent
  },
  {
    path: 'products/add',
    component: ProductFormComponent
  },
  {
    path: 'products/edit/:id',
    component: ProductFormComponent
  },
  {
    path: 'categories',
    component: CategoriesListComponent
  },
  {
    path: 'categories/add',
    component: CategoryFormComponent
  },
  {
    path: 'users',
    component: UsersListComponent
  },
  {
    path: 'users/add',
    component: UserFormComponent
  },
  {
    path: '**',
    redirectTo: 'products',
    pathMatch: 'full',
  },
];
