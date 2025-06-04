import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterOutlet } from "@angular/router";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [
    FooterComponent,
    NavbarComponent,
    RouterOutlet,
    NgClass
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

  isOpenedMenu: boolean = false;

  openMenu(): void {
    this.isOpenedMenu = true;
  }

  closeMenu(): void {
    this.isOpenedMenu = false;
  }

}
