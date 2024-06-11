import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PricingComponent } from './pricing/pricing.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../app.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FaqComponent } from './faq/faq.component';
@NgModule({
  declarations: [
    LandingPageComponent,
    HomePageComponent,
    PricingComponent,
    AboutUsComponent,
    FooterComponent,
    HeaderComponent,
    PrivacyComponent,
    TermsComponent,
    NewsletterComponent,
    FaqComponent,
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
})
export class LandingPageModule {}
