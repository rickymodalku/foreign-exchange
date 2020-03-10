import { Injectable } from "@angular/core";
import {
    ActivationEventEmitter,
    DialogEventEmitter
} from '../models/dialog.class';

@Injectable()
export class DialogService {
    activationDialogEventEmitter: ActivationEventEmitter;
    logInDialogEventEmitter: DialogEventEmitter;
    signUpDialogEventEmitter: DialogEventEmitter;
    forgotPasswordEventEmitter: DialogEventEmitter;
    twoFalogInDialogEventEmitter: DialogEventEmitter;
    closeAllDialogEventEmitter: DialogEventEmitter;

    constructor() {
        this.activationDialogEventEmitter = new ActivationEventEmitter();
        this.logInDialogEventEmitter = new DialogEventEmitter();
        this.signUpDialogEventEmitter = new DialogEventEmitter();
        this.forgotPasswordEventEmitter = new DialogEventEmitter();
        this.twoFalogInDialogEventEmitter = new DialogEventEmitter();
        this.closeAllDialogEventEmitter = new DialogEventEmitter();
    }

    displayActivationDialog(params: any) {
        return this.activationDialogEventEmitter.emit(params);
    }

    displayLogInDialog() {
        return this.logInDialogEventEmitter.emit('true');
    }

    displayTwoFaLogInDialog(data) {
      return this.twoFalogInDialogEventEmitter.emit(data);
    }

    displaySignUpDialog(code: string = 'DEFAULT') {
        return this.signUpDialogEventEmitter.emit(code);
    }

    displayForgotPasswordDialog() {
        return this.forgotPasswordEventEmitter.emit('true');
    }

    closeAllModal() {
        return this.closeAllDialogEventEmitter.emit('true');
    }

}
