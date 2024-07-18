import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { SubscritionService } from 'src/app/services/subscrition.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  plans!: any[];
  private languageSubscription!: Subscription;

  constructor(
    private scrollService: ScrollService,
    private subscriptionService: SubscritionService,
    private languageService: LanguageService
  ) {
    this.scrollService.scrollToTop();
  }

  ngOnInit(): void {
    const language = this.languageService.getCurrentLanguage();
    this.getPlans(language); // Appel initial pour obtenir les plans

    this.languageSubscription = this.languageService.currentLanguage$.subscribe(
      (lang) => {
        // Mettez à jour les plans à chaque changement de langue
        this.getPlans(lang);
      }
    );
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  getPlans(language: any) {
    this.subscriptionService.getAllPlans(language).subscribe((data) => {
      this.plans = data.map((plan: any) => ({
        ...plan,
        key: plan.order_index,
      }));
    });
  }
}
