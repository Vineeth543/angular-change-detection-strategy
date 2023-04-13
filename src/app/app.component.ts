import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoaderService } from './services/loader.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {}

  successMessage$ = this.notificationService.successMessageAction$;

  errorMessage$ = this.notificationService.errorMessageAction$;

  loaderAction$ = this.loaderService.loaderAction$;
}
