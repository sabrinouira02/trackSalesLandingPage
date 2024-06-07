import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  NgcCookieConsentModule,
  NgcCookieConsentConfig,
  NgcCookieConsentService,
} from 'ngx-cookieconsent';

// Fonction de chargement des fichiers de traduction
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'https://tracksales.io/', // or 'your.domain.com' // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
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
    message:
      'This website stores cookie on your computer. These cookies are used to collect information about how you interact with our website and allow us to remember you. We use this information in order to improve and customize your browsing experience and for analytics and metrics about our visitors both on this website and other media. To find out more about the cookies we use, see our ',
    dismiss: 'Accept',
    deny: 'Decline',
    link: 'Privacy Policy.',
    href: '/privacy',
    policy: 'Cookie Policy',
    cookieconsent_dismissed: 'yes',
    close: '&#x274c;',
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgcCookieConsentModule.forRoot(cookieConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private translate: TranslateService,
    private ccService: NgcCookieConsentService
  ) {
    this.translate.setDefaultLang('en');

    // Définir les langues disponibles
    this.translate.addLangs(['en', 'fr', 'de']);

    // Utiliser la langue du navigateur s'il est supporté, sinon utiliser 'en'
    const browserLang = this.translate.getBrowserLang();
    const defaultLang =
      browserLang && browserLang.match(/en|fr|de/) ? browserLang : 'en';
    this.translate.use(defaultLang);

    this.updateCookieConsentText();

    // Écouter les événements de changement de langue
    this.translate.onLangChange.subscribe(() => {
      this.updateCookieConsentText();
    });
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  updateCookieConsentText() {
    this.translate.get('COOKIE_CONSENT').subscribe((data) => {
      const currentConfig = this.ccService.getConfig();
      currentConfig.content = {
        message: data.MESSAGE,
        dismiss: data.DISMISS,
        deny: data.DENY,
        link: data.LINK,
        href: data.HREF,
        policy: data.POLICY,
      };
      this.ccService.destroy(); // Détruire le consentement actuel (s'il y en a un)
      this.ccService.init(currentConfig); // Réinitialiser avec la nouvelle configuration
    });
  }
}
