import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { NgcCookieConsentService } from 'ngx-cookieconsent';

import { Subscription } from 'rxjs';

declare var gtag: (arg0: string, arg1: string, arg2: any) => void;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'track-sales-UI';
  isDarkMode: boolean = false;
  // Gardez des références aux abonnements pour pouvoir vous désabonner plus tard
  private popupOpenSubscription!: Subscription;
  private popupCloseSubscription!: Subscription;
  private initializingSubscription!: Subscription;
  private initializedSubscription!: Subscription;
  private initializationErrorSubscription!: Subscription;
  private statusChangeSubscription!: Subscription;
  private revokeChoiceSubscription!: Subscription;
  private noCookieLawSubscription!: Subscription;

  constructor(
    private ccService: NgcCookieConsentService,
    private translateService: TranslateService,
    private gtmService: GoogleTagManagerService,
    private router: Router
  ) {
    this.gtmService.addGtmToDom();
    document.body.classList.add('clair-mode');
  }

  ngOnInit() {
    this.router.events.forEach((item) => {
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
      .subscribe((data) => {
        const config = this.ccService.getConfig();
        config.content = config.content || {};

        // Remplacez les messages par défaut par les messages traduits
        config.content.header = data['cookie.header'];
        config.content.message = data['cookie.message'];
        config.content.dismiss = data['cookie.dismiss'];
        config.content.allow = data['cookie.allow'];
        config.content.deny = data['cookie.deny'];
        config.content.link = data['cookie.link'];
        config.content.policy = data['cookie.policy'];

        this.ccService.destroy(); // supprimez la barre de cookies précédente (avec des messages par défaut)
        this.ccService.init(this.ccService.getConfig()); // mettez à jour la configuration avec les messages traduits
      });
  }

  ngOnDestroy() {
    // désabonnez-vous des observables cookieconsent pour éviter les fuites de mémoire
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializingSubscription.unsubscribe();
    this.initializedSubscription.unsubscribe();
    this.initializationErrorSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();
  }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('clair-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('clair-mode');
    }
  }
}
