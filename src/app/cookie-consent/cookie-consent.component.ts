import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit{

  userConsent: boolean = false;

  ngOnInit() {
    this.checkConsent();
  }

  checkConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'true') {
      this.userConsent = true;
    }
  }

  acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    this.userConsent = true;
  }

  rejectCookies() {
    localStorage.setItem('cookieConsent', 'false');
    this.userConsent = true;
  }
}
