import {
    Component,
    OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from '../models/notification.class';
import { NotificationService } from '../services/notification.service';

@Component({
    selector: 'notification',
    templateUrl: './notification.html'
})
export class NotificationComponent implements OnInit {
    isInsideDashboard: boolean;
    notifications: Array<Notification>;

    constructor(
        private _notificationService: NotificationService,
        private _router: Router
    ) {
        this.isInsideDashboard = false;
        this.notifications = new Array<Notification>();
    }

    ngOnInit() {
        this._notificationService
            .notificationEventEmitter
            .subscribe((data: Notification) => {
                const existingNotification = this.notifications.find(notification => {
                    return notification.message === data.message && notification.type === data.type;
                });
                if (!existingNotification) {
                    this.isInsideDashboard = this._router.url.indexOf('/admin') >= 0;
                    if (this.notifications.length >= 3) {
                        this.notifications.shift();
                    }
                    this.notifications.push(<Notification>({
                        message: data.message,
                        type: data.type,
                        uuid: data.uuid
                    }));
                    if (data.delay > 0) {
                      setTimeout(() => {
                          this.notifications.shift();
                      }, data.delay);
                    }
                }
            });
    }

    remove(uuid: string): void {
        this.notifications = this.notifications.filter((notification: Notification) => {
            return notification.uuid !== uuid;
        });
    }
}
