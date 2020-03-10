import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import CONFIGURATION from 'configurations/configuration';
import { TranslateService } from '@ngx-translate/core';
import { MemberService } from '../../../services/member.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { ValidatorService } from '../../../services/validator.service';
import { EventService } from '../../../services/event.service';
import { TwoFaConfig, TwoFaPhoneNumberConfig } from './two-fa-interface';
import { UserService } from '../../../services/user.service';
import { BaseParameterService } from '../../../services/base-parameter.service';
import { CryptographyService } from '../../../services/cryptography.service';
import * as moment from 'moment';
import { TwoFaService } from 'app/services/two-fa.service';

import {
  FormGroup,
  FormBuilder,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'two-fa-common',
  templateUrl: './two-fa-common.html',
  styleUrls: ['./two-fa-common.scss']
})

export class TwoFaCommonComponent implements OnInit, OnChanges, OnDestroy {
  @Input('twoFaOptions') twoFaOptions: TwoFaConfig;
  CONFIGURATION: any;
  signUpCredential: any;
  lastStepKey: number;
  numberOfOtpDigits: number;
  otpDigits: Array<number>;
  otpDigitsForm: FormGroup;
  otpDigitsFormControls: any;
  otpDigitPrefix: string;
  showOtpError: boolean;
  otpErrorMessage: string;
  otpUserName: string;
  otpUserPhoneNumber: string;
  otpValidTiming: any;
  otpCountDownTimer: string;
  countdownTimer: any;
  otpBySMS: boolean;
  memberDetail: any;
  otpSucceeded: boolean;
  otpInProgress: boolean;
  enableAutoLogin: boolean;
  changePhoneNumberForm: any;
  otpTranslations: any;
  showChangeNumberLink: boolean;
  phoneNumberConfig: TwoFaPhoneNumberConfig;
  errorAfterKeyin6Digits: boolean;
  countryCode: string;
  otpInput: number;
  otpErrorMessageList: any;
  errorMessage: string;
  disableOtpInput: boolean;
  otpErrorDescription: any;

  constructor(
    private _memberService: MemberService,
    private _formBuilder: FormBuilder,
    private _notificationService: NotificationService,
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _validatorService: ValidatorService,
    private _translateService: TranslateService,
    private _eventService: EventService,
    private _userService: UserService,
    private _cryptographyService: CryptographyService
  ) {
    this.CONFIGURATION = CONFIGURATION;
    this.lastStepKey = 9999;
    this.numberOfOtpDigits = CONFIGURATION.otpSetting.numberOfOtpDigits;
    this.otpDigits = [];
    this.otpDigitsFormControls = {};
    this.otpDigitPrefix = CONFIGURATION.otpSetting.otpDigitPrefix;
    this.showOtpError = false;
    this.otpUserName = '';
    this.otpUserPhoneNumber = '';
    this.otpValidTiming = CONFIGURATION.otpSetting.otpValidTiming;
    this.otpCountDownTimer = '';
    this.otpBySMS = CONFIGURATION.country_code !== 'SG' && CONFIGURATION.country_code !== 'VN';
    this.memberDetail = {
      phoneNumber: ''
    };
    this.changePhoneNumberForm = {
      error: false,
      number: null
    };
    this.otpSucceeded = false;
    this.otpInProgress = !this.otpSucceeded;
    this.showChangeNumberLink = true;
    this.errorAfterKeyin6Digits = false;
    this.countryCode = CONFIGURATION.country_code;
    this.otpInput = null;
    this.errorMessage = null;
    this.disableOtpInput = false;
    this.otpErrorDescription =
      [{ error: 1, error_description: 'OTP does not match' },
      { error: 2, error_description: 'OTP is expired' },
      { error: 3, error_description: 'OTP max attempts has been reached' }];
  }

