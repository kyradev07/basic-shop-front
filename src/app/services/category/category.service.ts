import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly url = 'http://localhost:3000/category';

  constructor(private readonly http: HttpClient) { }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.url, category);
  }

  findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.patch<Category>(`${this.url}/${id}`, category);
  }
}
