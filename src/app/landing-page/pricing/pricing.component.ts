import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { SubscritionService } from 'src/app/services/subscrition.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  plans!: any[];
  user: any;
  private languageSubscription!: Subscription;
  referralLink: string | null = null;
  constructor(
    private scrollService: ScrollService,
    private subscriptionService: SubscritionService,
    private languageService: LanguageService,
    private loaderService: LoaderService,
    private route: ActivatedRoute
  ) {
    this.scrollService.scrollToTop();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.referralLink = params['parrainage'];
      if (this.referralLink) {
        sessionStorage.setItem('referralLink', this.referralLink);
        this.getUser();
      } else {
        this.referralLink = sessionStorage.getItem('referralLink');
        if (this.referralLink) {
          this.getUser();
        }
      }
    });
    const language = this.languageService.getCurrentLanguage();
    this.getPlans(language); // Appel initial pour obtenir les plans

    this.languageSubscription = this.languageService.currentLanguage$.subscribe(
      (lang) => {
        // Mettez à jour les plans à chaque changement de langue
        this.getPlans(lang);
      }
    );
  }

  getUser(): void {
    this.subscriptionService.getUserByReferralLink(this.referralLink).subscribe(
      (data) => {
        this.user = data;
        console.log(this.user);
      },
      (error) => {
        console.error('Error fetching user', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  getPlans(language: any) {
    this.loaderService.show();
    this.subscriptionService.getAllPlans(language).subscribe((data) => {
      this.loaderService.hide();
      this.plans = data.map((plan: any) => ({
        ...plan,
        key: plan.order_index,
      }));
    });
  }
}
