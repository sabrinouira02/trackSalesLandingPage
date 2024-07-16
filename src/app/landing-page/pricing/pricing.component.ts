import { Component, OnInit } from '@angular/core';
import { ScrollService } from 'src/app/services/scroll.service';
import { SubscritionService } from 'src/app/services/subscrition.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  plans!: any[];
  constructor(
    private scrollService: ScrollService,
    private subscriptionService: SubscritionService
  ) {
    this.scrollService.scrollToTop();
  }

  ngOnInit(): void {
    this.getPlans();
  }

  getPlans() {
    this.subscriptionService.getAllPlans().subscribe((data) => {
      this.plans = data.map((plan: any) => ({
        ...plan,
        key: plan.order_index, // Assure-toi que `key` correspond à la clé dans les fichiers de traduction
      }));
    });
  }
}
