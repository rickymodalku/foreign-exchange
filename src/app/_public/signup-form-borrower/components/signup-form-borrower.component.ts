
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignUpCredential } from '../../../models/auth.class';
import { AuthService } from '../../../services/auth.service';
import { BaseParameterService } from '../../../services/base-parameter.service';
import { MemberService } from '../../../services/member.service';
import { NotificationService } from '../../../services/notification.service';
import { EventService } from '../../../services/event.service';
import CONFIGURATION from '../../../../configurations/configuration';

@Component({
  selector: 'app-signup-form-borrower-id',
  templateUrl: './signup-form-borrower.html'
})
export class SignupFormBorrowerComponent implements OnInit {
  signUpCredential: SignUpCredential;
  twoFaOptions: any;
  CONFIGURATION: any;
  borrowerMemberTypeCode: string;

  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _router: Router,
    private _eventService: EventService,
  ) {
    this.CONFIGURATION = CONFIGURATION;
    this.signUpCredential = null;
    this.twoFaOptions = {};
    this.borrowerMemberTypeCode = CONFIGURATION.member_type_code.borrower;
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
    this._router.navigate(['/sign-up-borrower']);
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
          this._authService.setLastSignUStepWeb(step.label);
          this._eventService.sendBrwSignupEvent('BRW-account-verified');
        },
        error => {
          this._notificationService.error();
        }
      );
  }
}
