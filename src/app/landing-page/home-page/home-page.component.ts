import { Location } from '@angular/common';
import {
  Component,
  AfterViewInit,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LottieService } from 'src/app/services/lottie.service';
import * as AOS from 'aos';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements AfterViewInit {
  title = '';
  langChangeSubscription!: Subscription;
  currentInterval: any; // Pour stocker l'intervalle en cours
  currentTimeout: any; // Pour stocker le timeout en cours
  @ViewChild('conversionAccuracyElement')
  conversionAccuracyElement!: ElementRef;
  @ViewChild('moneyBackDaysElement') moneyBackDaysElement!: ElementRef;

  conversionAccuracy: number = 0;
  moneyBackDays: number = 0;
  targetConversionAccuracy: number = 99;
  targetMoneyBackDays: number = 30;
  duration: number = 3000; // durée de l'incrémentation en millisecondes
  observer!: IntersectionObserver;

  images = [
    {
      id: '1',
      title: 'vuori-logo',
      src: 'assets/images/logos/Elevar-customer_vuori_160x54-logo.png',
      alt: 'vuori-logo',
    },
    {
      id: '2',
      title: 'rothys-logo',
      src: 'assets/images/logos/Elevar-customer_rothys_160x54-logo.png',
      alt: 'rothys-logo',
    },
    {
      id: '3',
      title: 'vessi-logo',
      src: 'assets/images/logos/Elevar-customer_vessi_160x54-logo.png',
      alt: 'vessi-logo',
    },
    {
      id: '4',
      title: 'thrive-logo',
      src: 'assets/images/logos/Elevar-customer_thrive-causemetics_160x54-logo.png',
      alt: 'thrive-logo',
    },
    {
      id: '5',
      title: 'snow-logo',
      src: 'assets/images/logos/Elevar-customer_snow_160x54-logo.png',
      alt: 'snow-logo',
    },
    {
      id: '6',
      title: 'skims-logo',
      src: 'assets/images/logos/Elevar-customer_skims_160x54-logo.png',
      alt: 'skims-logo',
    },
    {
      id: '7',
      title: 'cuts-logo',
      src: 'assets/images/logos/Elevar-customer_cuts_160x54-logo.png',
      alt: 'cuts-logo',
    },
  ];
  constructor(
    private animationStateService: LottieService,
    private location: Location,
    private renderer: Renderer2,
    private translate: TranslateService
  ) {}

  ngAfterViewInit() {
    AOS.init({
      duration: 1200, // durée de l'animation en ms
      disable: function () {
        var maxWidth = 768;
        return window.innerWidth < maxWidth;
      },
    });
    // Specify the container ID, animation path, and autoplay delay
    this.animationStateService.loadAnimation(
      'lottie-container',
      '../../../assets/Animation2.json',
      2000
    );
    this.setTitle();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.setTitle();
      }
    );
    this.setupObserver();
  }

  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
    this.clearCurrentAnimation(); // Nettoyer les animations en cours
  }

  setTitle() {
    this.translate.get('wpb_wrapper2_title').subscribe((res: string) => {
      this.clearCurrentAnimation(); // Nettoyer les animations en cours
      this.animateTitle(res);
    });
  }

  animateTitle(fullTitle: string) {
    this.title = ''; // Réinitialiser le titre avant de démarrer l'animation
    let i = 0;
    this.currentInterval = setInterval(() => {
      if (i < fullTitle.length) {
        this.title += fullTitle[i];
        i++;
      } else {
        clearInterval(this.currentInterval);
        this.currentTimeout = setTimeout(() => {
          this.setTitle(); // Rappeler setTitle pour obtenir la traduction la plus récente
        }, 10000); // Délai avant de répéter l'animation (par exemple, 10000 ms = 10 secondes)
      }
    }, 100); // Ajuster la vitesse de l'animation en modifiant le temps d'intervalle
  }

  clearCurrentAnimation() {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  setupObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver(
      this.handleIntersect.bind(this),
      options
    );

    if (this.conversionAccuracyElement) {
      this.observer.observe(this.conversionAccuracyElement.nativeElement);
    }
    if (this.moneyBackDaysElement) {
      this.observer.observe(this.moneyBackDaysElement.nativeElement);
    }
  }

  handleIntersect(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (
          entry.target === this.conversionAccuracyElement.nativeElement &&
          this.conversionAccuracy === 0
        ) {
          this.incrementCounter(
            'conversionAccuracy',
            this.targetConversionAccuracy
          );
        } else if (
          entry.target === this.moneyBackDaysElement.nativeElement &&
          this.moneyBackDays === 0
        ) {
          this.incrementCounter('moneyBackDays', this.targetMoneyBackDays);
        }
      }
    });
  }

  incrementCounter(
    property: 'conversionAccuracy' | 'moneyBackDays',
    target: number
  ): void {
    const stepTime = Math.abs(Math.floor(this.duration / target));
    let currentValue = 0;
    const increment = target > 0 ? 1 : -1;

    const timer = setInterval(() => {
      currentValue += increment;
      (this as any)[property] = currentValue; // Utilisation de "as any" pour contourner le problème de typage
      if (currentValue === target) {
        clearInterval(timer);
      }
    }, stepTime);
  }
}
