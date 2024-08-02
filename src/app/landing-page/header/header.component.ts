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

  desktopLogo = 'assets/images/logos/T_logo.png';
  desktopTrackSalesLogo = 'assets/images/logos/TrackSales_logo.png';
  mobileLogo = 'assets/images/logos/4.webp';

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.scrolled = window.scrollY > 100; // Changez la valeur 100 selon votre préférence
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
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.initMutationObserver();
  }

  ngOnDestroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  initMutationObserver(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.onBodyClassChange();
        }
      });
    });

    this.mutationObserver.observe(this.document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  onBodyClassChange(): void {
    const bodyClasses = this.document.body.classList;
    // Exemple pour détecter une classe spécifique, par exemple 'dark-mode'
    if (bodyClasses.contains('dark-mode')) {
      this.desktopLogo = 'assets/images/logos/T_logo.png';
      this.desktopTrackSalesLogo =
        'assets/images/logos/track-sales-white-title.png';
      this.mobileLogo = 'assets/images/logos/mobile_logo_white.png';
    } else {
      this.desktopLogo = 'assets/images/logos/T_logo.png';
      this.desktopTrackSalesLogo = 'assets/images/logos/TrackSales_logo.png';
      this.mobileLogo = 'assets/images/logos/4.png';
    }
  }
  switchLanguage(language: string) {
    this.translate.use(language);
    this.languageService.setCurrentLanguage(language);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  toggleNavbarCollapsing() {
    if (this.navbarCollapsed) {
      this.navbarCollapsed = false;
    } else {
      this.navbarCollapsed = true;
    }
  }

  navigateToExternalLink(): void {
    window.open('https://pxmr7cwajh0.typeform.com/to/MNUlpNse', '_blank'); // Remplacez par l'URL de votre choix
  }
}
