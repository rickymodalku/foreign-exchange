import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import CONFIGURATION from '../../../../configurations/configuration';
import { TranslateService } from '@ngx-translate/core';
import { MemberService } from '../../../services/member.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'standalone-forgot-password',
  templateUrl: './forgot-password.html'
})
export class ForgotPasswordComponent implements OnInit {
  activeView: string;
  memberTypeCodes: any;

  formModel: any;
  forgotPasswordForm: FormGroup;
  isResponse: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private _translateService: TranslateService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
  ) {
    this.isResponse = false;
    this.forgotPasswordForm = this._formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
    this.formModel = {
      forgotPassword: {
        error: '',
        catch: false,
        success: '',
        userName: '',
        validation: false
      }
    };
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this._translateService
    .get('form.forgot-password')
    .subscribe(
      forgotPassword => {
        this.formModel.forgotPassword.error = forgotPassword.error;
        this.formModel.forgotPassword.success = forgotPassword.success;
      }
    );
  }

  onForgotPasswordSubmit(): any {
    this.formModel.forgotPassword.userName = '';
    this.formModel.forgotPassword.validation = true;
    if (this.forgotPasswordForm.valid) {
      this._memberService
        .forgotPassword({
          countryId: CONFIGURATION.country_code,
          userName: this.forgotPasswordForm.value.email,
          redirectLink: `${location.origin}/password`
        })
        .subscribe(
          response => {
            window.scrollTo(0, 0);
            this.formModel.forgotPassword.catch = false;
            this.formModel.forgotPassword.validation = false;
            this.formModel.forgotPassword.userName = this.forgotPasswordForm.value.email;
            this.forgotPasswordForm.reset();
            this.isResponse = true;
          },
          error => {
            if (error.message === 'Member not found or is inactive.') {
              this._notificationService.error(this.formModel.forgotPassword.error);
            } else {
              this._notificationService.error();
            }
          }
        );
    }
  }
}
