import { Component } from '@angular/core';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-gdbr',
  templateUrl: './gdbr.component.html',
  styleUrls: ['./gdbr.component.scss']
})
export class GdbrComponent {
  constructor(private scrollService: ScrollService) {
    this.scrollService.scrollToTop();
  }
}
