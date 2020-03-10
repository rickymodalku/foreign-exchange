import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import CONFIGURATION from 'configurations/configuration';
import { TwoFaPhoneNumberConfig } from '../two-fa/two-fa-common/two-fa-interface';

@Component({
  selector: 'int-telp-input',
  templateUrl: './int-telp-input.html'
})

export class IntTelpInputComponent implements OnInit {
  @Input('config') config: TwoFaPhoneNumberConfig;
  @Input('inputValue') inputValue: string;
  @Input('disabledInput') disabledInput: boolean;
  @Input('showValidation') showValidation: boolean;
  @Input('updateNumber') updateNumber: string;
  @Output('patchPhoneNumber') patchPhoneNumber = new EventEmitter<string>();
  @Output('getValidation') getValidation = new EventEmitter<boolean>();

  CONFIGURATION: any;
  telInputOptions: any;
  changePhoneNumberForm: any;
  phoneNumber: string;
  telInput: any;

  constructor() {
    this.CONFIGURATION = CONFIGURATION;
    this.changePhoneNumberForm = {
      error: false,
      number: null
    };
  }

  ngOnInit() {
    this.patchPhoneNumber.emit(this.updateNumber);
    this.phoneNumber = this.config.mobilePhoneNumber || '';
    this.telInputOptions = {
      'allowDropdown': true,
      'autoPlaceholder': this.config.autoPlaceholder,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    this.changePhoneNumberForm.number = this.inputValue;
    if (this.updateNumber) {
      this.phoneNumber = this.updateNumber;
    }
    if (changes && changes.config) {
      if (changes.config.currentValue.mobilePhoneNumber) {
        this.setPhoneNumber(changes.config.currentValue.mobilePhoneNumber);
      }
    }
  }

  telInputObject(obj): void {
    this.patchPhoneNumber.emit(this.updateNumber);
    this.telInput = obj;
    obj.intlTelInput('setCountry', CONFIGURATION.country_code.toLowerCase());
    if (this.phoneNumber && this.phoneNumber.length > 0) {
      obj.intlTelInput('setNumber', this.phoneNumber);
    }
  }

  setNumber(number: string): void {
    this.changePhoneNumberForm.number = number;
    this.patchPhoneNumber.emit(this.changePhoneNumberForm.number);
    this.changePhoneNumberForm.error = false;
  }

  setPhoneNumber(number: string): void {
    if (number) {
      const formmatedNumber = number.trim();
      if (this.telInput) {
        this.telInput.intlTelInput('setNumber', formmatedNumber);
        this.mobileNumberIsValid(this.telInput.intlTelInput('isValidNumber'));
      }
      this.changePhoneNumberForm.number = formmatedNumber;
    } else {
      this.telInput.intlTelInput('setNumber', ' ');
      this.mobileNumberIsValid(false);
    }
  }

  mobileNumberIsValid(isValid: Boolean): void {
    this.changePhoneNumberForm.error = !isValid;
    if (isValid && this.config.onlyCountries && !String(this.changePhoneNumberForm.number).startsWith(CONFIGURATION.phone_prefix)) {
      this.changePhoneNumberForm.error = true;
    }
    this.getValidation.emit(this.changePhoneNumberForm.error);
  }
}
