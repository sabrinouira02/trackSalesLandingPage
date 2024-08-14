import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
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

  blocks = [
    {
        img: 'assets/images/shoppin_icon.png',
        title: 'pricing.block1_header',
        desc: 'pricing.block1_desc',
        price: '$1000',
        and_up: 'pricing.and_up',
        link: 'https://app.tracksales.io/sign-up',
        buttonText: 'pricing.sign_up_to_access'
    },
    {
        img: 'assets/images/Google__G__Log.png',
        title: 'pricing.block2_header',
        desc: 'pricing.block2_desc',
        price: '$1000',
        and_up: 'pricing.and_up',
        link: 'https://app.tracksales.io/sign-up',
        buttonText: 'pricing.sign_up_to_access'
    },
    {
      img: 'assets/images/shoppin_icon.png',
      title: 'pricing.block3_header',
      desc: 'pricing.block3_desc',
      price: '$500',
      and_up: 'pricing.and_up',
      link: 'https://app.tracksales.io/sign-up',
      buttonText: 'pricing.sign_up_to_access'
    },
    {
      img: 'assets/images/shoppin_icon.png',
      title: 'pricing.block4_header',
      desc: 'pricing.block4_desc',
      price: '',
      and_up: '',
      link: 'https://app.tracksales.io/sign-up',
      buttonText: 'pricing.sign_up_to_access'
    },
];

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

    // Debounce language change events to prevent unnecessary API calls when the language is changed rapidly.
    this.languageSubscription = this.languageService.currentLanguage$
      .pipe(debounceTime(300)) // Adjust debounce time as necessary
      .subscribe((lang) => {
        this.getPlans(lang);
      });
  }

  getUser(): void {
    this.subscriptionService.getUserByReferralLink(this.referralLink).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching user', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  getPlans(language: string): void {
    this.loaderService.show();
    this.subscriptionService.getAllPlans(language).subscribe(
      (data) => {
        this.loaderService.hide();
        this.plans = data.map((plan: any) => ({
          ...plan,
          key: plan.order_index,
        }));
      },
      (error) => {
        this.loaderService.hide();
        console.error('Error fetching plans', error);
      }
    );
  }
}
