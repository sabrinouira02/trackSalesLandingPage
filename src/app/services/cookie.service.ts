import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgcCookieConsentConfig } from 'ngx-cookieconsent';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  private cookieConfig: NgcCookieConsentConfig = {
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
      message: '',
      dismiss: '',
      deny: '',
      link: '',
      href: '/privacy',
      policy: 'Cookie Policy',
      cookieconsent_dismissed: 'yes',
      close: '&#x274c;',
    },
  };

  constructor(private translate: TranslateService) {}

  async loadConfig(): Promise<NgcCookieConsentConfig> {
    this.cookieConfig.content!.message = await this.translate
      .get('COOKIE.MESSAGE')
      .toPromise();
    this.cookieConfig.content!.dismiss = await this.translate
      .get('COOKIE.DISMISS')
      .toPromise();
    this.cookieConfig.content!.deny = await this.translate
      .get('COOKIE.DENY')
      .toPromise();
    this.cookieConfig.content!.link = await this.translate
      .get('COOKIE.LINK')
      .toPromise();
    this.cookieConfig.content!.policy = await this.translate
      .get('COOKIE.POLICY')
      .toPromise();
    return this.cookieConfig;
  }
}
