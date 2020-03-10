import { MemberPhoneNumberChangeVerifyTemplate } from './../../../models/member.class';
import { ModalService } from 'app/services/modal.service';
import { TwoFaCommonComponent } from 'app/components/two-fa/two-fa-common/two-fa-common.component';
import { TwoFaPhoneNumberComponent } from './../two-fa-phone-number/two-fa-phone-number.component';
import { FeatureFlagService } from '../../../services/feature-flag.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage';
import { MemberService } from '../../../services/member.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service'
import CONFIGURATION from '../../../../configurations/configuration';
import * as moment from 'moment';
import {
  Component,
  OnInit,
  AfterViewInit,
  EventEmitter,
  ViewChild,
  Input,
  SimpleChanges,
  OnChanges,
  OnDestroy,
  Output
} from '@angular/core';
import { TwoFaService } from 'app/services/two-fa.service';
import { TwoFaPhoneNumberConfig, TwoFaOtpConfig } from '../two-fa-common/two-fa-interface';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-two-fa-setup',
  templateUrl: './two-fa-setup.html',
  styleUrls: ['./two-fa-setup.scss']
})

// this.twoFaSetupComponent.openOtpDialog(phoneNumber); // put this into parent component to open OTP Dialog
// this.twoFaSetupComponent.verifyPhoneNumber(); // put this into parent component to open Verify Phone Number Dialog

