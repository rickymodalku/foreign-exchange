import { Injectable } from "@angular/core";
import { UUID } from 'angular2-uuid';
import { LocalStorageService } from 'ngx-webstorage';
import {
    Notification,
    NotificationEventEmitter
} from '../models/notification.class';
import CONFIGURATION from '../../configurations/configuration';

@Injectable()
export class NotificationService {
    errorMessage: string;
    notificationEventEmitter: NotificationEventEmitter;

    constructor(private _localStorageService: LocalStorageService) {
        this.errorMessage = this._localStorageService.retrieve('error-message');
        this.notificationEventEmitter = new NotificationEventEmitter();
    }

    success(message: string, milliseconds: number = CONFIGURATION.notification_delay) {
        return this.notificationEventEmitter.emit(<Notification>({
            delay: milliseconds,
            message: message,
            type: "SUCCESS",
            uuid: UUID.UUID()
        }));
    }

    info(message: string, milliseconds: number = CONFIGURATION.notification_delay) {
        return this.notificationEventEmitter.emit(<Notification>({
            delay: milliseconds,
            message: message,
            type: "INFO",
            uuid: UUID.UUID()
        }));
    }

    error(message: string = this.errorMessage, milliseconds: number = CONFIGURATION.notification_delay) {
        return this.notificationEventEmitter.emit(<Notification>({
            delay: milliseconds,
            message: message.length > 0 ? message : this.errorMessage,
            type: "ERROR",
            uuid: UUID.UUID()
        }));
    }
}