import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('toggleNav', [
      state('navClosed', style({
        height: '0',
      })),
      state('navOpen', style({
        height: '*',
      })),
      transition('navOpen => navClosed', [
        animate('0.2s')
      ]),
      transition('navClosed => navOpen', [
        animate('0.2s')
      ]),
    ]),
  ]
})

export class HeaderComponent {
  isNavMenuOpen = false;
  isHeaderSolid = false;

  constructor (
    public router: Router, 
    public el: ElementRef
  ) { }

  // Check the scroll position to allow the header to adjust it's appearance when necessary
  @HostListener('window:scroll', ['$event'])
    checkScroll() {
    const componentPosition = this.el.nativeElement.offsetTop
    const scrollPosition = window.pageYOffset

    if (scrollPosition >= componentPosition + 20) {
      this.isHeaderSolid = true;
    } else {
      this.isHeaderSolid = false;
    }
  }

  toggleNav() {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }

  closeNav() {
    this.isNavMenuOpen = false;
  }
}