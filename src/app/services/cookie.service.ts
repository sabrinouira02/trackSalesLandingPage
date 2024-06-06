import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgcCookieConsentConfig } from 'ngx-cookieconsent';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor(private translate: TranslateService) {}

  getCookieConfig(): NgcCookieConsentConfig {
    return {
      cookie: {
        domain: 'https://tracksales.io/',
      },
      position: 'bottom',
      theme: 'classic',
      palette: {
        popup: {
          background: '#eecc6f',
          text: '#000',
          link: '#ffffff',
        },
        button: {
          background: '#0b0c0c',
          text: '#ffffff',
          border: 'transparent',
        },
      },
      type: 'opt-in',
      content: {
        message: this.translate.instant('message'),
        dismiss: 'Accept',
        deny: 'Decline',
        link: 'Privacy Policy.',
        href: '/privacy',
        policy: 'Cookie Policy',
        cookieconsent_dismissed: 'yes',
        close: '&#x274c;',
      },
    };
  }
}
