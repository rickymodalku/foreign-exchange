import { retryWhen, delay, take } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Activity } from '../../../models/finance.class';
import { ActivatedRoute, Params, Router } from '@angular/router';
import CONFIGURATION from '../../../../configurations/configuration';
import { TranslateService } from '@ngx-translate/core';
import { MemberService } from '../../../services/member.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { TwoFaSetupComponent } from './../../../components/two-fa/two-fa-setup/two-fa-setup.component';
import { FinanceService } from '../../../services/finance.service';
import { CryptographyService } from '../../../services/cryptography.service';
import { UserService } from '../../../services/user.service';
import { DialogService } from '../../../services/dialog.service';
import * as Raven from 'raven-js';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.html'
})
export class LogInComponent implements OnInit {
  @ViewChild(TwoFaSetupComponent, { static: true })
  private twoFaSetupComponent: TwoFaSetupComponent;
  buttonWidth: number;
  matchClass: boolean;
  faqCategory: string;
  faqMasterData: Array<any>;
  questionMasterData: Array<any>;
  countryCode: string;
  searchStr: string;
  formModel: any;
  logInModel: any;
  memberTypeCodes: any;
  redirectUrl: string;
  headerModel: any;
  memberModel: any;
  showBalanceCash: boolean;
  startLoginTimer: boolean;
  showError: boolean;
  investorLoginNextStep: string;

  constructor(
    private _translateService: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService,
    private _dialogService: DialogService,
    private _financeService: FinanceService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _localStorageService: LocalStorageService,
    private _cryptographyService: CryptographyService,
    private _userService: UserService,
    private _authGuardService: AuthGuard,
    private _sessionStorageService: SessionStorageService,
  ) {
    this.buttonWidth = 0;
    this.faqCategory = '';
    this.faqMasterData = new Array();
    this.questionMasterData = new Array();
    this.matchClass = false;
    this.countryCode = CONFIGURATION.country_code;
    this.logInModel = {
      validation: false,
      userName: '',
      password: '',
      rememberMe: true
    };
    this.memberTypeCodes = CONFIGURATION.member_type_code;
    this.redirectUrl = '';
    this.formModel = {
      signUpBorrower: {
        memberTypeCode: CONFIGURATION.member_type_code.borrower,
      },
      signUpInvestor: {
        memberTypeCode: CONFIGURATION.member_type_code.investor,
      },
      referral: {
        code: ''
      }
    };
    this.memberModel = {
      fullName: '',
      userName: ''
    }
    this.showError = false;
    // TEMPORARY CODE FOR OJK NEEDED
    this.startLoginTimer = true;
    this.investorLoginNextStep = '';
  }

  ngOnInit() {
    this.navigateToDashboard();
    this._userService
      .userLoginServiceEventEmitter
      .subscribe(
        channel => {
          this.logIn(null, null, channel);
        }
      );

    this._userService
      .userOnLoginServiceEventEmitter
      .subscribe(
        response => {
          this.onLogIn(response);
        }
      );

    this.headerModel = {
      isLoggedIn: false,
    };

    this._activatedRoute
      .queryParams
      .subscribe((params: Params) => {
        if (params['redirect']) {
          this.redirectUrl = params['redirect'];
        }
      });
  }

