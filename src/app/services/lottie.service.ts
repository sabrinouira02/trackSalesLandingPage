import { Injectable } from '@angular/core';
import * as lottie from 'lottie-web';

@Injectable({
  providedIn: 'root'
})
export class LottieService {

  loadAnimation(containerElementId: string, animationPath: string, autoplayDelay: number = 0): void {
    const containerElement = document.getElementById(containerElementId);
    const animation = lottie.default;

    if (containerElement) {
      animation.loadAnimation({
        container: containerElement,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: animationPath,
      });

      // Trigger the animation after some time (e.g., 2 seconds)
      setTimeout(() => {
        // You can emit an event or perform any additional logic here
      }, autoplayDelay);
    } else {
      console.error('Container element not found!');
    }
  }
}
