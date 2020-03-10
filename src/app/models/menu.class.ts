import { Subject } from 'rxjs';

export class MenuEventEmitter extends Subject<any>{
    constructor() {
        super();
    }
    emit(value) { super.next(value); }
}