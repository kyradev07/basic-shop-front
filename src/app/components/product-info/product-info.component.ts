import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from "@angular/common";
import { Product } from '../../models/product.interface';
import { DetailsModalComponent } from '../details-modal/details-modal.component';
import { ProductService } from '../../services/product/product.service';
import { NotificationService } from '../../services/util/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-info',
  imports: [
    CurrencyPipe,
    TitleCasePipe,
    DetailsModalComponent
  ],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.css'
})
export class ProductInfoComponent {
  @Input() product!: Product;
  @ViewChild('myModal') modal!: DetailsModalComponent;
  @Output() deletedUser = new EventEmitter();

  constructor(
    private readonly productsService: ProductService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
  ) {
  }

  showModal() {
    this.modal.detailModal.nativeElement.showModal();
  }

  delete(id: number) {
    this.notificationService.notificationDelete("este producto").then((result) => {
      if (result.isConfirmed) {
        this.productsService.deleteById(id).subscribe({
          next: (product) => {
            this.deletedUser.emit(true);
            this.notificationService.notificationSuccess(`Producto ${product.name} eliminado exitosamente`)
          },
          error: (error) => {
            this.notificationService.notificationError(error.error.message ?? error.message);
            this.deletedUser.emit(false);
          },
        })
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/products/edit', id]);
  }
}
