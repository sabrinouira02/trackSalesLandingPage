import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  NgcCookieConsentConfig,
  NgcCookieConsentModule,
} from 'ngx-cookieconsent';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// Fonction de chargement des fichiers de traduction
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'https://tracksales.io', // il est recommandé de définir votre domaine, pour que les cookies fonctionnent correctement
  },
  palette: {
    popup: {
      background: '#000',
    },
    button: {
      background: '#eecc6f',
    },
  },
  theme: 'edgeless',
  type: 'opt-out',
  layout: 'my-custom-layout',
  layouts: {
    'my-custom-layout': '{{messagelink}}{{compliance}}',
  },
  elements: {
    messagelink: `
    <span id="cookieconsent:desc" class="cc-message" style="margin: 1em">{{message}}
      <a aria-label="en savoir plus sur notre politique de confidentialité" tabindex="1" class="cc-link" href="{{privacyPolicyHref}}" target="_blank" rel="noopener">{{privacyPolicyLink}}</a> et notre
      <a aria-label="en savoir plus sur nos conditions de service" tabindex="2" class="cc-link" href="{{tosHref}}" target="_blank" rel="noopener">{{tosLink}}</a>
    </span>
    `,
  },
  content: {
    message:
      'En utilisant notre site, vous reconnaissez avoir lu et compris notre ',

    privacyPolicyLink: 'Politique de confidentialité',
    privacyPolicyHref: 'https://tracksales.io/privacy',

    tosLink: "Conditions d'utilisation",
    tosHref: 'https://tracksales.io/terms',
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
    GoogleTagManagerModule.forRoot({
      id: 'GTM-WRC4VZRP',
    }),
    NgbModalModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
