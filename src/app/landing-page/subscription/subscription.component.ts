import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  referralLink!: any;
  plan!: any;
  public error: any = [];
  user: any;
  parrainage = 0;
  constructor(
    private scrollService: ScrollService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private subscriptionService: SubscritionService
  ) {
    this.route.params.subscribe((params) => {
      this.plan_id = params['id'];
    });
    this.route.queryParamMap.subscribe((params) => {
      this.referralLink = params.get('referralLink');
    });
    if (this.referralLink) {
      this.getUser();
      this.parrainage = 0.2;
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
      },
      { validators: this.PasswordMatchValidator('password', 'confirmPassword') }
    );
    // Observer les changements sur le champ duree
    this.subscriptionForm
      .get('duree')
      ?.valueChanges.subscribe((duree: string) => {
        this.updateDateFin(duree);
      });
  }

  onSubmit() {
    this.loaderService.show();
    this.subscriptionForm.value.parent_id = this.user?.id;

    if (this.subscriptionForm.valid) {
      this.subscriptionService
        .subscription(this.subscriptionForm.value)
        .subscribe(
          (data) => {
            if (data && data.statusCode === 200) {
              sessionStorage.removeItem('referralLink');
              this.loaderService.hide();
              this.showSuccessMessage();
            } else {
              console.error('Unexpected response:', data);
            }
          },
          (error) => {
            console.error('Error occurred:', error);
            this.loaderService.hide();
            this.handleError(error);
          }
        );
    } else {
      console.log('Formulaire invalide');
    }
  }

  getPlan() {
    const languageCode = 'fr';
    this.subscriptionService.getAllPlans(languageCode).subscribe((data) => {
      this.plan = data.filter((el: any) => {
        return el.id == this.plan_id;
      });
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
      prixTotal = prixTotal - prixTotal * this.parrainage;
    }

    prixTotal = parseFloat(prixTotal.toFixed(2));

    this.subscriptionForm.patchValue({
      date_fin: dateFin ? dateFin.toISOString().split('T')[0] : '',
      prix_total: prixTotal,
    });
  }

  PasswordMatchValidator(
    controlName: string,
    matchingControlName: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (
        matchingControl.errors &&
        !matchingControl.errors['passwordMismatch']
      ) {
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

  emailError: string = '';
  handleError(error: any) {
    this.error = error.error.error;
    if (error.error.message) {
      this.emailError =
        'Invalid recipient address syntax. Please check the email address and try again.';
    }
    this.emailError = this.error.email;
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
