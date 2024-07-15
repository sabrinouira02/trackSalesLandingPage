import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  mobileLogo = 'assets/images/logos/4.png';

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.scrolled = window.scrollY > 100; // Changez la valeur 100 selon votre préférence
  }
  constructor(
    private router: Router,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    const languages = ['de', 'en', 'fr'];
    let langCode = navigator.language.substr(0, 2);

    if (!languages.includes(langCode)) {
      langCode = 'en'; // Défaut à 'en' si langCode n'est pas trouvé dans languages
    }

    this.translate.setDefaultLang(langCode);
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
    console.log('Body classes changed:', bodyClasses);

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
}
