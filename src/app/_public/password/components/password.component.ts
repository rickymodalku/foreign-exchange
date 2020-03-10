import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PasswordRestriction } from '../../../models/auth.class';
import { CryptographyService } from '../../../services/cryptography.service';
import { DialogService } from '../../../services/dialog.service';
import { MemberService } from '../../../services/member.service';
import { NotificationService } from '../../../services/notification.service';
import { ValidatorService } from '../../../services/validator.service';
import CONFIGURATION from '../../../../configurations/configuration';

@Component({
  selector: 'password',
  templateUrl: './password.html'
})
export class PasswordComponent implements OnInit {
  formModel: any;
  passwordForm: FormGroup;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _cryptographyService: CryptographyService,
    private _dialogService: DialogService,
    private _formBuilder: FormBuilder,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _router: Router,
    private _translateService: TranslateService,
    private _validatorService: ValidatorService
  ) {
    this.formModel = {
      password: {
        error: '',
        params: new Array<any>(),
        passwordRestrictions: new Array<PasswordRestriction>(),
        passwordValid: true,
        retypedPasswordMatches: true,
        success: '',
        token: '',
        validation: false
      }
    };
    this.passwordForm = this._formBuilder.group({
      password: new FormControl(null, [Validators.required]),
      retypedPassword: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this._activatedRoute
      .queryParams
      .subscribe((params: Params) => {
        this._translateService
          .get('form.password')
          .subscribe(
          password => {
            this.formModel.password.error = password.error;
            this.formModel.password.success = password.success;

            let countryId = params['country_id'];
            this.formModel.password.token =  params['token'];
            let userName = params['username'];
            if (countryId && this.formModel.password.token && userName && countryId === CONFIGURATION.country_code) {
              this.formModel.password.params = params;
              this._memberService
                .checkForgotPasswordRequest(
                this.formModel.password.params['username'],
                this.formModel.password.params['country_id'],
                this.formModel.password.token
                )
                .subscribe(
                response => {
                  if (response.status !== 'success') {
                    this._notificationService.error(this.formModel.password.error);
                    this._router.navigate(['/forgot-password']);
                  }
                  this.formModel.password.token = response.data;
                  this._cryptographyService.regeneratePublicKey();
                },
                error => {
                  this._notificationService.error(this.formModel.password.error);
                  this._router.navigate(['/forgot-password']);
                }
                );
            } else {
              this._notificationService.error(this.formModel.password.error);
              this._router.navigate(['/forgot-password']);
            }
          }
          );
      });
    this._cryptographyService.regeneratePublicKey();
    this._translateService
      .get('master.password-restrictions')
      .subscribe(
      passwordRestrictions => {
        passwordRestrictions.forEach(passwordRestriction => {
          this.formModel.password.passwordRestrictions.push(<PasswordRestriction>({
            label: passwordRestriction.label,
            regex: new RegExp(passwordRestriction.regex),
            valid: true
          }));
        });
      }
      );
  }

  onPasswordFormSubmit(): void {
    this.onTypePassword();
    this.formModel.password.validation = true;

    if (
      this.formModel.password.passwordValid &&
      this.formModel.password.retypedPasswordMatches &&
      this.passwordForm.valid
    ) {
      this._memberService
        .resetPassword({
          country_id: this.formModel.password.params['country_id'],
          username: this.formModel.password.params['username'],
          password: this._cryptographyService.encrypt(this.passwordForm.value.password),
          token: this.formModel.password.token,
          uuid: this._cryptographyService.getUuid()
        })
        .subscribe(
        response => {
          this._cryptographyService.regeneratePublicKey();
          this.formModel.password.passwordValid = true;
          this.formModel.password.retypedPasswordMatches = true;
          this.formModel.password.validation = false;
          this.passwordForm.reset();
          this._notificationService.success(this.formModel.password.success);
          this._router.navigate(['/log-in']);
        },
        error => {
          this._cryptographyService.regeneratePublicKey();
          this._notificationService.error(error.message);
        }
        );
    }
  }

  onTypePassword(): void {
    let password = this.passwordForm.value.password;
    this.formModel.password.passwordValid = true;
    this.formModel.password.passwordRestrictions
      .forEach(passwordRestriction => {
        passwordRestriction.valid = passwordRestriction.regex.test(password);
        if (!passwordRestriction.valid) {
          this.formModel.password.passwordValid = false;
        }
      });
  }

  onRetypePassword(): void {
    this.formModel.password.retypedPasswordMatches = (this.passwordForm.value.password === this.passwordForm.value.retypedPassword);
  }
}
