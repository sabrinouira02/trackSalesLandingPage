import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'track-sales-UI';
  isDarkMode: boolean = false;

  ngOnInit() {
    // Ajouter la classe 'clair-mode' par défaut
    document.body.classList.add('clair-mode');
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('clair-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('clair-mode');
    }
  }
}
