import { Subject } from 'rxjs';

export class EventEmitter extends Subject<boolean> {
    constructor() {
        super();
    }
    emit(value) { super.next(value); }
}
