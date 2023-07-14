import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notification.subscribe((notification) => {
      this.notifications.push(notification);
      console.log(this.notifications);

      setTimeout(() => {
        this.closeNotification(notification);
      }, 3000); // Close the notification after 10 seconds
    });
  }

  closeNotification(notification: any) {
    this.notifications = this.notifications.filter((n) => n !== notification);
  }
}
