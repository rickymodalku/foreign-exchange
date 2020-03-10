import { Injectable } from "@angular/core";
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PasswordRestriction } from '../models/auth.class';
import CONFIGURATION from '../../configurations/configuration';

@Injectable()
export class ValidatorService {
  static readonly NUMBER_REGEXP: RegExp = /^[0-9]+$/;
  numberPattern: string;
  phonePrefixPattern: string;
  spaceRegex: RegExp;

  constructor() {
    this.numberPattern = '^[0-9]*$';
    this.phonePrefixPattern = '^[+][0-9]{1,3}$';
    this.spaceRegex = /\s+/g;
  }

  addDelimiter(text: string, includeCent: boolean = true): string {
    text += '';
    if (includeCent) {
      var decimalSeparatorRegExp = new RegExp('[^0-9\\' + CONFIGURATION.format.decimal_separator + ']', 'g');
      text = text.replace(decimalSeparatorRegExp, '');
    } else {
      text = text.replace(/[^0-9]/g, '');
    }
    var thousandsSeparatorRegExp = new RegExp('\\' + CONFIGURATION.format.thousands_separator, 'g');
    text = text.replace(thousandsSeparatorRegExp, '');

    var x = text.split(CONFIGURATION.format.decimal_separator);
    var x1 = x[0];
    var x2 = x.length > 1 ? CONFIGURATION.format.decimal_separator + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1))
      x1 = x1.replace(rgx, '$1' + CONFIGURATION.format.thousands_separator + '$2');
    text = x1 + x2;

    return text;
  }

  removeDelimiter(text: string): string {
    var thousandsSeparatorRegExp = new RegExp('\\' + CONFIGURATION.format.thousands_separator, 'g');
    var decimalSeparatorRegExp = new RegExp('\\' + CONFIGURATION.format.decimal_separator, 'g');

    text += '';
    text = text.replace(thousandsSeparatorRegExp, '');
    text = text.replace(decimalSeparatorRegExp, '.');

    return text;
  }

  validatePassword(passwordRestrictions: Array<PasswordRestriction>): boolean {
    passwordRestrictions.forEach(passwordRestriction => {
      if (!passwordRestriction.valid) {
        return false;
      }
    });

    return true;
  }

  validatePositiveDecimal(control: FormControl): any {
    return (parseFloat(control.value) > 0) ? null : {
      validatePositiveDecimal: {
        valid: false
      }
    };
  }

  validatePositiveInteger(control: FormControl): any {
    return (parseInt(control.value) > 0) ? null : {
      validatePositiveInteger: {
        valid: false
      }
    };
  }

  validateMinimumAmount(minimum: number): any {
    return function (control: FormControl): any {
      const value = parseFloat(this.removeDelimiter(control.value));
      return value >= minimum ? null : {
        validateMinimumInteger: {
          valid: false
        }
      };
    }.bind(this);
  }

  validateMaximumAmount(maximum: number): any {
    return function (control: FormControl): any {
      const value = parseFloat(this.removeDelimiter(control.value));
      return value <= maximum ? null : {
        validateMaximumAmount: {
          valid: false
        }
      };
    }.bind(this);
  }

  validateRangedDecimal(minimum: number, maximum: number): any {
    return function (control: FormControl): any {
      return (parseFloat(control.value) >= minimum && parseFloat(control.value) <= maximum) ? null : {
        validateRangedDecimal: {
          valid: false
        }
      };
    };
  }

  validateSingaporeMobilePhoneNumber(control: FormControl): any {
    let regEx = /^(\+\d{1,3}[- ]?)?\d{8,12}$/;
    return regEx.test(control.value) ? null : {
      validateSingaporeMobilePhoneNumber: {
        valid: false
      }
    };
  }

  isPositiveDecimal(digits: string): boolean {
    return ValidatorService.NUMBER_REGEXP.test(digits);
  }

  validateSingaporeNRIC(control: FormControl): any {
    // DESCRIPTION
    // The Singapore NRIC number is made up of a letter in front, 7 digits, and a letter behind. So the length is 9.
    // The steps:
    // 1. The weight for the NRIC number in Singapore [2, 7, 6, 5, 4, 3, 2]
    //    The first digit you multiply by 2, second multiply by 7, third by 6, fourth by 5, fifth by 4, sixth by 3,
    //    seventh by 2. Then you add the totals together.
    // 2. If the first letter of the NRIC starts with T or G, add 4 to the total.
    // 3. Then you divide the number by 11 and get the remainder
    // 4. You can get the last letter depending on the IC type (the first letter in the IC) using the code below:
    //    If the IC starts with S or T: 0=J, 1=Z, 2=I, 3=H, 4=G, 5=F, 6=E, 7=D, 8=C, 9=B, 10=A
    //    If the IC starts with F or G: 0=X, 1=W, 2=U, 3=T, 4=R, 5=Q, 6=P, 7=N, 8=M, 9=L, 10=K

    let str = control.value ? control.value : '';
    if (str.length !== 9) {
      return {
        validateSingaporeNRIC: {
            valid: false
        }
      };
    }
    str = str.toUpperCase();

    let i: number;
    let icArray = [];
    for (i = 0; i < 9; i++) {
      icArray[i] = str.charAt(i);
    }
    // step 1
    icArray[1] = parseInt(icArray[1], 10) * 2;
    icArray[2] = parseInt(icArray[2], 10) * 7;
    icArray[3] = parseInt(icArray[3], 10) * 6;
    icArray[4] = parseInt(icArray[4], 10) * 5;
    icArray[5] = parseInt(icArray[5], 10) * 4;
    icArray[6] = parseInt(icArray[6], 10) * 3;
    icArray[7] = parseInt(icArray[7], 10) * 2;
    let weight = 0;
    for (i = 1; i < 8; i++) {
        weight += icArray[i];
    }
    // end of step 1

    // step 2
    const offset = (icArray[0] === 'T' || icArray[0] === 'G') ? 4 : 0;
    // end of step 2

    // step 3
    const temp = (offset + weight) % 11;
    // end of step 3

    // step 4
    const st = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
    const fg = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
    let theAlpha;
    if (icArray[0] === 'S' || icArray[0] === 'T') {
      theAlpha = st[temp];
    } else if (icArray[0] === 'F' || icArray[0] === 'G') {
      theAlpha = fg[temp];
    }
    if (icArray[8] !== theAlpha) {
      return {
        validateSingaporeNRIC: {
            valid: false
        }
      };
    }
    // end of step 4
  }
}
