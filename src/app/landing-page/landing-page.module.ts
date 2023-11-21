import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PricingComponent } from './pricing/pricing.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    LandingPageComponent,
    HomePageComponent,
    PricingComponent,
    AboutUsComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
  ]
})
export class LandingPageModule { }
