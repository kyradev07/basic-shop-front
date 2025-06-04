import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Product } from '../../models/product.interface';
import { CarouselComponent } from '../carousel/carousel.component';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-details-modal',
  imports: [
    CarouselComponent,
    CurrencyPipe,
    UpperCasePipe
  ],
  templateUrl: './details-modal.component.html',
  styleUrl: './details-modal.component.css'
})
export class DetailsModalComponent {

  @ViewChild('myModal') detailModal!: ElementRef<HTMLDialogElement>
  @Input() product!: Product;

  cancel() {
    this.detailModal.nativeElement.close();
  }

  getCategory(product: Product) {
    return typeof product.category === 'number' ? product.category : product.category.name;
  }

  onKeyDown($event: KeyboardEvent) {
    if ($event.key === 'Escape') {
      $event.preventDefault();
    }
  }
}
