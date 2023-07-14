import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new Subject<any>();
  notification = this.notificationSubject.asObservable();

  showNotification(title: string, message: string, type: string) {
    this.notificationSubject.next({ title, message, type });
  }
}