  logIn(pass?: string, userName?: string, otpChannel?: string): void {
    this.logInModel.validation = true;
    this.logInModel.password = pass ? pass : this.logInModel.password;
    this.logInModel.userName = userName ? userName : this.logInModel.userName;
    if (!this.logInModel.password || !this.logInModel.userName) {
      return;
    }
    if (!this.headerModel.isLoggedIn) {
      this._cryptographyService
        .regeneratePublicKey()
        .then(response => {
          this._userService
            .logIn(
              this.logInModel.userName,
              this._cryptographyService.encrypt(this.logInModel.password),
              this._cryptographyService.getUuid(),
              otpChannel
            ).subscribe(
              loginResponse => {
                this.investorLoginNextStep = loginResponse.next_step;
                // Two FA will need to exchange token
                if (loginResponse && this.investorLoginNextStep === '2fa') {
                  const twoFaData = {
                    mobileNumber: loginResponse.mobile_number,
                    email: loginResponse.email,
                    otpExpiryTime: CONFIGURATION.otpSetting.otpValidTiming * 1000,
                    refreshToken: loginResponse.refresh_token,
                    password: this.logInModel.password
                  };
                  this._dialogService.displayTwoFaLogInDialog(twoFaData);
                } else {
                  if (loginResponse && this.investorLoginNextStep === 'verify') {
                    this._authService.setTwoFANextStep(this.investorLoginNextStep);
                    this.twoFaSetupComponent.firstTimeVerifyPhoneNumber();
                  }
                  this.onLogIn(loginResponse);
                }
              },
              errorResponse => {
                if (errorResponse.error_description === 'User or password incorrect') {
                  this.showError = true;
                } else {
                  this._notificationService.error();
                }
              }
            );
        })
        .catch(error => {
          if (error.status === 0) {
            this.logInModel.invalid = true;
            this.logInModel.password = '';
          } else {
            this._notificationService.error();
          }
        });
    } else {
      this.navigateToDashboard();
    }
  }

  onLogIn(onLogInResponse: any) {
    // Normal Login
    const expiryTime = new Date();
    expiryTime.setTime(expiryTime.getTime() + (onLogInResponse.expires_in * 1000));
    this._authService.setBearerToken(onLogInResponse.access_token);
    this._authService.setExpiryTime(expiryTime);
    this._authService.setRefreshToken(onLogInResponse.refresh_token);
    this._authService.setRememberMe(this.logInModel.rememberMe);
    this.logInModel.invalid = false;
    this.logInModel.userName = '';
    this.logInModel.password = '';
    this.logInModel.validation = false;
    if (this.investorLoginNextStep === '2fa' || this.investorLoginNextStep === 'dashboard') {
      this.getLogInDetails(true);
    }
  }

