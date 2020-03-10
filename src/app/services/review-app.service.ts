import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
@Injectable()
export class ReviewAppService {
  countryCode: string;
  defaultCountryCode: string;
  defaultEnvironment: string;
  localStorageEnvironmentKey: string;
  localStorageLanguageKey: string;
  countries: Array<Object>;
  environments: Array<string>;
  constructor(
  ) {
    this.localStorageLanguageKey = 'country';
    this.localStorageEnvironmentKey = 'environment';
    this.defaultEnvironment = 'staging';
    this.defaultCountryCode = 'my';
    this.countries = [
      { 'code': 'my', 'value': 'MY' },
      { 'code': 'id', 'value': 'ID' },
      { 'code': 'sg', 'value': 'SG' },
      { 'code': 'vn', 'value': 'VN' },
    ];
    this.environments = [
      'staging',
      'uat'
    ];
  }

  changeCountry(countryCode: string) {
    if (countryCode) {
      localStorage.setItem(this.localStorageLanguageKey, countryCode);
    }
  }

  getCountry() {
    return localStorage.getItem(this.localStorageLanguageKey) || this.defaultCountryCode;
  }

  getCountries() {
    return this.countries;
  }

  changeEnvironment(environment: string) {
    if (environment) {
      localStorage.setItem(this.localStorageEnvironmentKey, environment);
    }
  }

  getEnvironment() {
    return localStorage.getItem(this.localStorageEnvironmentKey) || this.defaultEnvironment;
  }

  getEnvironments() {
    return this.environments;
  }
}
