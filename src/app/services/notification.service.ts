import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private successMessageSubject = new Subject<string>();
  successMessageAction$ = this.successMessageSubject.asObservable();

  private errorMessageSubject = new Subject<string>();
  errorMessageAction$ = this.errorMessageSubject.asObservable();

  setSuccessMessage(message: string): void {
    this.successMessageSubject.next(message);
    setTimeout(() => this.successMessageSubject.next(''), 3000);
  }

  setErrorsMessage(message: string): void {
    this.errorMessageSubject.next(message);
    setTimeout(() => this.errorMessageSubject.next(''), 3000);
  }
}
