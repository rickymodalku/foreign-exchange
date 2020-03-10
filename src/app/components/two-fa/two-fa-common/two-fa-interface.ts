import { EventEmitter } from '@angular/core';

export type TwoFaMode = 'LOG-IN' | 'SIGN-UP' | 'ENABLE-TWO-FA' | 'ANY';
export type TwoFaPhoneNumberConfigPlaceHolderOptions = 'polite' | 'aggressive' | 'off';
export class TwoFaConfig {
  mode: TwoFaMode;
  getOtpOnStart: boolean;
  mobileNumber: string;
  email?: string;
  otpExpiryTime?: number;
  refreshToken?: string;

  constructor(mode: TwoFaMode) {
    this.mode = mode;
  }
};

export class TwoFaOtpConfig {
  mobileNumber: string;
  otpExpiryTime?: number;
};
export class TwoFaPhoneNumberConfig {
  mode: TwoFaMode;
  allowDropDown: boolean;
  mobilePhoneNumber?: string;
  nationalMode?: boolean;
  enablePhoneNumberChange?: boolean;
  autoPlaceholder?: TwoFaPhoneNumberConfigPlaceHolderOptions;
  onlyCountries?: Array<any>;
}

export interface TwoFaPhoneNumberInterface {
  config: TwoFaPhoneNumberConfig;
  onChangePhoneNumber: ChangePhoneNumberFunction;
  onPhoneNumberChangeSuccess: EventEmitter<any>;
  onPhoneNumberChangeFail: EventEmitter<any>;
}

export type ChangePhoneNumberFunction = (phoneNumber: string) => void;
