import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { addMonths, addYears } from 'date-fns';
import { LoaderService } from 'src/app/services/loader.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { SubscritionService } from 'src/app/services/subscrition.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  subscriptionForm!: FormGroup;
  plan_id!: string;
  referralLink: string | null = null;
  plan!: { id: string, prix: number }[];
  promoCode: any;
  promoCodeMessage: string = '';
  emailError: string = '';
  user: { id: number } | null = null;
  parrainage = 0;

  private readonly EMAIL_ERROR = 'subscription.emailError';
  private readonly EMAIL_UNIQUE_ERROR = 'subscription.emailUniqueError';
  private readonly PROMO_CODE_EXPIRED = 'subscription.promo_code_expired';
  private readonly PROMO_CODE_NOT_FOUND = 'subscription.promo_code_not_found';

  constructor(
    private scrollService: ScrollService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private subscriptionService: SubscritionService,
  ) {
    this.route.params.subscribe((params) => {
      this.plan_id = params['id'];
    });
    this.route.queryParamMap.subscribe((params) => {
      this.referralLink = params.get('referralLink');
    });
    if (this.referralLink) {
      this.getUser();
    }
    this.scrollService.scrollToTop();
    this.getPlan();
  }
  
  ngOnInit(): void {
    this.subscriptionForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        duree: ['', Validators.required],
        plan_id: [this.plan_id],
        parent_id: [''],
        prix_total: [0],
        date_fin: [''],
        promo_code: [''],
      },
      { validators: this.passwordValidator('password', 'confirmPassword') }
    );

    this.subscriptionForm.get('duree')?.valueChanges.subscribe((duree: string) => {
      this.updateDateFin(duree);
    });
  }

  onSubmit() {
    this.loaderService.show();
    this.subscriptionForm.value.parent_id = this.user?.id;

    if (this.subscriptionForm.valid) {
      this.subscriptionService.subscription(this.subscriptionForm.value).subscribe(
        (data) => {
          if (data && data.statusCode === 200) {
            sessionStorage.removeItem('referralLink');
            this.loaderService.hide();
            this.showSuccessMessage();
          } else {
            console.error('Unexpected response:', data);
          }
        },
        (error) => this.handleApiError(error)
      );
    } else {
      console.log('Formulaire invalide');
    }
  }

  verifyPromoCode() {
    this.promoCodeMessage = '';
    this.loaderService.show();
    const code = this.subscriptionForm.get('promo_code')?.value;

    this.subscriptionService.getPromoCode({ code }).subscribe(
      (data) => {
        this.promoCode = data;
        const prixTotal = this.handlePromoCode();
        this.subscriptionForm.patchValue({ prix_total: prixTotal });
        this.loaderService.hide();
      },
      (error) => this.handleApiError(error)
    );
  }

  private handlePromoCode(): number {
    let prixTotal = this.subscriptionForm.value.prix_total;

    if (this.promoCode) {
      const currentDate = new Date();
      const expirationDate = new Date(this.promoCode.date_validite);

      if (expirationDate >= currentDate) {
        prixTotal = this.promoCode.fixe_pourcentage 
          ? prixTotal - this.promoCode.montant 
          : this.calculateDiscountedPrice(prixTotal, this.promoCode.pourcentage);
      } else {
        this.translate.get(this.PROMO_CODE_EXPIRED).subscribe((translation: string) => {
          this.promoCodeMessage = translation;
        });
      }
    }
    return parseFloat(prixTotal.toFixed(2));
  }

  private calculateDiscountedPrice(basePrice: number, discount: number): number {
    return basePrice - (basePrice * discount / 100);
  }

  getPlan() {
    const languageCode = 'fr';
    this.subscriptionService.getAllPlans(languageCode).subscribe((data) => {
      this.plan = data.filter((el: any) => el.id === this.plan_id);
    });
  }

  updateDateFin(duree: string) {
    const today = new Date();
    let dateFin: Date | null = null;
    let prixBase = this.plan[0].prix;
    let prixTotal: number = 0;
    let prixTotalSansRemise: number = 0;
    let remise: number = 0;

    switch (duree) {
      case 'mois':
        dateFin = addMonths(today, 1);
        prixTotal = prixBase;
        break;
      case 'trimestre':
        dateFin = addMonths(today, 3);
        prixTotalSansRemise = prixBase * 3;
        remise = (prixTotalSansRemise * 10) / 100;
        prixTotal = prixTotalSansRemise - remise;
        break;
      case 'an':
        dateFin = addYears(today, 1);
        prixTotalSansRemise = prixBase * 12;
        remise = (prixTotalSansRemise * 10) / 100;
        prixTotal = prixTotalSansRemise - remise;
        break;
      default:
        dateFin = null;
        prixTotal = 0;
        break;
    }

    if (this.referralLink && prixTotal > 0) {
      prixTotal -= prixTotal * this.parrainage;
    }

    if (this.promoCode) {
      prixTotal = this.handlePromoCode();
    }

    this.subscriptionForm.patchValue({
      date_fin: dateFin ? dateFin.toISOString().split('T')[0] : '',
      prix_total: parseFloat(prixTotal.toFixed(2)),
    });
  }

  private passwordValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordMismatch: true });
      } else {
        matchingControl.setErrors(null);
      }

      return null;
    };
  }

  private handleApiError(error: any) {
    console.error('Error occurred:', error);
    this.loaderService.hide();
    this.handleError(error);
  }

  private handleError(error: any) {
    if (error.error && typeof error.error.error === 'string' &&
      error.error.error.includes('Expected response code "250/251/252" but got code "550"')) {
      this.translate.get(this.EMAIL_ERROR).subscribe((translation: string) => {
        this.emailError = translation;
      });
    } else if (error.status === 400 && error.error && error.error.error.email && Array.isArray(error.error.error.email) &&
      error.error.error.email.includes('The email has already been taken.')) {
        this.translate.get(this.EMAIL_UNIQUE_ERROR).subscribe((translation: string) => {
          this.emailError = translation;
        });
    } else if (error.status === 404 && error.error && error.error.error === 'promo_code not found') {
      this.translate.get(this.PROMO_CODE_NOT_FOUND).subscribe((translation: string) => {
        this.promoCodeMessage = translation;
      });
    } else {
      console.error('Unexpected error:', error);
    }
  }

  getUser(): void {
    this.subscriptionService.getUserByReferralLink(this.referralLink).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => console.error('Error fetching user', error)
    );
  }

  showSuccessMessage() {
    this.translate
      .get('subscription.success')
      .subscribe((translatedTitle: string) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: translatedTitle,
          showConfirmButton: false,
          timer: 2500,
          willClose: () => {
            window.location.href = 'https://app.tracksales.io/sign-in';
          },
        });
      });
  }
}
