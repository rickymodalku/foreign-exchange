import { AuthService } from './auth.service';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  Response,
  ResponseContentType,
  RequestOptions,
  RequestOptionsArgs
} from '@angular/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ENVIRONMENT } from '../../environments/environment';
import CONFIGURATION from '../../configurations/configuration';

@Injectable()
export class TwoFaService {
  constructor(
    private _authService: AuthService,
    private _baseService: BaseService,
    private _http: Http,
    private _router: Router
  ) {
  }

  formatPhoneNumberForSGTwoFa(phoneNumber: string): string {
    const phoneNumberOnly = /^[0-9]+$/;
    const phoneNumberWithPrefixOnly = /^\+[0-9]+$/;
    if (phoneNumberOnly.test(phoneNumber)) {
      if (phoneNumber.length === 8) {
        return phoneNumber = `+65${phoneNumber}`;
      } else {
        return phoneNumber = `+${phoneNumber}`;
      }
    } else if (phoneNumberWithPrefixOnly) {
      return phoneNumber;
    }
    return null;
  }

  onKeydownOtp(event: KeyboardEvent) {
    const elementTarget = <HTMLInputElement> event.target;
    const number = parseInt(event.key, 10);
    if (number) {
      elementTarget.value = null;
    }
  }

  onDeleteOtpCode(event) {
    const elementTarget = <HTMLInputElement> event.target;
    const previousDigit = Number(elementTarget.dataset.digitnumber) - 1;
    const previousDigitId = `${CONFIGURATION.otpSetting.otpDigitPrefix}${previousDigit}`;
    this.focusElementByID(previousDigitId);
  }

  focusElementByID(elementId: string) {
    const element: HTMLElement = document.getElementById(elementId) as HTMLElement;
    if (element) {
      element.focus();
    }
  }

  getUserOtpCode(otpFormControls: Object): string {
    let otpString = '';
    for ( let otpIndex = 0; otpIndex < CONFIGURATION.otpSetting.numberOfOtpDigits; otpIndex++ ) {
      const otpControl = otpFormControls[`${CONFIGURATION.otpSetting.otpDigitPrefix}${otpIndex + 1 }`];
      let value = otpControl ? '' + otpControl.value : '';
      if (value) {
        otpString += value;
      }
    }
    return otpString;
  }
}