  getLogInDetails(navigateToDashboard: boolean): void {
    this._memberService
      .getLoginDetail()
      .subscribe(
        member => {
          this._authService.logIn(
            member.memberTypeName,
            String(member.id),
            member.userName,
            this._authService.getMemberUUID()
          );
          Raven.setUserContext({
            email: member.userName
          });
          window['FS'].identify(member.id, {
            email: member.userName
          });

          if (
            member &&
            member.countryId === CONFIGURATION.country_code &&
            member.memberTypeCode === this._authService.getMemberTypeCode()
          ) {
            // ACCESS LEVEL VALIDATION
            let accessLevel = CONFIGURATION.access_level_code.administrator;
            let subaccount = null;
            if (member.userName !== this._authService.getUserName()) {
              subaccount = member.subaccounts.find(element => {
                return element.userName === this._authService.getUserName();
              });
              if (subaccount) {
                accessLevel = subaccount.accessLevel;
              } else {
                this.logOut();
              }
            }

            // ACTIVATION STEP VALIDATION
            let activationStepCode = '';
            if (
              member.activationStepCode !== null &&
              member.activationStepCode === CONFIGURATION.activation_step_code.fill_information
            ) {
              this._financeService.getDeposit()
                .subscribe(
                  response => {
                    activationStepCode = response.value.total > 0 ?
                      CONFIGURATION.activation_step_code.first_deposit :
                      (
                        member.activationStepCode !== null ?
                          member.activationStepCode :
                          CONFIGURATION.activation_step_code.null
                      );
                    this.formModel.referral.code = member.referralCode;
                    this.memberModel.fullName = this.parseFullName(member.fullName);
                    this.memberModel.userName = member.userName;
                    this._authService
                      .setLogInDetails(
                        accessLevel,
                        activationStepCode,
                        member.fullName,
                        member.memberStatusCode,
                        member.referralCode,
                        member.referralId ? member.referralId : 0,
                        subaccount ? subaccount.id : 0,
                        subaccount ? subaccount.userName : 'NULL',
                        member.isInstitutional,
                        member.memberEntityTypeId,
                        member.needsRDNOpening,
                        member.activatedAt,
                        member.memberChangeRequestEntity,
                        member.memberEntityCode);

                    if (navigateToDashboard) {
                      this.navigateToDashboard();
                    }
                  },
                  error => {
                    activationStepCode = member.activationStepCode !== null ?
                      member.activationStepCode :
                      CONFIGURATION.activation_step_code.null;
                    this.formModel.referral.code = member.referralCode;
                    this.memberModel.fullName = this.parseFullName(member.fullName);
                    this.memberModel.userName = member.userName;
                    this._authService
                      .setLogInDetails(
                        accessLevel,
                        activationStepCode,
                        member.fullName,
                        member.memberStatusCode,
                        member.referralCode,
                        member.referralId ? member.referralId : 0,
                        subaccount ? subaccount.id : 0,
                        subaccount ? subaccount.userName : 'NULL',
                        member.isInstitutional,
                        member.memberEntityTypeId,
                        member.needsRDNOpening,
                        member.activatedAt,
                        member.memberChangeRequestEntity,
                        member.memberEntityCode);

                    if (navigateToDashboard) {
                      this.navigateToDashboard();
                    }
                  }
                );
            } else {
              activationStepCode = member.activationStepCode !== null ?
                member.activationStepCode :
                CONFIGURATION.activation_step_code.null;
              this.formModel.referral.code = member.referralCode;
              this.memberModel.fullName = this.parseFullName(member.fullName);
              this.memberModel.userName = member.userName;
              this._authService
                .setLogInDetails(
                  accessLevel,
                  activationStepCode,
                  member.fullName,
                  member.memberStatusCode,
                  member.referralCode,
                  member.referralId ? member.referralId : 0,
                  subaccount ? subaccount.id : 0,
                  subaccount ? subaccount.userName : 'NULL',
                  member.isInstitutional,
                  member.memberEntityTypeId,
                  member.needsRDNOpening,
                  member.activatedAt,
                  member.memberChangeRequestEntity,
                  member.memberEntityCode);
              if (navigateToDashboard) {
                if (this._localStorageService.retrieve('fromSBN')) {
                  this._router.navigate(['/admin-investor/sbn-retail']);
                  this._localStorageService.clear('fromSBN');
                } else {
                  this.navigateToDashboard();
                }
              }
            }
          } else {
            this.logOut();
          }
        },
        error => {
          const expiryTime = this._authService.getExpiryTime();
          const sessionAbleToRefresh = expiryTime !== '' && this._authService.getRememberMe();
          const numberOfRefresh = this._sessionStorageService.retrieve('numberOfRefresh') ?
            this._sessionStorageService.retrieve('numberOfRefresh') : 0;
          if (sessionAbleToRefresh && numberOfRefresh < 3) {
            this._sessionStorageService.store('numberOfRefresh', numberOfRefresh + 1);
            this._userService.refreshLoginCall(true);
          } else {
            this.logOut();
          }
        }
      );
  }

  parseFullName(fullName: string): string {
    let parsed = '';
    if (fullName.length > 16) {
      parsed = fullName.replace(',', '').split(' ')[0];
      if (parsed.length > 16) {
        parsed = fullName.substr(0, 16) + '...'
      }
    } else {
      parsed = fullName;
    }

    return parsed;
  }

  logOut(): void {
    this._userService.logOut().pipe(retryWhen(errors => errors.pipe(delay(3000), take(2)))).subscribe(
      res => { }
    );
    this._authService.logOut();
  }

  navigateToDashboard(): void {
    if (this.redirectUrl) {
      const url = this._authGuardService.getRedirectUrl(this.redirectUrl);
      this.redirectUrl = '';
      this._router.navigate([url]);
    } else {
      switch (this._authService.getMemberTypeCode()) {
        case this.memberTypeCodes.borrower:
          this._router.navigate(['/admin-borrower/overview']);
          break;
        case this.memberTypeCodes.investor:
          this._router.navigate(['/admin-investor/overview']);
          break;
      }
    }
    this._dialogService.closeAllModal();
  }

  onTwoFaLogin(): void {
    const pass = this._authService.getTwoFaLoginPass();
    const userName = this._authService.getSignUpCredential().userName;
    this.logIn(pass, userName);
  }


  clearLogInSession(): void {
    try {
      delete window['HYPE']['documents']['dashboard-nav'];
    } catch (e) {
    }
  }

  onCloseError() {
    this.showError = false;
  }

}
