import { Subject } from 'rxjs';

export class ActivationEventEmitter extends Subject<any>{
    constructor() {
        super();
    }
    emit(value) { super.next(value); }
}

export class DialogEventEmitter extends Subject<string>{
    constructor() {
        super();
    }
    emit(value) { super.next(value); }
}
