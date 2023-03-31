import { Component } from '@angular/core';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  constructor(private loaderService: LoaderService) {}

  loaderAction$ = this.loaderService.loaderAction$;
}