  ngOnInit() {
    const pass = this._authService.getTwoFaLoginPass();
    this.enableAutoLogin = pass !== null;
    this.twoFaOptions.mode = this.twoFaOptions.mode || 'SIGN-UP';

    this.phoneNumberConfig = {
      mode: this.twoFaOptions.mode,
      allowDropDown: true,
      onlyCountries: [(this.countryCode.toLowerCase())],
      mobilePhoneNumber: this.twoFaOptions.mobileNumber,
      enablePhoneNumberChange: false
    };

    // For sign up
    if (this.twoFaOptions.mode === 'SIGN-UP') {
      this.signUpCredential = this._authService.getSignUpCredential();
      this.otpUserName = this.signUpCredential ? this.signUpCredential.userName : '';
      this.phoneNumberConfig = Object.assign(this.phoneNumberConfig, {
        'allowDropDown': this.signUpCredential.memberTypeCode === 'INV',
        'enablePhoneNumberChange': true
      });
      this._memberService.getSignUpDetail(this.signUpCredential.userName, CONFIGURATION.country_code, this.signUpCredential.token)
        .subscribe(
          member => {
            if (member.status === 'success') {
              this.memberDetail = member.data;
              this.otpUserPhoneNumber = this.memberDetail.member.mobilePhoneNumber;
              // Beware that ngOnChanges needs immutable object to be triggered
              // https://juristr.com/blog/2016/04/angular2-change-detection/
              this.phoneNumberConfig = Object.assign({}, this.phoneNumberConfig, {
                mobilePhoneNumber: this.memberDetail.member.mobilePhoneNumber
              })
            } else {
              this._notificationService.error();
            }
          },
          error => {
            this._notificationService.error();
          }
        );
      // For Login
    } else if (this.twoFaOptions.mode === 'LOG-IN') {
      this.otpBySMS = true;
      this.otpUserPhoneNumber = this.twoFaOptions.mobileNumber;
      this.otpValidTiming = Math.round(this.twoFaOptions.otpExpiryTime / 1000);
      this.otpUserName = this.twoFaOptions.email;
      this.showChangeNumberLink = false;
    }

    for (let curDigit = 0; curDigit < this.numberOfOtpDigits; curDigit++) {
      this.otpDigitsFormControls[`otp-digit-${curDigit + 1}`] = new FormControl(null, [this._validatorService.validatePositiveInteger]);
    }
    this.otpDigitsForm = this._formBuilder.group(this.otpDigitsFormControls);
    for (let curIndex = 0; curIndex < this.numberOfOtpDigits; curIndex++) {
      this.otpDigits.push(curIndex + 1);
    }

    this._translateService.get('form.otp').subscribe(otpTranslations => {
      this.otpTranslations = otpTranslations;
    });

    this.setCountDownTimer();
    // Get otp on start
    if (this.twoFaOptions && this.twoFaOptions.getOtpOnStart) {
      const otpChannel = this.otpBySMS ? 'sms' : 'email';
      this.onClickGetOtp(otpChannel, this.twoFaOptions.mode);
    }
    this._translateService.get('form.otp.error-message').subscribe(otpErrorMessage => {
      this.otpErrorMessageList = otpErrorMessage;
    });
  }

  ngOnChanges(configChanges: SimpleChanges) {
    if (configChanges.twoFaOptions.previousValue
      && configChanges.twoFaOptions.currentValue.otpExpiryTime !== configChanges.twoFaOptions.previousValue.otpExpiryTime
    ) {
      this.setCountDownTimer();
    }
  }

  ngOnDestroy() {
    window.clearInterval(this.countdownTimer);
  }

  onClickGetOtp(otpChannel: string, mode?: string) {
    const otpDesiredChannel = otpChannel || 'email'; // sms or email
    const otpMode = mode || this.twoFaOptions.mode;
    if (otpMode === 'SIGN-UP') {
      this.getOtp(this.signUpCredential.userName,
        this.signUpCredential.token,
        this.CONFIGURATION.country_code,
        this.lastStepKey, otpDesiredChannel, otpMode);
    } else if (otpMode === 'LOG-IN') {
      this.getLoginOtp(otpChannel);
      this.setCountDownTimer();
    }
  }

  onPhoneNumberChanged(phoneNumber: string) {
    this.otpUserPhoneNumber = phoneNumber;
    if (this.twoFaOptions.mode === 'SIGN-UP') {
      this.onClickGetOtp('sms', 'SIGN-UP');
    }
  }

  // Check for all the otp number before enabling it,
  // submit immediately after the user and at the same time enable the verify button
  // Putting up a loading screen with message verifying
  // If success, show the success screen
  // If error, put up the error screen
  onInputOtp() {
    const numberOtpFieldFilled = this.otpInput.toString().length;
    if (numberOtpFieldFilled === this.numberOfOtpDigits && !this.errorAfterKeyin6Digits) {
      if (this.twoFaOptions.mode === 'SIGN-UP') {
        this.onClickActivateUser();
      } else if (this.twoFaOptions.mode === 'LOG-IN') {
        this.onClickLoginWithOtp();
      }
    }
  }

  onInputOtpTextbox() {
    const numberOtpFieldFilled = this.otpInput.toString().length;
    if (numberOtpFieldFilled === this.numberOfOtpDigits) {
      this.onClickLoginWithOtp();
    }
  }

  onClickActivateUser() {
    this.activateUser(this.otpInput.toString());
  }

  onClickLoginWithOtp() {
    let otpToken;
    if (this.twoFaOptions.mode === 'LOG-IN') {
      otpToken = this.otpInput.toString();
    }
    this.loginWithOtp(otpToken);
  }

