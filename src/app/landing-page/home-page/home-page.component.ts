import { Location } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { LottieService } from 'src/app/services/lottie.service';
import { fadeAndScale, fadeInOut, slideInOut } from 'src/app/shared/animations';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [fadeAndScale, slideInOut, fadeInOut],
})
export class HomePageComponent implements AfterViewInit{
  animationState = 'in';
  constructor(private animationStateService: LottieService,private location: Location) {}
  
  ngAfterViewInit() {
    // Specify the container ID, animation path, and autoplay delay
    this.animationStateService.loadAnimation('lottie-container', '../../../assets/Animation2.json', 2000);
  }
}
