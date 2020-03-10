import { Subject } from 'rxjs';

export class Notification {
    delay: number; // Set delay to 0 to make it sticky
    message: string;
    type: string;
    uuid: string;
}

export class NotificationEventEmitter extends Subject<Notification>{
    constructor() {
        super();
    }
    emit(value) { super.next(value); }
}
