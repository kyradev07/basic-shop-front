import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { NotificationService } from '../../services/util/notification.service';
import { Product } from '../../models/product.interface';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-products-list',
  imports: [
    CurrencyPipe,
    TitleCasePipe
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {

  products: Product[] = [];

  constructor(
    private readonly productsService: ProductService,
    private readonly notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.findAll();
  }

  private findAll(): void {
    this.productsService.findAll().subscribe({
      next: (products) => {
        this.products = [...products];
      },
      error: (error) => this.notificationService.notificationError(error.error.message ?? error.message),
    })
  }


  delete(id: number) {
    this.notificationService.notificationDelete("este producto")
    .then((result) => {
      if (result.isConfirmed) {
        this.productsService.deleteById(id).subscribe({
          next: (product) => {
            this.findAll();
            this.notificationService.notificationSuccess(`Producto ${product.name} eliminado exitosamente`)
          },
          error: (error) => this.notificationService.notificationError(error.error.message ?? error.message),
        })
      }
    });
  }
}
