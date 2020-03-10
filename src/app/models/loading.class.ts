import { Subject } from 'rxjs';

export class LoadingMessage {
    delay: number;
    key: string;
    message: string;
}

export class MessageEventEmitter extends Subject<LoadingMessage>{
    constructor() {
        super();
    }
    emit(value) { super.next(value); }
}

export class RequestEventEmitter extends Subject<string>{
    constructor() {
        super();
    }
    emit(value) { super.next(value); }
}

export class ResponseEventEmitter extends Subject<string>{
    constructor() {
        super();
    }
    emit(value) { super.next(value); }
}
