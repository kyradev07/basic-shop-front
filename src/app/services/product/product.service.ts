import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly url = environment.apiUrl + 'product';

  constructor(private readonly http: HttpClient) {
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.url, product);
  }

  findAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  deleteById(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.url}/${id}`);
  }

  findById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.url}/${id}`, product);
  }
}
