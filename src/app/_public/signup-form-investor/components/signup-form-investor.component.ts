import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseParameterService } from '../../../services/base-parameter.service';
import { SignUpCredential } from '../../../models/auth.class';
import { AuthService } from '../../../services/auth.service';
import { MemberService } from '../../../services/member.service';
import { NotificationService } from '../../../services/notification.service';
import { EventService } from '../../../services/event.service';
import CONFIGURATION from '../../../../configurations/configuration';

@Component({
  selector: 'signup-form-investor',
  templateUrl: './signup-form-investor.html'
})
export class SignupFormInvestorComponent implements OnInit {
  countryCode: string;
  formModel: any;
  memberId: string;
  signUpCredential: SignUpCredential;
  steps: Array<any>;
  testimonialContent: Array<any>;
  testimonialContentFlag: boolean;
  twoFaOptions: any;
  CONFIGURATION: any;
  investorMemberTypeCode: string;

  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _router: Router,
    private _eventService: EventService,
  ) {
    this.CONFIGURATION = CONFIGURATION;
    this.countryCode = CONFIGURATION.country_code;
    this.formModel = {
      completion: 0,
      existing: null,
    };

    this.signUpCredential = null;
    this.steps = new Array<any>();
    this.testimonialContent = new Array<any>();
    this.testimonialContentFlag = false;
    this.twoFaOptions = {};
    this.investorMemberTypeCode = CONFIGURATION.member_type_code.investor;
  }

  ngOnInit() {
    this.signUpCredential = this._authService.getSignUpCredential();
    this.twoFaOptions.getOtpOnStart = true;
    if (this.signUpCredential === null && this.signUpCredential.memberTypeCode !== CONFIGURATION.member_type_code.borrower) {
      this.kickOut();
    }
  }

  kickOut(): void {
    this._authService.logOut();
    this._router.navigate(['/sign-up-investor']);
  }

  sendActivationLink(): void {
    const step = this._baseParameterService.getAccountVerificationStepDetail();
    const otpChannel = CONFIGURATION.enable2Fa ? 'sms' : 'email';
    this._memberService
      .sendActivationLink(
        this.signUpCredential.userName,
        CONFIGURATION.country_code,
        this.signUpCredential.token,
        step.key,
        otpChannel
      )
      .subscribe(
        response => {
          if (response.status !== 'success') {
            this._notificationService.error(response.message);
          }
          this._eventService.sendInvSignupEvent('INV-doc-upload');
          window['Intercom']('trackEvent', 'New_Investor_Signup', {
            'email': this.signUpCredential.userName
          });
        },
        error => {
          this._notificationService.error();
        }
      );
  }
}
