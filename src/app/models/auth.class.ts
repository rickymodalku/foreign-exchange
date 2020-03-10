import { Subject } from 'rxjs';

export class AuthEventEmitter extends Subject<boolean>{
    constructor() {
        super();
    }
    emit(value) { super.next(value); }
}

export class PasswordRestriction {
    label: string;
    regex: RegExp;
    valid: boolean;
}

export class SignUpCredential {
    memberTypeCode: string;
    token: string;
    userName: string;
}