  clearOtpInputs() {
    this.otpDigitsForm.reset();
  }

  disableOtpInputs() {
    // Disable otp input after the timer reaches zero
    this.disableOtpInput = true;
  }

  enableOtpInputs() {
    // Enable otp inputs after the otp is sent
    this.disableOtpInput = false;
  }

  setCountDownTimer() {
    const otpValidDuration = this.otpValidTiming;
    const interval = 1000;
    let otpDuration = otpValidDuration * 1000; // seconds
    let duration = moment.duration(otpDuration, 'milliseconds');

    window.clearInterval(this.countdownTimer);
    this.countdownTimer = setInterval(function () {
      duration = moment.duration(otpDuration - interval, 'milliseconds');
      otpDuration = otpDuration - interval;
      this.otpCountDownTimer = `${duration.minutes()}:${String(duration.seconds()).padStart(2, '0')}`;
      if (duration.seconds() === 0 && duration.minutes() === 0) {
        window.clearInterval(this.countdownTimer);
        this.disableOtpInputs();
      }
    }.bind(this), interval);
  }

  // Send activation to receive 2FA
  getOtp(userName: string, token: string, countryCode: string, stage: number, channel: string, mode: string) {
    this._memberService
      .sendOtpCode(
        userName,
        countryCode,
        token,
        stage,
        channel
      )
      .subscribe(
        response => {
          if (response.message !== 'Success') {
            this._notificationService.error(response.message);
          } else {
            this.setCountDownTimer();
            this.showOtpError = false;
            this.clearOtpInputs();
            this.enableOtpInputs();
          }
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  getLoginOtp(mode) {
    this._userService.userLoginServiceEventEmitter.next(mode);
    this.showOtpError = false;
    this.clearOtpInputs();
    this.enableOtpInputs();
  }

  loginWithOtp(otpCode: string) {
    this._userService.logInWithOtp(
      this.otpUserName,
      this._cryptographyService.getUuid(),
      this.twoFaOptions.refreshToken,
      otpCode).subscribe(response => {
        this.errorAfterKeyin6Digits = false;
        this._userService.userOnLoginServiceEventEmitter.emit(response);
      }, err => {
        /**
         * Take note that the error response for wrong otp will be
         * returning http error status code of 400 and the error string
         * will be unauthorized
         * https://github.com/fundingasiagroup/ms-mobile-external-auth/commit/8c954cb
         * Previously, the response is returning 401 error and error string is unauthorized
         */
        this.errorAfterKeyin6Digits = true;
        const checkErrorName = obj => obj.error === Number(err.error);
        if (this.otpErrorDescription.some(checkErrorName)) {
          this.showOtpError = true;
          this.errorMessage = this.otpErrorDescription.find(x => x.error === Number(err.error)).error_description;
        } else {
          this._notificationService.error();
        }
      });
  }

  activateUser(otpCode: string) {
    const step = this._baseParameterService.getAccountVerificationStepDetail();
    this.showOtpError = false;
    this._memberService.v2Activate(CONFIGURATION.country_code, this.signUpCredential.userName, otpCode).subscribe(
      (response) => {
        this.errorAfterKeyin6Digits = false;
        this._notificationService.success(this.otpTranslations['otp-verification-successful']);
        this.otpInProgress = false;
        this.otpSucceeded = !this.otpInProgress;
        if (this.signUpCredential.memberTypeCode === 'INV') {
          this._eventService.sendInvSignupEvent('INV-email-verified');
          this._authService.setLastSignUStepWeb(step.label);
        } else if (this.signUpCredential.memberTypeCode === 'BRW') {
          this._eventService.sendBrwSignupEvent('BRW-email-verified');
          this._notificationService.success('activated borrower');
          this._authService.setLastSignUStepWeb(step.label);
        }
      }, error => {
        this.errorAfterKeyin6Digits = true;
        this.errorMessage = this.otpErrorMessageList['not-match'];
        this.showOtpError = true;
      }
    );
  }

  onClickProgress() {
    this._authService.triggerTwoFaLogIn();
  }

  onClickVerifyButton() {
    if (this.otpInput && this.otpInput.toString().length > 0) {
      if (this.otpInput.toString().length === this.numberOfOtpDigits) {
        if (this.twoFaOptions.mode === 'LOG-IN') {
          this.onClickLoginWithOtp();
        } else if (this.twoFaOptions.mode === 'SIGN-UP') {
          this.onClickActivateUser();
        } else {
          this._notificationService.error();
        }
      } else {
        this.showOtpError = true;
        this.errorMessage = this.otpErrorMessageList['digit-code'];
      }
    } else {
      this.showOtpError = true;
      this.errorMessage = this.otpErrorMessageList['empty'];
    }
  }
}
