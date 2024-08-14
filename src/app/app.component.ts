import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { NgcCookieConsentService } from 'ngx-cookieconsent';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isDarkMode: boolean = false;
  private destroy$ = new Subject<void>();
  
  constructor(
    private ccService: NgcCookieConsentService,
    private translateService: TranslateService,
    private gtmService: GoogleTagManagerService,
    private router: Router
  ) {
    this.gtmService.addGtmToDom();
  }

  ngOnInit() {
    const savedDarkMode = sessionStorage.getItem('isDarkMode');
    this.isDarkMode = savedDarkMode ? JSON.parse(savedDarkMode) : false;
    this.applyTheme(this.isDarkMode);

    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => {
        if (item instanceof NavigationEnd) {
          const gtmTag = {
            event: 'page',
            pageName: item.url,
          };

          this.gtmService.pushTag(gtmTag);
        }
      });

    const languages = ['de', 'en', 'fr'];
    let langCode = navigator.language.substr(0, 2);

    if (!languages.includes(langCode)) {
      langCode = 'en';
    }

    this.translateService.setDefaultLang(langCode);

    this.translateService
    .get([
      'cookie.header',
      'cookie.message',
      'cookie.dismiss',
      'cookie.allow',
      'cookie.deny',
      'cookie.link',
      'cookie.policy',
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.setupCookieConsentTranslations(data);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    sessionStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
    this.applyTheme(this.isDarkMode);
  }  

  private applyTheme(isDarkMode: boolean) {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('clair-mode');
    } else {
      document.body.classList.add('clair-mode');
      document.body.classList.remove('dark-mode');
    }
  }

  private setupCookieConsentTranslations(data: any) {
    const config = this.ccService.getConfig();
    config.content = config.content || {};
  
    config.content.header = data['cookie.header'];
    config.content.message = data['cookie.message'];
    config.content.dismiss = data['cookie.dismiss'];
    config.content.allow = data['cookie.allow'];
    config.content.deny = data['cookie.deny'];
    config.content.link = data['cookie.link'];
    config.content.policy = data['cookie.policy'];
  
    this.ccService.destroy();
    this.ccService.init(this.ccService.getConfig());
  }
}