export class TwoFaSetupComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input('isFirstSetup') isFirstSetup: string;
  @Output('onPhoneNumberChangeSuccess') onPhoneNumberChangeSuccess = new EventEmitter<any>();
  @ViewChild(TwoFaPhoneNumberComponent, { static: true })
  private twoFaPhoneNumberComponent: TwoFaPhoneNumberComponent;
  @ViewChild(TwoFaCommonComponent, { static: false })
  twoFaLoginSetupDialogSwitchLocalKey: string;
  twoFaLoginSetupDialogId: string;
  featureToggle: any;
  enable2FAFeatureToggle: boolean;
  show2FASetupDialogEventEmitter: EventEmitter<any>;
  phoneNumberConfig: TwoFaPhoneNumberConfig;
  twoFaOtpConfig: TwoFaOtpConfig;
  twoFaSettingPlaceholderTranslation: any;
  otpUserPhoneNumber: string;
  changePhoneNumberKey: string;
  CONFIGURATION: any;
  otpInput: number;
  errorMessage: string;
  disableOtpInput: boolean;

  private numberOfOtpDigits: number;
  otpDigits: Array<number>;
  showOtpError: boolean;
  otpCountDownTimer: string;
  private otpValidTiming: number;
  private countdownTimer: any;
  private twoFaNextStep: string;
  private otpErrorMessageList: any;
  featureFlagObservable: Observable<any>;

  public constructor(
    private _modalService: ModalService,
    private _twoFaService: TwoFaService,
    private featureFlagService: FeatureFlagService,
    private _localStorageService: LocalStorageService,
    private _translateService: TranslateService,
    private _memberService: MemberService,
    private _authService: AuthService,
    private _notificationService: NotificationService
  ) {
    this.CONFIGURATION = CONFIGURATION;
    this.twoFaLoginSetupDialogSwitchLocalKey = 'close_two_fa_notification';
    this.twoFaLoginSetupDialogId = 'twoFaLoginSetupDialog';
    this.show2FASetupDialogEventEmitter = new EventEmitter(true);
    this.phoneNumberConfig = {
      mode: 'ANY',
      allowDropDown: true,
      mobilePhoneNumber: '',
      enablePhoneNumberChange: true,
      autoPlaceholder: 'polite'
    };
    this.otpDigits = [];
    this.showOtpError = false;
    this.otpValidTiming = CONFIGURATION.otpSetting.otpValidTiming;
    this.otpCountDownTimer = '';
    this.numberOfOtpDigits = CONFIGURATION.otpSetting.numberOfOtpDigits;
    this.twoFaNextStep = '';
    this.otpInput = null;
    this.errorMessage = '';
    this.disableOtpInput = false;
  }

  ngOnInit() {
    this.twoFaNextStep = this._authService.getTwoFaNextStep();
    // Feature toggle for 2fa login
    const { twoFa } = this.featureFlagService.getFeatureFlagKeys();
    this.featureFlagObservable = this.featureFlagService.getFeatureFlagObservable();
    this.featureFlagObservable.subscribe((flags) => {
      this.enable2FAFeatureToggle = flags[twoFa];
      if (this.enable2FAFeatureToggle) {
        this.show2FASetupDialogEventEmitter.emit(true);
      }
    });

    this._translateService.get('form.setting-two-fa.placeholder').subscribe(twoFaTranslations => {
      this.twoFaSettingPlaceholderTranslation = twoFaTranslations;
    });
    this._translateService.get('form.otp.error-message').subscribe(otpErrorMessage => {
      this.otpErrorMessageList = otpErrorMessage;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.twoFaOtpConfig && changes.twoFaOtpConfig.currentValue && changes.twoFaOtpConfig.currentValue.otpExpiryTime) {
      this.setCountDownTimer(changes.twoFaOtpConfig.currentValue.otpExpiryTime);
    }
  }

  ngOnDestroy() {
    window.clearInterval(this.countdownTimer);
  }

  ngAfterViewInit() {
    if (this.isFirstSetup) {
      this.show2FASetupDialogEventEmitter.subscribe((response) => {
        if (this.enable2FAFeatureToggle) {
          if (this.twoFaNextStep === 'verify') {
            this.openModal('twoFaLoginSetupDialog');
          } else {
            this.closeModal('twoFaLoginSetupDialog');
          }
        }
      });
    }
  }

  onInputOtp() {
    const numberOtpFieldFilled = this.otpInput.toString().length;
    if (numberOtpFieldFilled === this.numberOfOtpDigits) {
      this.onOtpInputFull(this.otpInput);
    }
  }

  disableOtpInputs() {
    // Disable otp input after the timer reaches zero
    this.disableOtpInput = true;
  }

  enableOtpInputs() {
    // Enable otp inputs after the otp is sent
    this.disableOtpInput = false;
  }

  setCountDownTimer(otpExpiryTime: number) {
    const otpValidDuration = otpExpiryTime || this.otpValidTiming;
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

  onClickGetOtp(channel = 'sms') {
    this.onClickPhoneNumberChangeConfirm(this.otpUserPhoneNumber, channel);
    this.hideInvalidCodeError();
    this.clearOtpInputs();
    this.enableOtpInputs();
  }

  showInvalidCodeError() {
    this.showOtpError = true;
  }

  hideInvalidCodeError() {
    this.showOtpError = false;
  }

  clearOtpInputs() {
    this.otpInput = null;
  }

  onClickVerifyButton() {
    if (this.otpInput && this.otpInput.toString().length > 0) {
      this.onOtpInputFull(this.otpInput);
    } else {
      this.showOtpError = true;
      this.errorMessage = this.otpErrorMessageList['empty'];
    }
  }

  verifyPhoneNumber() {
    this.openModal('changePhoneNumberModal');
  }

  firstTimeVerifyPhoneNumber() {
    this.openModal('twoFaLoginSetupDialog');
  }

  closeTwoFaLoginDialog(choice?: string) {
    if (choice === 'dismiss') {
      this._localStorageService.store(this.twoFaLoginSetupDialogSwitchLocalKey, true);
    }
    this.closeModal('twoFaLoginSetupDialog');
  }

  openModal(id: string): void {
    this._modalService.open(id);
  }

  closeModal(id: string): void {
    this._modalService.close(id);
  }

  onClickPhoneNumberChangeConfirm(phoneNumber: string, channel = 'sms') {
    this.openOtpDialog(phoneNumber, channel);
  }

  openOtpDialog(phoneNumber: string, channel= 'sms') {
    this.otpUserPhoneNumber = phoneNumber;
    if (phoneNumber) {
      this._memberService.updateMemberPhoneNumber(
        this._authService.getMemberUUID(), {
        mobilePhoneNumber: phoneNumber,
        otpChannel: channel
      }).subscribe(response => {
        this.changePhoneNumberKey = response.data.key;
        this.twoFaOtpConfig = Object.assign({}, {
          mobileNumber: '',
          otpExpiryTime: response.data['expiresInSeconds']
        });
        this.openModal('changeNumberOtpModal');
        this.twoFaPhoneNumberComponent.close();
        this.setCountDownTimer(response.data['expiresInSeconds']);
      }, error => {
        // Gateway is not returning error code in the response for 40001 error
        // The message returned is `New mobile phone number is the same as existing.`
        // In order for us to capture and handle this error, we are using the keyword
        // existing so that it is not as fragile as comparing the full error message.
        if (error && error.message.includes('existing')) {
          this.updateTwoFactorAuthenticationSetting(true);
        } else {
          this._notificationService.error();
        }
      });
    }
  }

  updateTwoFactorAuthenticationSetting(checked: boolean) {
    if (this.isFirstSetup) {
      if (checked) {
        this._authService.clearTwoFANextStep();
        this._notificationService.success(`${this.twoFaSettingPlaceholderTranslation['enabled']}`);
      } else {
        this._notificationService.success(`${this.twoFaSettingPlaceholderTranslation['disabled']}`);
      }
      this.twoFaPhoneNumberComponent.close();
      this.closeModal('twoFaLoginSetupDialog');
      this.onPhoneNumberChangeSuccess.emit(this.otpUserPhoneNumber);
    } else {
      this.twoFaPhoneNumberComponent.close();
      this.closeModal('twoFaLoginSetupDialog');
      this.onPhoneNumberChangeSuccess.emit(this.otpUserPhoneNumber);
    }
  }

  onOtpInputFull(otpNumber: number) {
    if (this.otpInput.toString().length === this.numberOfOtpDigits) {
      const UUID = this._authService.getMemberUUID();
      const memberPhoneNumberChangeRequest = {
        key: this.changePhoneNumberKey, // get it from the response of this._memberService.updateMemberPhoneNumber
        token: otpNumber
      } as MemberPhoneNumberChangeVerifyTemplate;
      this._memberService.verifyMemberPhoneNumber(UUID, memberPhoneNumberChangeRequest)
        .subscribe(response => {
          this.updateTwoFactorAuthenticationSetting(true);
          this.closeModal('twoFaLoginSetupDialog');
          this.closeModal('changeNumberOtpModal');
        }, error => {
          if (error && error.message.includes('invalid')) {
            this.showOtpError = true;
            this.errorMessage = this.otpErrorMessageList['not-match'];
          } else {
            this._notificationService.error();
          }
        });
    } else {
      this.showOtpError = true;
      this.errorMessage = this.otpErrorMessageList['digit-code'];
    }

  }
}
