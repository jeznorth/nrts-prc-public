import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PageScrollConfig } from 'ng2-page-scroll';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { ApiService } from './services/api';
import { ConfigService } from './services/config.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit, OnDestroy {
  isSafari: boolean;
  isScrollBtnVisible = false; // Hide the scroll to top button by default
  loggedIn: string;
  hostname: string;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    public el: ElementRef,
    public router: Router,
    private cookieService: CookieService,
    private api: ApiService,
    private configService: ConfigService
  ) {
    // ref: https://stackoverflow.com/questions/5899783/detect-safari-using-jquery
    //this.isSafari = (/^((?!chrome|android).)*safari/i.test(navigator.userAgent));

    // used for sharing links
    this.hostname = api.apiPath; // TODO: Wrong

    PageScrollConfig.defaultScrollOffset = 50;
    PageScrollConfig.defaultEasingLogic = {
      ease: (t: number, b: number, c: number, d: number): number => {
        // easeInOutExpo easing
        if (t === 0) {
          return b;
        }
        if (t === d) {
          return b + c;
        }
        if ((t /= d / 2) < 1) {
          return c / 2 * Math.pow(2, 8 * (t - 1)) + b;
        }
        return c / 2 * (-Math.pow(2, -8 * --t) + 2) + b;
      }
    };

    this.configService.init();
  }

  // Check the scroll position to see if the scroll-to-top button should be visible or not
  @HostListener('window:scroll', ['$event'])
    checkScroll() {
      const componentPosition = this.el.nativeElement.offsetTop
      const scrollPosition = window.pageYOffset

      if (scrollPosition >= componentPosition + 20) {
        this.isScrollBtnVisible = true;
      } else {
        this.isScrollBtnVisible = false;
      }
  }

  ngOnInit() {
    this.loggedIn = this.cookieService.get('loggedIn');

    this.router.events
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      });
  }

  ngOnDestroy() {
    this.configService.destroy();

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
