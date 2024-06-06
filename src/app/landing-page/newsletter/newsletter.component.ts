import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss'],
})
export class NewsletterComponent implements OnInit {
  isVisible = false;
  newsletterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.newsletterForm = this.fb.group({
      from_name: ['', [Validators.required]],
      to_name: ['Admin', [Validators.required]],
      from_email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.show();
  }

  async onSubmit() {
    if (this.newsletterForm.valid) {
      const form = this.newsletterForm.value;
      emailjs.init('Fe4tQqSyD-Kn9fSlK');
      let response = await emailjs.send('service_pz5lw4o', 'template_v56oo0e', {
        from_name: form.from_name,
        to_name: form.to_name,
        from_email: form.from_email,
        subject: form.subject,
        message: form.message,
      });
      // Handle form submission
      this.close();
      alert('Message has been sent.');
      this.newsletterForm.reset();
    }
  }

  show(): void {
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
  }
}
