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
import { addMonths, addYears } from 'date-fns';
import { ScrollService } from 'src/app/services/scroll.service';
import { SubscritionService } from 'src/app/services/subscrition.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  subscriptionForm!: FormGroup;
  plan_id!: string;
  plan!: any;
  public error: any = [];

  constructor(
    private scrollService: ScrollService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private subscriptionService: SubscritionService
  ) {
    this.route.params.subscribe((params) => {
      this.plan_id = params['id'];
    });
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
      console.log(this.subscriptionForm.value);
      // Envoyer les données au serveur
      this.subscriptionService
        .subscription(this.subscriptionForm.value)
        .subscribe(
          (data) => {
            console.log(data);
            if (data) {
              window.location.href = 'https://app.tracksales.io/sign-in';
            }
          },
          (error) => {
            this.handleError(error);
          }
        );
    } else {
      console.log('Formulaire invalide');
    }
  }

  getPlan() {
    this.subscriptionService.getAllPlans().subscribe((data) => {
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

  handleError(error: any) {
    this.error = error.error.errors;
  }
}
