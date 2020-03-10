import {
    Component,
    OnInit,
    ViewChild,
    ElementRef
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    NgControl,
    Validators
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PasswordRestriction } from '../../models/auth.class';
import { AuthService } from '../../services/auth.service';
import { CryptographyService } from '../../services/cryptography.service';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import CONFIGURATION from '../../../configurations/configuration';
import { TwoFaSetupComponent } from '../two-fa/two-fa-setup/two-fa-setup.component';

@Component({
  selector: 'setting-password',
  templateUrl: './setting-password.html'
})
export class SettingPasswordComponent implements OnInit {
    @ViewChild(TwoFaSetupComponent, { static: true })
    private twoFaSetupComponent: TwoFaSetupComponent;
    formModel: any;
    settingPasswordForm: FormGroup;
    mobilePhonePrefix: string;
    mobilePhoneNumber: string;
    CONFIGURATION: any;
    twoFaSettingPlaceholderTranslation: any;

    constructor(
        private _authService: AuthService,
        private _cryptographyService: CryptographyService,
        private _formBuilder: FormBuilder,
        private _memberService: MemberService,
        private _notificationService: NotificationService,
        private _translateService: TranslateService,
    ) {
        this.CONFIGURATION = CONFIGURATION;
        this.formModel = {
            settingPassword: {
                error: '',
                passwordRestrictions: new Array<PasswordRestriction>(),
                passwordValid: true,
                retypedPasswordMatches: true,
                success: '',
                validation: false
            }
        };
        this.settingPasswordForm = this._formBuilder.group({
            oldPassword: new FormControl(null, [Validators.required]),
            password: new FormControl(null, [Validators.required]),
            retypedPassword: new FormControl(null, [Validators.required])
        });
        this.mobilePhoneNumber = '';
        this.mobilePhonePrefix = '';
    }

    ngOnInit() {
      this._cryptographyService.regeneratePublicKey();
      this._translateService
        .get('form.setting-password')
        .subscribe(
          password => {
            this.formModel.settingPassword.error = password.error;
            this.formModel.settingPassword.success = password.success;
          }
        );

      this._translateService
        .get('master.password-restrictions')
        .subscribe(
          passwordRestrictions => {
            passwordRestrictions.forEach(passwordRestriction => {
              this.formModel.settingPassword.passwordRestrictions.push(<PasswordRestriction>({
                label: passwordRestriction.label,
                regex: new RegExp(passwordRestriction.regex),
                valid: true
              }));
            });
          }
        );
      this._memberService.getMemberDetail()
        .subscribe( response => {
          this.mobilePhoneNumber =  response.mobilePhoneNumber.indexOf('+') === 0 ? response.mobilePhoneNumber.substring(3, response.mobilePhoneNumber.length) : response.mobilePhoneNumber;
          this.mobilePhonePrefix = response.mobilePhoneNumber.indexOf('+') === 0 ? response.mobilePhoneNumber.substring(0, 3) : CONFIGURATION.phone_prefix;
        }, error => {
          this._notificationService.error('Unable to get your current phone number. Please try again later.');
        });
    }

    onSettingPasswordFormSubmit(): void {
        this.onTypePassword();
        this.formModel.settingPassword.validation = true;

        if (
            this.formModel.settingPassword.passwordValid &&
            this.formModel.settingPassword.retypedPasswordMatches &&
            this.settingPasswordForm.valid
        ) {
            this._memberService
                .updatePassword(
                    this._authService.getMemberId(),
                    {
                        "old_password": this._cryptographyService.encrypt(this.settingPasswordForm.value.oldPassword),
                        "password": this._cryptographyService.encrypt(this.settingPasswordForm.value.password),
                        "uuid": this._cryptographyService.getUuid()
                    }
                )
                .subscribe(
                    response => {
                        this._cryptographyService.regeneratePublicKey();
                        this.formModel.settingPassword.passwordValid = true;
                        this.formModel.settingPassword.retypedPasswordMatches = true;
                        this.formModel.settingPassword.validation = false;
                        this.settingPasswordForm.reset();
                        this._notificationService.success(this.formModel.settingPassword.success);
                    },
                    error => {
                        this._cryptographyService.regeneratePublicKey();
                        this._notificationService.error(error.message);
                    }
                );
        }
    }

    onTypePassword(): void {
        let password = this.settingPasswordForm.value.password;
        this.formModel.settingPassword.passwordValid = true;
        this.formModel.settingPassword.passwordRestrictions
            .forEach(passwordRestriction => {
                passwordRestriction.valid = passwordRestriction.regex.test(password);
                if (!passwordRestriction.valid) {
                    this.formModel.settingPassword.passwordValid = false;
                }
            });
    }

    onRetypePassword(): void {
      this.formModel.settingPassword.retypedPasswordMatches = (this.settingPasswordForm.value.password === this.settingPasswordForm.value.retypedPassword);
    }

    openTwoFaSetup() {
      this.twoFaSetupComponent.verifyPhoneNumber();
    }

    onPhoneNumberChanged(phoneNumber: string) {
        this.mobilePhoneNumber =  phoneNumber.indexOf('+') === 0 ? phoneNumber.substring(3, phoneNumber.length) : phoneNumber;
        this.mobilePhonePrefix = phoneNumber.indexOf('+') === 0 ? phoneNumber.substring(0, 3) : CONFIGURATION.phone_prefix;
    }

}
