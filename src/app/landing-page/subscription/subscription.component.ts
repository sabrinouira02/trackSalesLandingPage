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
import { addMonths, addYears } from 'date-fns';
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

  constructor(
    private scrollService: ScrollService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
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
        parent_id: [this.user?.id],
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
    if (this.subscriptionForm.valid) {
      this.subscriptionService
        .subscription(this.subscriptionForm.value)
        .subscribe(
          (data) => {
            if (data && data.statusCode === 200) {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Your subscription has been saved',
                showConfirmButton: false,
                timer: 2500,
                willClose: () => {
                  window.location.href = 'https://app.tracksales.io/sign-in';
                },
              });
            } else {
              console.error('Unexpected response:', data);
            }
          },
          (error) => {
            console.error('Error occurred:', error);
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
    let prixTotal: number = 0;
    let prixTotalSansRemise: number = 0;
    let remise: number = 0;

    switch (duree) {
      case 'mois':
        dateFin = addMonths(today, 1);
        prixTotal = this.plan[0].prix;
        break;
      case 'trimestre':
        dateFin = addMonths(today, 3);
        prixTotalSansRemise = this.plan[0].prix * 3;
        remise = (prixTotalSansRemise * 10) / 100;
        prixTotal = this.plan[0].prix * 3 - remise;
        break;
      case 'an':
        dateFin = addYears(today, 1);
        prixTotalSansRemise = this.plan[0].prix * 12;
        remise = (prixTotalSansRemise * 10) / 100;
        prixTotal = this.plan[0].prix * 12 - remise;
        break;
      default:
        dateFin = null;
        prixTotal = 0;
        break;
    }

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
}
