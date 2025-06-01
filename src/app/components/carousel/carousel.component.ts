import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {

  @Input() images!: string[];

  index: number = 0;

  prev(): void {
    this.index--;
    if (this.index === -1) {
      this.index = this.images.length - 1;
    }
  }

  next(): void {
    this.index++;
    if (this.index === this.images.length) {
      this.index = 0;
    }
  }
}
