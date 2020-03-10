import { Injectable } from '@angular/core';
import { ValidatorService } from '../services/validator.service';

@Injectable()
export class AutoFormatService {
  debug = false;

  constructor(
    private _validatorService: ValidatorService
  ) {}

  formatCurrency(value: any) {
    return this._validatorService.addDelimiter(value, true);
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
