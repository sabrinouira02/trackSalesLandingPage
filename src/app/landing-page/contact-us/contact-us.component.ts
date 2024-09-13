import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { SubscritionService } from 'src/app/services/subscrition.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private subscribtionService: SubscritionService,
    private loaderService: LoaderService,
    private scrollService: ScrollService
  ) {
    this.scrollService.scrollToTop();
  }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.loaderService.show();
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      this.subscribtionService.contact(this.contactForm.value).subscribe(
        (response) => {
          console.log('Form submitted successfully', response);
          // Handle success (e.g., show a success message)
          this.contactForm.reset();
          this.loaderService.hide();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your email sended successfully',
            showConfirmButton: false,
            timer: 1500,
          });
        },
        (error) => {
          console.error('Error submitting form', error);
          this.loaderService.hide();
          // Handle error (e.g., show error messages)
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
