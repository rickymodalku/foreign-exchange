
import {take} from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { BaseParameterService } from '../services/base-parameter.service';
import CONFIGURATION from '../../configurations/configuration';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as moment from 'moment';

@Injectable()
export class UtilityService {
  currencyShortLabel: Array<any>;
  CONFIGURATION: any;
  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _decimalPipe: DecimalPipe,
    private _deviceService: DeviceDetectorService,
    private _translateService: TranslateService
  ) {
    this.currencyShortLabel = new Array<any>();
    this.CONFIGURATION = CONFIGURATION;
  }

  capitalizeFirstLetter(sentence: string): string {
    let lowerCaseString = sentence.toLowerCase();
    return lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);
  }

  formatDecimal(value: number, digitsInfo: string = CONFIGURATION.format.decimal, locale: string = CONFIGURATION.format.locale): string {
    return this._decimalPipe.transform(
      value ? value : 0,
      digitsInfo,
      locale,
    );
  }

  convertDateToISOString(date: Date) {
    if (date) {
      const formattedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
      return formattedDate;
    }
  }

  onShowInvestorAccreditedDeclarationBanner() {
    return CONFIGURATION.showInvestorAccreditedDeclarationBanner &&
      this._baseParameterService.getMemberEntityTypeId().premierInvestor === this._authService.getMemberEntityTypeId() &&
      this._authService.getMemberEntityCode() === this._baseParameterService.getMemberEntityCode().retail;
  }

  stripTimeZoneFromDate(date: Date) {
    if (date) {
      return moment.utc({
        year: moment(date).get('year'),
        month: moment(date).get('month'),
        date: moment(date).get('date')
      });
    }
  }

  getDeviceDetail() {
    return this._deviceService.getDeviceInfo();
  }

  moveSpecificArrayToTop(data: any, key: any, comparedKey: any, ) {
    return data.unshift(data.splice(data.findIndex(item => item[key] === comparedKey), 1)[0]);
  }

  truncateDecimal(value: number, precision: number) {
    return new Promise<number>(resolve => {
      this._translateService.get('master.currency-short-label').pipe(
        take(1)) //useful if you need the data once and don't want to manually cancel the subscription again
        .subscribe(
          (currencyshortlabel: any) => {
            this.currencyShortLabel = currencyshortlabel;
            let denominator;
            let convertedValue;
            let result;
            if (precision !== 0) {
              const checkNegative = (String(value).startsWith('-'));
              const absoluteValue = Math.abs(value);
              if (absoluteValue < 1000000) {
                denominator = 1000;
                convertedValue = absoluteValue / denominator;
              } else if (absoluteValue < 1000000000) {
                denominator = 1000000;
                convertedValue = absoluteValue / denominator;
              } else if (absoluteValue < 1000000000000) {
                denominator = 1000000000;
                convertedValue = absoluteValue / denominator;
              } else if (absoluteValue < 1000000000000000) {
                denominator = 1000000000000;
              }
              convertedValue = absoluteValue / denominator;
              convertedValue = (Math.ceil(convertedValue * denominator) / denominator).toFixed(2);
              if (absoluteValue < 1000000) {
                result = this.formatDecimal(absoluteValue);
              } else if (absoluteValue >= 1000000 && absoluteValue < 1000000000) {
                result = this.formatDecimal(convertedValue) + ' ' + this.currencyShortLabel['million'];
              } else if (absoluteValue > 1000000000 && absoluteValue < 1000000000000) {
                result = this.formatDecimal(convertedValue) + ' ' + this.currencyShortLabel['billion'];
              } else if (absoluteValue > 1000000000000 && absoluteValue < 1000000000000000) {
                result = this.formatDecimal(convertedValue) + ' ' + this.currencyShortLabel['trillion'];
              } else {
                result = value.toFixed(2);
              }
              if (checkNegative) {
                result = '(' + result + ')';
              }
            } else {
              result = value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            resolve(result);
          })
    })
  }

  sortByKey(data: any, sortType: string, key: string) {
    data.sort((a, b) => {
      let temp, temp2;
      if (sortType === 'dateTime') {
        temp2 = new Date(a[key].getTime());
        temp = new Date(b[key].getTime());
      } else if (sortType === 'alphabet') {
        temp = a[key];
        temp2 = b[key];
      } else if (sortType === 'date') {
        temp = new Date(a[key]);
        temp2 = new Date(b[key]);
      }
      if (temp < temp2) {
        return -1;
      } else if (temp > temp2) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  shiftElementToTheTopOfArray(data: Array<any>): Array<any> {
    const firstElement = data.find(element => element.code === CONFIGURATION.country_code);
    const filteredData = data.filter(element => element.code !== CONFIGURATION.country_code);
    filteredData.unshift(firstElement);
    return filteredData;
  }

  getCampaignParameter(params: any, excludeParam: string) {
    params = JSON.parse(JSON.stringify(params));
    delete params[excludeParam];
    return params;
  }
}

