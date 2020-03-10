import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  AfterViewInit,
  OnChanges,
  EventEmitter,
  SimpleChanges,
  ElementRef,
  ViewChild,
  SimpleChange
} from '@angular/core';
import CONFIGURATION from 'configurations/configuration';
import { TranslateService } from '@ngx-translate/core';
import { MemberService } from '../../../services/member.service';
import { NotificationService } from '../../../services/notification.service';
import { ModalService } from '../../../services/modal.service';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';

import {
  FormGroup,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import {
  TwoFaPhoneNumberInterface,
  TwoFaMode,
  TwoFaPhoneNumberConfig
} from '../two-fa-common/two-fa-interface';

@Component({
  selector: 'two-fa-phone-number',
  templateUrl: './two-fa-phone-number.html'
})

export class TwoFaPhoneNumberComponent implements OnInit, TwoFaPhoneNumberInterface {
  private readonly MODAL_NAME = 'changePhoneNumberModal';
  @Input('config') config: TwoFaPhoneNumberConfig;
  @Output('onPhoneNumberChangeSuccess') onPhoneNumberChangeSuccess = new EventEmitter<any>();
  @Output('onPhoneNumberChangeFail') onPhoneNumberChangeFail = new EventEmitter<any>();
  @Output('onClickPhoneNumberChangeConfirm') onClickPhoneNumberChangeConfirm = new EventEmitter<any>();
  @ViewChild('mobilePhoneNumber', { static: true }) mobilePhoneInput: ElementRef;
  CONFIGURATION: any;
  mode: TwoFaMode;
  signUpCredential: any;
  memberDetail: any;
  telInputOptions: any;
  changePhoneNumberForm: any;
  showChangeNumberLink: boolean;
  otpTranslations: any;
  phoneNumber: string;
  enablePhoneNumberChange: boolean;
  telInput: any;
  userCannotChangePhoneNumberParam: any;

  constructor(
    private _memberService: MemberService,
    private _formBuilder: FormBuilder,
    private _notificationService: NotificationService,
    private _modalService: ModalService,
    private _translateService: TranslateService,
    private _eventService: EventService,
    private _authService: AuthService
  ) {
    this.CONFIGURATION = CONFIGURATION;
    this.memberDetail = {
      phoneNumber: ''
    };
    this.changePhoneNumberForm = {
      error: false,
      number: null
    };
  }

  ngOnInit() {
    this.userCannotChangePhoneNumberParam = {
      email: this.CONFIGURATION.infoEmail
    };
    this.mode = this.config.mode;
    this.phoneNumber = this.config.mobilePhoneNumber || '';
    this.enablePhoneNumberChange = this.config.enablePhoneNumberChange;
    this.telInputOptions = {
      'allowDropdown': true,
      'autoPlaceholder': this.config.autoPlaceholder
    };
    this._translateService.get('form.otp').subscribe( otpTranslations => {
      this.otpTranslations = otpTranslations;
    });
    if (this.mode === 'SIGN-UP') {
      this.signUpCredential = this._authService.getSignUpCredential();
    } else if (this.mode === 'LOG-IN') {

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ( changes && changes.config) {
      if (changes.config.currentValue.mobilePhoneNumber) {
        this.setPhoneNumber(changes.config.currentValue.mobilePhoneNumber);
      } else if ( typeof changes.config.currentValue.enablePhoneNumberChange === 'boolean') {
        this.enablePhoneNumberChange = changes.config.currentValue.enablePhoneNumberChange;
      }
    }
  }

  telInputObject(obj): void {
    this.telInput = obj;
    obj.intlTelInput('setCountry', CONFIGURATION.country_code.toLowerCase());
    if (this.phoneNumber && this.phoneNumber.length > 0) {
      obj.intlTelInput('setNumber', this.phoneNumber);
    }
  }

  setNumber(number: string): void {
    this.changePhoneNumberForm.number = number;
    this.changePhoneNumberForm.error = false;
  }

  setPhoneNumber(number: string): void {
    if ( number) {
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

  getNumber(): string {
    return this.changePhoneNumberForm.number;
  }

  mobileNumberIsValid(isValid: Boolean): void {
    this.changePhoneNumberForm.error = !isValid;
  }

  onCountryChange(obj) {
  }

  // User is only allowed to change phone number during sign up
  onChangePhoneNumber(phoneNumber: string): void {
    if (!this.changePhoneNumberForm.error  && phoneNumber !== null) {
      if (this.mode === 'SIGN-UP') {
        this._memberService
          .updateSignUpInformation(
          this.signUpCredential.userName,
          CONFIGURATION.country_code,
          this.signUpCredential.token,
          {
            mobilePhoneNumber: phoneNumber
          }).subscribe( response => {
            this._notificationService.success(this.otpTranslations['mobile-number-updated-successfully']);
            this.onPhoneNumberChangeSuccess.emit(phoneNumber);
            this.closeModal(this.MODAL_NAME);
          }, error => {
            this._notificationService.error();
            this.onPhoneNumberChangeFail.emit(error);
          }
        );
      } else if ( this.mode === 'LOG-IN') {
        this._memberService
          .updateMember(
            {
              mobilePhoneNumber: phoneNumber
            }
          ).subscribe(
            response => {
              if (response.status === 'success') {
                this.onPhoneNumberChangeSuccess.emit(phoneNumber);
                this.closeModal(this.MODAL_NAME);
              } else {
                this._notificationService.error(response.message);
                this.onPhoneNumberChangeFail.emit(response.message);
              }
            },
            error => {
              this._notificationService.error();
            }
          );
      }
    }
  }

  clickChangePhoneNumber() {
    if (!this.changePhoneNumberForm.error) {
      this.onChangePhoneNumber(this.getNumber());
      this.onClickPhoneNumberChangeConfirm.emit(this.getNumber())
    }
  }

  open() {
    this.openModal(this.MODAL_NAME);
  }

  close() {
    this.closeModal(this.MODAL_NAME);
  }

  openModal(id: string) {
    this._modalService.open(id);
  }

  closeModal(id: string) {
    this._modalService.close(id);
  }
}
