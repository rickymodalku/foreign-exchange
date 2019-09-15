import { Injectable } from '@angular/core';

@Injectable()
export class AutoFormatService {
  debug = false;

  constructor(
  ) { }

  addDelimiter(text: string, includeCent: boolean = true): string {
    text += '';
    if (includeCent) {
      var decimalSeparatorRegExp = new RegExp('[^0-9\\' + '.' + ']', 'g');
      text = text.replace(decimalSeparatorRegExp, '');
    } else {
      text = text.replace(/[^0-9]/g, '');
    }
    var thousandsSeparatorRegExp = new RegExp('\\' + ',', 'g');
    text = text.replace(thousandsSeparatorRegExp, '');

    var x = text.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1))
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    text = x1 + x2;

    return text;
  }

  removeDelimiter(text: string): string {
    var thousandsSeparatorRegExp = new RegExp('\\' + ',', 'g');
    var decimalSeparatorRegExp = new RegExp('\\' + '.', 'g');

    text += '';
    text = text.replace(thousandsSeparatorRegExp, '');
    text = text.replace(decimalSeparatorRegExp, '.');

    return text;
  }

  formatCurrency(value: any) {
    return this.addDelimiter(value, true);
  }

  formatValue(value: any, format: string): any {
    switch (format) {
      case 'number':
        return this.formatCurrency(value);
      default:
        if (this.debug) {
          console.error(`Unable to find the corresponding function for the format ${format}`);
        }
    }
  }
}
