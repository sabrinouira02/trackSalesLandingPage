import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>(
    this.getInitialLanguage()
  );
  private languageChangeSubject = new Subject<void>();

  currentLanguage$ = this.currentLanguageSubject.asObservable();
  languageChange$ = this.languageChangeSubject.asObservable();

  constructor() {
    const language = this.getCurrentLanguage();
    this.currentLanguageSubject.next(language);
  }

  setCurrentLanguage(language: string) {
    sessionStorage.setItem('currentLanguage', language);
    this.currentLanguageSubject.next(language);
    this.languageChangeSubject.next(); // Diffusez le changement de langue
  }

  getCurrentLanguage(): string {
    return (
      sessionStorage.getItem('currentLanguage') || this.getInitialLanguage()
    );
  }

  private getInitialLanguage(): string {
    const languages = ['de', 'en', 'fr'];
    let langCode = navigator.language.substr(0, 2);

    if (!languages.includes(langCode)) {
      langCode = 'en'; // Défaut à 'en' si langCode n'est pas trouvé dans languages
    }

    return langCode;
  }
}
