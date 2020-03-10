import {
  FormGroup,
  FormControl
} from '@angular/forms';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../services/notification.service';
import CONFIGURATION from '../../configurations/configuration';

@Injectable()
export class FormService {
  constructor(
    private _notificationService: NotificationService,
    private _translateService: TranslateService
  ) {}

  disableFields(form: FormGroup, fields): void {
    fields.forEach(field => {
      if (form.controls.hasOwnProperty(field)) {
        form.controls[field].disable();
      } else {
        console.warn(`Unable to find ${field} in form to be disabled`);
      }
    });
  }

  throwErrorForRequiredFields(form: FormGroup): void {
    let hasEmptyRequiredFields = false;
    Object.keys(form.controls).forEach(field => {
      const errors = form.controls[field].errors;
      if ( errors && errors.hasOwnProperty('required') && form.controls[field].errors.required ) {
        hasEmptyRequiredFields = true;
      }
    });
    if ( hasEmptyRequiredFields) {
      this._translateService
      .get('form.required-field-error')
      .subscribe(
      requiredError => {
        let error = requiredError ? requiredError : 'Please fill in the required fields.'
        this._notificationService.error(requiredError);
      });
    }
  }

  getPhoneNumberWithPrefix( mobilePhoneNumber: String): any {
    const mobilePhoneConfig = {
      mobilePrefix: '',
      mobilePhoneNumber: ''
    };
    if (mobilePhoneNumber) {
      const mobileNumberWithPrefix = mobilePhoneNumber.split(' '); // From my info: 65 98765433
      if (mobileNumberWithPrefix.length === 1) { // From normal number +6598765433
        const mobilePrefixWithoutPlus = CONFIGURATION.phone_prefix.replace(/\++/g, '');
        mobilePhoneConfig.mobilePrefix = CONFIGURATION.phone_prefix;
        mobilePhoneConfig.mobilePhoneNumber = mobileNumberWithPrefix[0].replace(/\++/g, ''); // strip off all +
        const regForMobilePrefixWithoutPlus = new RegExp(`^(${mobilePrefixWithoutPlus})`);
        mobilePhoneConfig.mobilePhoneNumber = mobilePhoneConfig.mobilePhoneNumber
          .replace(regForMobilePrefixWithoutPlus, ''); // strip off country code
      } else if (mobileNumberWithPrefix.length === 2 ) { // From my info: 65 98765433
        mobilePhoneConfig.mobilePrefix = CONFIGURATION.phone_prefix; // defaults to +65
        mobilePhoneConfig.mobilePhoneNumber = mobileNumberWithPrefix[1];
      } else {
        mobilePhoneConfig.mobilePrefix = CONFIGURATION.phone_prefix;
        mobilePhoneConfig.mobilePhoneNumber = `${mobilePhoneNumber}`;
      }
    }
    return mobilePhoneConfig;
  }

  enableFields(form: FormGroup, fields): void {
    fields.forEach(field => {
      if (form.controls.hasOwnProperty(field)) {
        form.controls[field].enable();
      } else {
        console.warn(`Unable to find ${field} in form to be enabled`);
      }
    });
  }

  getDefaultCurrencyFirst(currencies, currencyCode): any {
    let defaultCurrencyAtTheTop = [];
    const defaultCurrency = currencies.find((element) => {
      return element.code === currencyCode;
    });
    defaultCurrencyAtTheTop = currencies.filter((element) => {
        return element.code !== currencyCode;
    });
    defaultCurrencyAtTheTop.unshift(defaultCurrency);
    return defaultCurrencyAtTheTop;
  }

  getDefaultFirst(items: Array<any>, defaultCode: string): Array<any> {
    let defaultAtTheTop = [];
    const defaultItem = items.find((element) => {
      return element.code === defaultCode;
    });
    defaultAtTheTop = items.filter((element) => {
        return element.code !== defaultCode;
    });
    defaultAtTheTop.unshift(defaultItem);
    return defaultAtTheTop;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach( field => {
      const control = formGroup.get(field);
      if ( control instanceof FormControl) {
        control.markAsTouched({
          onlySelf: true
        });
      } else if ( control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
