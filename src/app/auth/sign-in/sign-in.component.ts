import { Component } from '@angular/core';
import { LottieService } from 'src/app/services/lottie.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  animationState = 'in';
  constructor(private animationStateService: LottieService) {}

  ngAfterViewInit() {
    // Specify the container ID, animation path, and autoplay delay
    this.animationStateService.loadAnimation('lottie-container', '../../../assets/Login_Animation.json', 2000);
  }
}
