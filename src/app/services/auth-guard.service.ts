import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from './auth.service';
import { SecurityService } from './security.service';
import { NotificationService } from './notification.service';
import { MemberService } from './member.service';
import { FinanceService } from './finance.service';
import { EventEmitter } from '../models/generic.class';
import CONFIGURATION from '../../configurations/configuration';

declare let CryptoJS, HmacSHA256: Function;

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  private _borrowerRoutesDictionary: any;
  private _borrowerRoutes: Array<string>;
  private _investorRoutesDictionary: any;
  private _investorRoutes: Array<string>;
  private _masterData: any;
  navigationEventEmitter: EventEmitter;
  firstMinumumDeposit: number;
  private _securedBorrowerRoutes: Array<string>;
  private _securedInvestorRoutes: Array<string>;

  constructor(
    private _authService: AuthService,
    private _localStorageService: LocalStorageService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _financeService: FinanceService,
    private memberService: MemberService,
    private _router: Router,
    private _securityService: SecurityService
  ) {
    this._borrowerRoutesDictionary = {
      sign_up: '/admin-borrower/sign-up',
      activity: '/admin-borrower/activity',
      homepage: '/admin-borrower',
      new_loan: '/admin-borrower/new-loan',
      overview: '/admin-borrower/overview',
      referral: '/admin-borrower/referral',
      repayment: '/admin-borrower/repayment',
      setting: '/admin-borrower/setting',
      partner: '/admin-borrower/partner',
      statement: '/admin-borrower/statement',
    };
    this._borrowerRoutes = new Array<string>();
    this._borrowerRoutes.push(this._borrowerRoutesDictionary.sign_up);
    this._borrowerRoutes.push(this._borrowerRoutesDictionary.homepage);
    this._borrowerRoutes.push(this._borrowerRoutesDictionary.activity);
    this._borrowerRoutes.push(this._borrowerRoutesDictionary.new_loan);
    this._borrowerRoutes.push(this._borrowerRoutesDictionary.overview);
    this._borrowerRoutes.push(this._borrowerRoutesDictionary.referral);
    this._borrowerRoutes.push(this._borrowerRoutesDictionary.repayment);
    this._borrowerRoutes.push(this._borrowerRoutesDictionary.setting);
    this._borrowerRoutes.push(this._borrowerRoutesDictionary.partner);
    this._borrowerRoutes.push(this._borrowerRoutesDictionary.statement);

    this._investorRoutesDictionary = {
      activity: '/admin-investor/activity',
      browse_loan: '/admin-investor/browse-loan',
      deposit: '/admin-investor/deposit',
      homepage: '/admin-investor',
      overview: '/admin-investor/overview',
      portfolio: '/admin-investor/portfolio',
      referral: '/admin-investor/referral',
      sbn_retail: '/admin-investor/sbn-retail',
      setting: '/admin-investor/setting',
      sign_up: '/admin-investor/sign-up',
      setting_password: '/admin-investor/setting/change-password',
      setting_bank: '/admin-investor/setting/bank',
      setting_auto: '/admin-investor/setting/auto-investment',
      setting_priority_investment: '/admin-investor/setting/priority-investment',
      setting_accredited_declaration: '/admin-investor/setting/accredited-declaration',
      setting_personal: '/admin-investor/setting/personal',
      setting_subscription_agreement: '/admin-investor/setting/subscription-agreement',
      setting_user_agreement: '/admin-investor/setting/user-agreement',
      statement: '/admin-investor/statement',
      subscription_agreement: '/admin-investor/subscription-agreement',
      rdn_activation: '/admin-investor/rdn-activation',
      withdrawal: '/admin-investor/withdrawal'
    };
    this._investorRoutes = new Array<string>();
    this._investorRoutes.push(this._investorRoutesDictionary.homepage);
    this._investorRoutes.push(this._investorRoutesDictionary.activity);
    this._investorRoutes.push(this._investorRoutesDictionary.browse_loan);
    this._investorRoutes.push(this._investorRoutesDictionary.deposit);
    this._investorRoutes.push(this._investorRoutesDictionary.deposit_fpx);
    this._investorRoutes.push(this._investorRoutesDictionary.overview);
    this._investorRoutes.push(this._investorRoutesDictionary.portfolio);
    this._investorRoutes.push(this._investorRoutesDictionary.referral);
    this._investorRoutes.push(this._investorRoutesDictionary.sbn_retail);
    this._investorRoutes.push(this._investorRoutesDictionary.setting);
    this._investorRoutes.push(this._investorRoutesDictionary.sign_up);
    this._investorRoutes.push(this._investorRoutesDictionary.setting_bank);
    this._investorRoutes.push(this._investorRoutesDictionary.setting_personal);
    this._investorRoutes.push(this._investorRoutesDictionary.setting_password);
    this._investorRoutes.push(this._investorRoutesDictionary.setting_auto);
    this._investorRoutes.push(this._investorRoutesDictionary.setting_priority_investment);
    this._investorRoutes.push(this._investorRoutesDictionary.setting_accredited_declaration);
    this._investorRoutes.push(this._investorRoutesDictionary.setting_subscription_agreement);
    this._investorRoutes.push(this._investorRoutesDictionary.setting_user_agreement);
    this._investorRoutes.push(this._investorRoutesDictionary.statement);
    this._investorRoutes.push(this._investorRoutesDictionary.subscription_agreement);
    this._investorRoutes.push(this._investorRoutesDictionary.rdn_activation);
    this._investorRoutes.push(this._investorRoutesDictionary.withdrawal);

    this._masterData = {
      activationStepCodes: CONFIGURATION.activation_step_code,
      lastSignUpWebStatus: CONFIGURATION.last_sign_up_web_status,
      memberStatusCode: CONFIGURATION.member_status.reverification,
      memberTypeCodes: CONFIGURATION.member_type_code
    };
    this.firstMinumumDeposit = 0;
    this.navigationEventEmitter = new EventEmitter();
    this._securedBorrowerRoutes = new Array<string>();
    this._securedInvestorRoutes = new Array<string>();
    this._memberService.getCountryDetail(CONFIGURATION.country_code).subscribe(data => {
      if (
        data && data.deposit_settings &&
        data.deposit_settings.minimum_first_deposit
      ) {
        this.firstMinumumDeposit = data.deposit_settings.minimum_first_deposit;
      }
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this._checkLogIn(url);
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;
    return this._checkLogIn(url);
  }

  private _checkLogIn(url: string): boolean {
    if (CONFIGURATION.intercom.enable) {
      window['Intercom']('shutdown');
      const hash = CryptoJS.HmacSHA256(this._authService.getMemberId().toString(), CONFIGURATION.intercom.hashCode);
      const hashInHex = CryptoJS.enc.Hex.stringify(hash);
      window['Intercom']('boot', {
        app_id: CONFIGURATION.intercom.appId,
        email: this._authService.getUserName().toString(),
        user_id: this._authService.getMemberId().toString(),
        user_hash: hashInHex
      });
    }
    if (CONFIGURATION.zendesk.enable) {
      window['zE']('webWidget', 'reset');
      window['zE']('webWidget', 'identify', {
        name: this._authService.getFullName().toString(),
        email: this._authService.getUserName().toString()
      });
      window['zE']('webWidget', 'updateSettings', {
        chat: {
          tags: [this._authService.getMemberTypeCode()]
        }
      });
    }
    var sanitizedUrl = url.split('?')[0];
    this._resetSecuredRoutes();
    if (this._authService.isLoggedIn()) {
      switch (this._authService.getMemberTypeCode()) {
        case this._masterData.memberTypeCodes['investor']:
          // Fallback to `Getting Started` if route is invalid.
          if (!this._investorRoutes.find(element => { return element === sanitizedUrl })) {
            setTimeout(() => {
              this._router.navigate([this._investorRoutesDictionary.homepage]);
            }, 0);
          }

          // Fallback to respective page if activation is not completed and route is restricted.
          if (
            !this._securedInvestorRoutes.find(element => { return element === sanitizedUrl }) &&
            this._authService.getActivationStepCode() !== this._masterData.activationStepCodes['activated']
          ) {
            switch (CONFIGURATION.country_code) {
              case 'ID':
                switch (this._authService.getActivationStepCode()) {
                  case '':
                  case this._masterData.activationStepCodes['null']:
                    setTimeout(() => {
                      this._notificationService.info(this._localStorageService.retrieve('unauthorized-message'));
                      if(this._masterData.memberStatusCode === this._authService.getMemberStatusCode()) {
                        this._router.navigate([this._investorRoutesDictionary.subscription_agreement]);
                      } else {
                        this._router.navigate([this._investorRoutesDictionary.sign_up]);
                      }
                    }, 0);
                    break;
                  case this._masterData.activationStepCodes['fill_information']:
                  case this._masterData.activationStepCodes['first_deposit']:
                    setTimeout(() => {
                      // Temporary remove -> Search for first-deposit-message to enable again
                      // this._notificationService.info(this._localStorageService.retrieve('first-deposit-message'));
                      this._router.navigate([this._investorRoutesDictionary.deposit]);
                    }, 0);
                    break;
                  case this._masterData.activationStepCodes['deposit']:
                    setTimeout(() => {
                      this._financeService
                        .getBalance()
                        .subscribe(
                          balance => {
                            if (balance.value >= this.firstMinumumDeposit) {
                              this._notificationService.info(this._localStorageService.retrieve('activation-message'));
                              this._router.navigate([this._investorRoutesDictionary.homepage]);
                            } else {
                              // Temporary remove -> Search for first-deposit-message to enable again
                              // this._notificationService.info(this._localStorageService.retrieve('first-deposit-message'));
                              this._router.navigate([this._investorRoutesDictionary.deposit]);
                            }
                          },
                          error => {
                            console.error('ERROR', error);
                          }
                        );
                    }, 0);
                    break;
                  case this._masterData.activationStepCodes['send_econtract']:
                  case this._masterData.activationStepCodes['sign_econtract']:
                    setTimeout(() => {
                      this._router.navigate([this._investorRoutesDictionary.homepage]);
                    }, 0);
                    break;
                  default:
                    setTimeout(() => {
                      this._router.navigate([this._investorRoutesDictionary.overview]);
                    }, 0);
                    break;
                }
                break;
              case 'MY':
                switch (this._authService.getActivationStepCode()) {
                  case '':
                  case this._masterData.activationStepCodes['null']:
                    setTimeout(() => {
                      this._notificationService.info(this._localStorageService.retrieve('unauthorized-message'));
                      this._router.navigate([this._investorRoutesDictionary.sign_up]);
                    }, 0);
                    break;
                  case this._masterData.activationStepCodes['fill_information']:
                    setTimeout(() => {
                      this._notificationService.info(this._localStorageService.retrieve('unauthorized-message'));
                      this._router.navigate([this._investorRoutesDictionary.deposit]);
                    }, 0);
                    break;
                  case this._masterData.activationStepCodes['first_deposit']:
                  case this._masterData.activationStepCodes['deposit']:
                  case this._masterData.activationStepCodes['send_econtract']:
                  case this._masterData.activationStepCodes['sign_econtract']:
                  case this._masterData.activationStepCodes['escrow_agent']:
                    setTimeout(() => {
                      this._notificationService.info(this._localStorageService.retrieve('unauthorized-message'));
                      this._router.navigate([this._investorRoutesDictionary.homepage]);
                    }, 0);
                    break;
                  default:
                    setTimeout(() => {
                      this._router.navigate([this._investorRoutesDictionary.overview]);
                    }, 0);
                    break;
                }
                break;
              case 'SG':
                switch (this._authService.getActivationStepCode()) {
                  case this._masterData.activationStepCodes['null']:
                    setTimeout(() => {
                      this._notificationService.info(this._localStorageService.retrieve('unauthorized-message'));
                      this._router.navigate([this._investorRoutesDictionary.sign_up]);
                    }, 0);
                    break;
                  case '':
                  case this._masterData.activationStepCodes['generic_questionnaire']:
                  case this._masterData.activationStepCodes['suitability_assessment_test']:
                    setTimeout(() => {
                      this._notificationService.info(this._localStorageService.retrieve('unauthorized-message'));
                      this._router.navigate([this._investorRoutesDictionary.subscription_agreement]);
                    }, 0);
                    break;
                  case this._masterData.activationStepCodes['fill_information']:
                  case this._masterData.activationStepCodes['send_econtract']:
                  case this._masterData.activationStepCodes['sign_econtract']:
                    setTimeout(() => {
                      this._notificationService.info(this._localStorageService.retrieve('unauthorized-message'));
                      this._router.navigate([this._investorRoutesDictionary.homepage]);
                    }, 0);
                    break;
                  case this._masterData.activationStepCodes['escrow_agent']:
                    setTimeout(() => {
                      this._notificationService.info(this._localStorageService.retrieve('unauthorized-message'));
                      this._router.navigate([this._investorRoutesDictionary.deposit]);
                    }, 0);
                    break;
                  case this._masterData.activationStepCodes['first_deposit']:
                  case this._masterData.activationStepCodes['deposit']:
                  default:
                    setTimeout(() => {
                      this._router.navigate([this._investorRoutesDictionary.overview]);
                    }, 0);
                    break;
                }
                break;
              case 'VN':
                switch (this._authService.getActivationStepCode()) {
                  case '':
                  case this._masterData.activationStepCodes['null']:
                  case this._masterData.activationStepCodes['generic_questionnaire']:
                  case this._masterData.activationStepCodes['suitability_assessment_test']:
                    setTimeout(() => {
                      this._notificationService.info(this._localStorageService.retrieve('unauthorized-message'));
                      this._router.navigate([this._investorRoutesDictionary.subscription_agreement]);
                    }, 0);
                    break;
                  case this._masterData.activationStepCodes['fill_information']:
                  case this._masterData.activationStepCodes['send_econtract']:
                  case this._masterData.activationStepCodes['sign_econtract']:
                    setTimeout(() => {
                      this._notificationService.info(this._localStorageService.retrieve('unauthorized-message'));
                      this._router.navigate([this._investorRoutesDictionary.homepage]);
                    }, 0);
                    break;
                  case this._masterData.activationStepCodes['escrow_agent']:
                    setTimeout(() => {
                      this._notificationService.info(this._localStorageService.retrieve('unauthorized-message'));
                      this._router.navigate([this._investorRoutesDictionary.deposit]);
                    }, 0);
                    break;
                  case this._masterData.activationStepCodes['first_deposit']:
                  case this._masterData.activationStepCodes['deposit']:
                  default:
                    setTimeout(() => {
                      this._router.navigate([this._investorRoutesDictionary.overview]);
                    }, 0);
                    break;
                }
                break;
            }
          }
          break;
        case this._masterData.memberTypeCodes['borrower']:
          if (!this._authService.getlastSignUpStepWeb()) {
            const body = {
              lastSignUpStepWeb: this._authService.getlastSignUpStepWeb()
            };
            if (body.lastSignUpStepWeb) {
              this.memberService.updateMember(body).subscribe(
                response => {
                  if (response.status === 'success') {
                    this._authService.setLastSignUStepWeb(this._authService.getlastSignUpStepWeb());
                  } else {
                    this._notificationService.error(response.message);
                  }
                },
                error => {
                  this._notificationService.error();
                });
            }
          } else {
            this.memberService.getMemberDetail().subscribe(
              response => {
                if (!this._authService.getlastSignUpStepWeb()) {
                  this._authService.setLastSignUStepWeb(response.lastSignUpStepWeb);
                }
                switch (this._authService.getlastSignUpStepWeb()) {
                  case this._masterData.lastSignUpWebStatus['accountVerification']:
                  case this._masterData.lastSignUpWebStatus['borrowerPersonalInformation']:
                  case this._masterData.lastSignUpWebStatus['borrowerBusinessInformation']:
                  case this._masterData.lastSignUpWebStatus['borrowerFinancialInformation']:
                    setTimeout(() => {
                      this._router.navigate([this._borrowerRoutesDictionary.sign_up]);
                    }, 0);
                    break;
                }
                if (!this._borrowerRoutes.find(element => { return element === sanitizedUrl })) {
                  setTimeout(() => {
                    this._router.navigate([this._borrowerRoutesDictionary.homepage]);
                  }, 0);
                }
              },
              error => {
                this._notificationService.error();
              }
            );
          }


      }
      return true;
    }
    setTimeout(() => {
      this._authService.logOut();
      this._router.navigate(['/log-in'], {
        queryParams: {
          redirect: this._securityService.encode(CONFIGURATION.encryption_key, url)
        }
      });
      return false;
    }, 0);
  }

  private _isBorrowerRouteAccessible(route: string): boolean {
    let found = this._securedBorrowerRoutes.find(securedBorrowerRoute => {
      return securedBorrowerRoute === route;
    });
    return found ? true : false;
  }

  private _isInvestorRouteAccessible(route: string): boolean {
    let found = this._securedInvestorRoutes.find(securedInvestorRoute => {
      return securedInvestorRoute === route;
    });
    return found ? true : false;
  }

  getBorrowerNavigation(): any {
    let navigation = {
      showMenu: false,
      menu: {
        homepage: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.homepage),
        new_loan: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.new_loan),
        overview: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.overview),
        referral: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.referral),
        repayment: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.repayment),
        partner: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.partner),
        statement: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.statement),
      },
      subMenu: {
        activity: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.activity),
        setting: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.setting)
      }
    };
    for (let key in navigation.menu) {
      if (navigation.menu[key]) {
        navigation.showMenu = true;
      }
    }

    return navigation;
  }

  getInvestorNavigation(): any {
    let navigation = {
      showMenu: false,
      menu: {
        browse_loan: this._isInvestorRouteAccessible(this._investorRoutesDictionary.browse_loan),
        deposit: this._isInvestorRouteAccessible(this._investorRoutesDictionary.deposit),
        deposit_fpx: this._isInvestorRouteAccessible(this._investorRoutesDictionary.deposit_fpx),
        homepage: this._isInvestorRouteAccessible(this._investorRoutesDictionary.homepage),
        overview: this._isInvestorRouteAccessible(this._investorRoutesDictionary.overview),
        portfolio: this._isInvestorRouteAccessible(this._investorRoutesDictionary.portfolio),
        referral: this._isInvestorRouteAccessible(this._investorRoutesDictionary.referral),
        sbn_retail: this._isInvestorRouteAccessible(this._investorRoutesDictionary.sbn_retail),
        rdn_activation: this._isInvestorRouteAccessible(this._investorRoutesDictionary.rdn_activation),
        statement: this._isInvestorRouteAccessible(this._investorRoutesDictionary.statement),
        subscription_agreement: this._isInvestorRouteAccessible(this._investorRoutesDictionary.subscription_agreement),
        withdrawal: this._isInvestorRouteAccessible(this._investorRoutesDictionary.withdrawal)
      },
      setting: {
        auto_investment: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.setting) && this._authService.isAdministrator(),
        bank: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.setting) && this._authService.isAdministrator(),
        password: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.setting) && this._authService.isAdministrator(),
        personal: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.setting) && this._authService.isAdministrator(),
        subaccount_password: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.setting) && !this._authService.isAdministrator(),
        suitability_assessment_test: this._isBorrowerRouteAccessible(this._borrowerRoutesDictionary.setting) && this._authService.isAdministrator() && CONFIGURATION.country_code === 'SG',
        subscription_agreement: this._isInvestorRouteAccessible(this._investorRoutesDictionary.setting)
          && this._authService.isAdministrator()
          && (CONFIGURATION.country_code === 'SG' || CONFIGURATION.country_code === 'MY')
      },
      subMenu: {
        activity: this._isInvestorRouteAccessible(this._investorRoutesDictionary.activity),
        setting: this._isInvestorRouteAccessible(this._investorRoutesDictionary.setting),
        setting_personal: this._isInvestorRouteAccessible(this._investorRoutesDictionary.setting_personal),
        setting_bank: this._isInvestorRouteAccessible(this._investorRoutesDictionary.setting_bank),
        setting_password: this._isInvestorRouteAccessible(this._investorRoutesDictionary.setting_password),
        setting_auto: this._isInvestorRouteAccessible(this._investorRoutesDictionary.setting_auto),
        setting_priority_investment:
          this._isInvestorRouteAccessible(this._investorRoutesDictionary.setting_priority_investment),
        setting_accredited_declaration: this._isInvestorRouteAccessible(this._investorRoutesDictionary.setting_accredited_declaration),
        setting_subscription_agreement: this._isInvestorRouteAccessible(this._investorRoutesDictionary.setting_subscription_agreement),
      }
    };
    for (let key in navigation.menu) {
      if (navigation.menu[key]) {
        navigation.showMenu = true;
      }
    }

    return navigation;
  }

  private _resetSecuredRoutes(): void {
    this._securedBorrowerRoutes = new Array<string>();
    this._securedBorrowerRoutes.push(this._borrowerRoutesDictionary.homepage);
    this._securedBorrowerRoutes.push(this._borrowerRoutesDictionary.partner);
    this._securedBorrowerRoutes.push(this._borrowerRoutesDictionary.activity);
    this._securedBorrowerRoutes.push(this._borrowerRoutesDictionary.new_loan);
    this._securedBorrowerRoutes.push(this._borrowerRoutesDictionary.overview);
    this._securedBorrowerRoutes.push(this._borrowerRoutesDictionary.referral);
    this._securedBorrowerRoutes.push(this._borrowerRoutesDictionary.repayment);
    this._securedBorrowerRoutes.push(this._borrowerRoutesDictionary.setting);
    this._securedBorrowerRoutes.push(this._borrowerRoutesDictionary.statement);

    this._securedInvestorRoutes = new Array<string>();
    switch (CONFIGURATION.country_code) {
      case 'ID':
        switch (this._authService.getActivationStepCode()) {
          case '':
          case this._masterData.activationStepCodes['null']:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.homepage);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.subscription_agreement);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.browse_loan);
            break;
          case this._masterData.activationStepCodes['fill_information']:
          case this._masterData.activationStepCodes['first_deposit']:
          case this._masterData.activationStepCodes['deposit']:
          case this._masterData.activationStepCodes['send_econtract']:
          case this._masterData.activationStepCodes['sign_econtract']:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.homepage);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.deposit);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.browse_loan);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.sbn_retail);
            break;
          case this._masterData.activationStepCodes['activated']:
          default:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.activity);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.overview);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.portfolio);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.referral);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.statement);
            if (this._authService.isAdministrator()) {
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.rdn_activation);
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.sbn_retail);
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.browse_loan);
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.deposit);
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.deposit_fpx);
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.withdrawal);
            }
            break;
        }
        break;
      case 'MY':
        switch (this._authService.getActivationStepCode()) {
          case '':
          case this._masterData.activationStepCodes['null']:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.homepage);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.subscription_agreement);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.browse_loan);
            break;
          case this._masterData.activationStepCodes['fill_information']:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.homepage);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.deposit);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_bank);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.browse_loan);
            break;
          case this._masterData.activationStepCodes['send_econtract']:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.homepage);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.deposit);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_bank);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_personal);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_auto);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_priority_investment);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_password);
            break;
          case this._masterData.activationStepCodes['first_deposit']:
          case this._masterData.activationStepCodes['deposit']:
          case this._masterData.activationStepCodes['send_econtract']:
          case this._masterData.activationStepCodes['sign_econtract']:
          case this._masterData.activationStepCodes['escrow_agent']:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.homepage);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.deposit);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.browse_loan);
            break;
          case this._masterData.activationStepCodes['activated']:
          default:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.activity);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.overview);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.portfolio);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.referral);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_password);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_auto);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_priority_investment);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_bank);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_personal);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_subscription_agreement);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.rdn_activation);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.statement);
            if (this._authService.isAdministrator()) {
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.browse_loan);
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.deposit);
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.deposit_fpx);
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.withdrawal);
            }
            break;
        }
        break;
      case 'SG':
        switch (this._authService.getActivationStepCode()) {
          case '':
          case this._masterData.activationStepCodes['null']:
          case this._masterData.activationStepCodes['generic_questionnaire']:
          case this._masterData.activationStepCodes['suitability_assessment_test']:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.homepage);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.subscription_agreement);
            break;
          case this._masterData.activationStepCodes['fill_information']:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.homepage);
            break;
          case this._masterData.activationStepCodes['send_econtract']:
          case this._masterData.activationStepCodes['sign_econtract']:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.homepage);
            break;
          case this._masterData.activationStepCodes['escrow_agent']:
          case this._masterData.activationStepCodes['first_deposit']:
          case this._masterData.activationStepCodes['deposit']:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.homepage);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.deposit);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.browse_loan);
            break;
          case this._masterData.activationStepCodes['activated']:
          default:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.activity);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.overview);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.portfolio);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.referral);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_password);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_personal);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_auto);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_accredited_declaration);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_bank);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_subscription_agreement);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.statement);
            if (this._authService.isAdministrator()) {
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.browse_loan);
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.deposit);
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.deposit_fpx);
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.withdrawal);
            }
            break;
        }
        break;
      case 'VN':
        switch (this._authService.getActivationStepCode()) {
          case '':
          case this._masterData.activationStepCodes['null']:
          case this._masterData.activationStepCodes['generic_questionnaire']:
          case this._masterData.activationStepCodes['suitability_assessment_test']:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.homepage);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.subscription_agreement);
            break;
          case this._masterData.activationStepCodes['fill_information']:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.homepage);
            break;
          case this._masterData.activationStepCodes['send_econtract']:
          case this._masterData.activationStepCodes['sign_econtract']:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.homepage);
            break;
          case this._masterData.activationStepCodes['escrow_agent']:
          case this._masterData.activationStepCodes['first_deposit']:
          case this._masterData.activationStepCodes['deposit']:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.homepage);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.deposit);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.browse_loan);
            break;
          case this._masterData.activationStepCodes['activated']:
          default:
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.activity);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.overview);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.portfolio);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.referral);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_password);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_personal);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_auto);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.setting_bank);
            this._securedInvestorRoutes.push(this._investorRoutesDictionary.statement);
            if (this._authService.isAdministrator()) {
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.browse_loan);
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.deposit);
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.deposit_fpx);
              this._securedInvestorRoutes.push(this._investorRoutesDictionary.withdrawal);
            }
            break;
        }
        break;
    }

    this.navigationEventEmitter.emit(true);
  }

  getRedirectUrl(encryptedUrl: string) {
    return this._securityService.decode(CONFIGURATION.encryption_key, encryptedUrl);
  }
}
