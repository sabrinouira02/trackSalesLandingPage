import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  navbarCollapsed = true;
  scrolled: boolean = false;
  private mutationObserver!: MutationObserver;

  logos = {
    desktop: 'assets/images/logos/T_logo.png',
    desktopTrackSales: 'assets/images/logos/TrackSales_logo.png',
    mobile: 'assets/images/logos/4.webp',
  };

  darkModeLogos = {
    desktop: 'assets/images/logos/T_logo.png',
    desktopTrackSales: 'assets/images/logos/track-sales-white-title.png',
    mobile: 'assets/images/logos/mobile_logo_white.png',
  };

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.scrolled = window.scrollY > 80;
  }
  constructor(
    private router: Router,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private languageService: LanguageService,
    private renderer: Renderer2
  ) {
    this.languageService.currentLanguage$.subscribe((language) => {
      this.translate.setDefaultLang(language);
    });
  }

  ngAfterViewInit(): void {
    this.initMutationObserver();
  }

  ngOnDestroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  initMutationObserver(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations
        .filter((mutation) => mutation.attributeName === 'class')
        .forEach(() => this.onBodyClassChange());
    });

    this.mutationObserver.observe(this.document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  onBodyClassChange(): void {
    const bodyClasses = this.document.body.classList;
    if (bodyClasses.contains('dark-mode')) {
      this.setLogos(this.darkModeLogos);
    } else {
      this.setLogos(this.logos);
    }
  }

  setLogos(logos: { desktop: string; desktopTrackSales: string; mobile: string }): void {
    this.logos.desktop = logos.desktop;
    this.logos.desktopTrackSales = logos.desktopTrackSales;
    this.logos.mobile = logos.mobile;
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.languageService.setCurrentLanguage(language);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  toggleNavbarCollapsing() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  navigateToExternalLink(): void {
    window.open('https://pxmr7cwajh0.typeform.com/to/MNUlpNse', '_blank'); // Remplacez par l'URL de votre choix
  }


  getCountryFlag(language: string): string {
    const flags: { [key: string]: string } = {
      en: 'the_United_Kingdom',
      fr: 'France',
      de: 'Germany',
    };
    return flags[language] || 'default';
  }

}
