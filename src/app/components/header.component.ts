import { retryWhen, delay, take, throttleTime } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  Router
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage';
import { PasswordRestriction } from '../models/auth.class';
import { Activity } from '../models/finance.class';
import { ActivityService } from '../services/activity.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { CryptographyService } from '../services/cryptography.service';
import { DialogService } from '../services/dialog.service';
import { FinanceService } from '../services/finance.service';
import { MemberService } from '../services/member.service';
import { NotificationService } from '../services/notification.service';
import { ReferralService } from '../services/referral.service';
import { ScriptInjectorService } from '../services/script-injector.service';
import { UserService } from '../services/user.service';
import { ValidatorService } from '../services/validator.service';
import { ReviewAppService } from '../services/review-app.service';
import { UtilityService } from '../services/utility.service';
import { SecurityService } from '../services/security.service';
import { MenuService } from '../services/menu.service';
import { ENVIRONMENT } from '../../environments/environment';
import { EventService } from '../services/event.service';
import { LanguageService } from '../services/language.service';
import CONFIGURATION, { isReviewApp } from '../../configurations/configuration';
import { ZohoLead } from '../models/member.class';
import { TwoFaConfig } from '../components/two-fa/two-fa-common/two-fa-interface';
import { SessionStorageService } from 'ngx-webstorage';
import * as Raven from 'raven-js';

@Component({
  selector: 'header-section',
  templateUrl: './header.html'
})
export class HeaderComponent implements OnInit {
  baseUrls: any;
  blogLink: string;
  formModel: any;
  headerModel: any;
  howDidYouFindUsSourcesBorrower: Array<any>;
  howDidYouFindUsSourcesInvestor: Array<any>;
  memberModel: any;
  memberTypeCodes: any;
  modal: any;
  navigationAccess: any;
  countryFlagCode: string;
  countryName: string;
  referralProgram: boolean;
  selectedLogInMobile: string;
  showActivityBox: boolean;
  showMenuContainer: boolean;
  showMobileHeaderMenu: boolean;
  showMobileLeftNavMenu: boolean;
  showMobileLogIn: boolean;
  showMobileNavigation: boolean;
  showPublicNavigationBar: boolean;
  showReferBox: boolean;
  showServiceBox: boolean;
  _countryCode: string;
  _environment: string;
  countryCode: string;
  countries: Array<Object>;
  environments: Array<Object>;
  showReviewApp: Boolean;
  showBalanceCash: Boolean;
  showHelp: Boolean;
  showPrivacyNotice: Boolean;
  headerLogoClassNamePrefix: any;
  CONFIGURATION: any;
  zohoModel: ZohoLead;
  campaignParameter: string;
  excludeParameter: string;
  languageLabel: string;
  twoFaConfig: TwoFaConfig;
  // TEMPORARY CODE FOR OJK NEEDED
  showBalanceNote: boolean;
  // TEMPORARY CODE FOR OJK NEEDED
  redirectUrl: string;
  showWarning: boolean;

  public constructor(
    private _activatedRoute: ActivatedRoute,
    private _activityService: ActivityService,
    private _authService: AuthService,
    private _authGuardService: AuthGuard,
    private _cryptographyService: CryptographyService,
    private _dialogService: DialogService,
    private _financeService: FinanceService,
    private _formBuilder: FormBuilder,
    private _localStorageService: LocalStorageService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _referralService: ReferralService,
    private _renderer: Renderer2,
    private _router: Router,
    private _scriptInjectorService: ScriptInjectorService,
    private _translateService: TranslateService,
    private _userService: UserService,
    private _validatorService: ValidatorService,
    private _reviewAppService: ReviewAppService,
    private _utilityService: UtilityService,
    private _securityService: SecurityService,
    private _menuService: MenuService,
    private sanitizer: DomSanitizer,
    private _languageService: LanguageService,
    private _eventService: EventService,
    private _sessionStorageService: SessionStorageService,
  ) {
    this.CONFIGURATION = CONFIGURATION;
    this.baseUrls = ENVIRONMENT.baseUrls;
    this.countryFlagCode = CONFIGURATION.country_code.toLowerCase();
    this.countryCode = CONFIGURATION.country_code;
    this.headerLogoClassNamePrefix = CONFIGURATION.header_vertical_logo_classname_prefix;
    this.countryName = CONFIGURATION.country_name;
    this.referralProgram = CONFIGURATION.referProgram;
    this.showHelp = CONFIGURATION.help;
    this.showPrivacyNotice = CONFIGURATION.showPrivacyNotice;
    this.showReviewApp = isReviewApp();
    this.formModel = {
      activation: {
        error: ''
      },
      referral: {
        borrowerLink: window.location.origin + '/sign-up-borrower?referral=',
        code: '',
        copiedMessage: '',
        investorLink: window.location.origin + '/sign-up-investor?referral=',
        sharedTitle: ''
      },
      signUpBorrower: {
        accepted: true,
        catch: false,
        error: '',
        howDidYouFindUsOtherValid: true,
        memberTypeCode: CONFIGURATION.member_type_code.borrower,
        params: new Array<any>(),
        passwordRestrictions: new Array<PasswordRestriction>(),
        passwordValid: true,
        referralRemark: null,
        retypedPasswordMatches: true,
        showHowDidYouFindUsOther: false,
        success: '',
        validation: false,
        mobilePhoneValidation: false
      },
      signUpInvestor: {
        accepted: true,
        catch: false,
        error: '',
        howDidYouFindUsOtherValid: true,
        memberTypeCode: CONFIGURATION.member_type_code.investor,
        params: new Array<any>(),
        passwordRestrictions: new Array<PasswordRestriction>(),
        passwordValid: true,
        referralRemark: null,
        retypedPasswordMatches: true,
        showHowDidYouFindUsOther: false,
        subscribeNewsletter: false,
        success: '',
        validation: false,
        mobilePhoneValidation: false
      }
    };
    this.howDidYouFindUsSourcesBorrower = new Array<any>();
    this.howDidYouFindUsSourcesInvestor = new Array<any>();
    this.memberTypeCodes = CONFIGURATION.member_type_code;
    this.navigationAccess = null;
    this.showMobileLogIn = false;
    this.campaignParameter = null;
    this.excludeParameter = 'referral';
    this.languageLabel = this._languageService.getDefaultLanguageLabel(this._languageService.getDefaultLanguage());
    this.initialize();
    // TEMPORARY CODE FOR OJK NEEDED
    this.showBalanceNote = false;
    this.showWarning = false;
  }

  ngOnInit() {
    // TEMPORARY CODE FOR OJK NEEDED
    const includeUser = [
      'rahiej@gmail.com',
      'agus.darmali@gmail.com',
      'fel.ard@gmail.com'
    ];
    const userName = this._authService.getUserName();

    if ((includeUser.indexOf(userName) > -1)) {
      this.showBalanceNote = true;
    }
    // TEMPORARY CODE FOR OJK NEEDED

    if (this._localStorageService.retrieve('showappbanner') === null) {
      this._localStorageService.store('showappBanner', true);
    };

    this._activatedRoute
      .queryParams
      .subscribe((params: Params) => {
        if (params['redirect']) {
          this.redirectUrl = params['redirect'];
        }
      });

    this._activityService
      .activityEventEmitter
      .subscribe(
        response => {
          this.headerModel.activities = this._activityService.getRecentActivities();
        }
      );

    // This is needed as the the local storage it not updated with the latest language change
    this._languageService.languageChangeEventEmitter.subscribe(response => {
      this.languageLabel = this._languageService.getDefaultLanguageLabel(this._languageService.getDefaultLanguage());
    });

    this._authService
      .logInEventEmitter
      .subscribe(
        isLoggedIn => {
          this.headerModel.activities = new Array<Activity>();
          this.headerModel.isLoggedIn = isLoggedIn;
          this.showBalanceCash = this._authService.getMemberTypeCode() === this.memberTypeCodes.investor;
          if (!this.headerModel.isLoggedIn) {
            this.clearLogInSession();
          } else {
            this.getLogInDetails(false);
            if (this.showBalanceCash) {
              this._financeService.triggerBalanceRetrieval();
            }
          }
        }
      );


    this._authService
      .navigationEventEmitter
      .subscribe(
        showPublicNavigationBar => {
          this.showPublicNavigationBar = showPublicNavigationBar;
          setTimeout(() => {
            if (!showPublicNavigationBar) {
              this._scriptInjectorService.append(this._renderer,
                'dashboardnav_hype_generated_script',
                './assets/js/dashboard-nav.hyperesources/dashboardnav_hype_generated_script.js');
            } else {
              this._scriptInjectorService.remove(this._renderer, 'dashboardnav_hype_generated_script');
            }
          }, 0);
        }
      );

    this._authGuardService
      .navigationEventEmitter
      .subscribe(
        response => {
          // -- Logic to display the navigation
          this.navigationAccess = {
            borrower: this._authGuardService.getBorrowerNavigation(),
            investor: this._authGuardService.getInvestorNavigation()
          };
        }
      );

    this._dialogService
      .activationDialogEventEmitter
      .subscribe(
        response => {
          const userName = response['username'];
          const countryId = response['country_id'];
          const token = response['token'];

          if (userName && countryId && token) {
            this._memberService.v2Activate(countryId, userName, token).subscribe(
              memberActivatedResponse => {
                if (memberActivatedResponse.data.memberTypeCode === CONFIGURATION.member_type_code.investor) {
                  this._eventService.sendInvSignupEvent('INV-email-verified');
                } else if (memberActivatedResponse.data.memberTypeCode === CONFIGURATION.member_type_code.borrower &&
                  this.CONFIGURATION.country_code !== 'ID') {
                  this._eventService.sendBrwSignupEvent('BRW-email-verified');
                }
                this.showModal('ACTIVATION-SUCCESS');
              },
              error => {
                this.formModel.activation.error = error.message;
                this.showModal('ACTIVATION-FAILED');
              }
            );
          } else {
            this.showModal('ACTIVATION-FAILED');
          }
        }
      );

    this._dialogService
      .logInDialogEventEmitter
      .subscribe(
        response => {
          this.showModal('LOG-IN');
        }
      );

    this._dialogService
      .twoFalogInDialogEventEmitter
      .subscribe(
        twoFaData => {
          this.showModal('TWO-FA-LOG-IN', twoFaData);
        }
      );

    this._memberService
      .memberStatusEventEmitter
      .subscribe(
        response => {
          if (this.countryCode === 'SG') {
            this.showWarning = this._localStorageService.retrieve('reverification');
          }
        }
      );

    this._dialogService
      .closeAllDialogEventEmitter
      .subscribe(
        response => {
          this.closeAllModals();
        }
      );

    this._financeService
      .balanceEventEmitter
      .subscribe(
        response => {
          this._financeService
            .getBalance()
            .subscribe(
              balance => {
                this.memberModel.balance = balance.value;
              },
              error => {
                console.error('ERROR', error);
              }
            );
        }
      );

    this._menuService
      .menuEventEmitter
      .subscribe(
        response => {
          this.toggleMenu();
        }
      );

    this._router
      .events
      .subscribe((e) => {
        if (e instanceof NavigationEnd) {
          if (this.getMemberTypeCode() !== '') {
            this._authService.setLogIn(true);
          } else {
            this.clearLogInSession(e.url.indexOf('admin-investor') >= 0 || e.url.indexOf('admin-borrower') >= 0);
          }
        }
      });

    this._translateService
      .get('master.how-did-you-find-us-sources.sign-up-borrower')
      .subscribe(
        howDidYouFindUsSourcesBorrower => {
          for (let data of howDidYouFindUsSourcesBorrower) {
            this.howDidYouFindUsSourcesBorrower.push({
              key: data['key'],
              value: data['value']
            });
          }
        }
      );

    this._translateService
      .get('master.how-did-you-find-us-sources.sign-up-investor')
      .subscribe(
        howDidYouFindUsSourcesInvestor => {
          for (let data of howDidYouFindUsSourcesInvestor) {
            this.howDidYouFindUsSourcesInvestor.push({
              key: data['key'],
              value: data['value']
            });
          }
        }
      );

    this._translateService
      .get('referral')
      .subscribe(
        labels => {
          this.formModel.referral.copiedMessage = labels['copied'];
          this.formModel.referral.sharedTitle = labels['shared-title'];
        }
      );

    this._authService
      .twoFaLoginEventEmitter
      .subscribe(
        twoFaLogIn => {
          this.onTwoFaLogin();
        }
      );
  }

  // baseUrls are assumed in the right order for each environment in different country settings
  changeLanguage(countryCode: string, languageCode: string, urls: any): void {
    const baseUrls = urls || this.baseUrls;
    let index = -1;
    // Check index of baseUrls
    for (const country of Object.keys(baseUrls)) {
      const curUrlIndex = baseUrls[country].indexOf(window.location.host);
      if (curUrlIndex > -1) {
        index = curUrlIndex;
      }
    }
    if (index > -1) {
      const newCountryUrl = window.location.protocol + '//' + baseUrls[countryCode][index] + '/?lang=' + languageCode;
      window.location.href = newCountryUrl;
    } else {
      console.error('Could not find url for the country.');
    }
  }

  clearLogInSession(navigateToHome: boolean = true): void {
    this.initialize();
    this.showMenuContainer = false;
    try {
      delete window['HYPE']['documents']['dashboard-nav'];
    } catch (e) {
    }

    if (navigateToHome) {
      this._router.navigate(['/']);
    }
  }

  onClickCloseAllModals(): void {
    this._router.navigateByUrl('');
    this.closeAllModals();
  }

  closeAllModals(excludedModal?: string): void {
    this.modal.open = false;
    // Borrowed from modal.component close() method
    this._renderer.removeClass(document.body, 'modal-open-fix-for-ios');
    Object.keys(this.modal).forEach(key => {
      this.modal[key] = excludedModal === key;
    });
  }

  closeServiceBox() {
    this.showServiceBox = false;
  }

  getFullname(): string {
    if (this.headerModel.isLoggedIn) {
      return 'Welcome, ' + this.memberModel.fullName;
    } else {
      return 'Log In';
    }
  }

  getLogInDetails(navigateToDashboard: boolean, loginResponse: any = null): void {
    this._memberService
      .getLoginDetail()
      .subscribe(
        member => {
          if (loginResponse) {
            this._authService.logIn(
              member.memberTypeName,
              String(member.id),
              member.userName,
              this._authService.getMemberUUID()
            );
          }
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
              this._financeService
                .getDeposit()
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
                        subaccount ? subaccount.userName : "NULL",
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
                        subaccount ? subaccount.userName : "NULL",
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
                  subaccount ? subaccount.userName : "NULL",
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
            this._localStorageService.store('fullname', this.memberModel.fullName);
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

  getMemberTypeCode() {
    return this._authService.getMemberTypeCode();
  }

  goToActivities() {
    this.showActivityBox = false;
    switch (this.getMemberTypeCode()) {
      case this.formModel.signUpInvestor.memberTypeCode:
        this._router.navigate(['/admin-investor/activity']);
        break;
      case this.formModel.signUpBorrower.memberTypeCode:
        this._router.navigate(['/admin-borrower/activity']);
        break;
    }
  }

  goToSetting() {
    this.reverseMenuButton();
    switch (this.getMemberTypeCode()) {
      case this.formModel.signUpInvestor.memberTypeCode:
        this._router.navigate(['/admin-investor/setting']);
        break;
      case this.formModel.signUpBorrower.memberTypeCode:
        this._router.navigate(['/admin-borrower/setting']);
        break;
    }
  }

  goToHelp() {
    switch (this.getMemberTypeCode()) {
      case this.formModel.signUpInvestor.memberTypeCode:
        this.navigateToUrl(CONFIGURATION.reference.intercom_help_investor);
        break;
      case this.formModel.signUpBorrower.memberTypeCode:
        this.navigateToUrl(CONFIGURATION.reference.intercom_help_borrower);
        break;
      // Help on public page
      default:
        this.navigateToUrl(CONFIGURATION.reference.intercom_help);
    }
  }

  initialize(): void {
    if (this.showReviewApp) {
      this.countries = this._reviewAppService.getCountries();
      this.environments = this._reviewAppService.getEnvironments();
      this._countryCode = this._reviewAppService.getCountry();
      this._environment = this._reviewAppService.getEnvironment();
      if (!this._reviewAppService.getEnvironments()) {
        this._reviewAppService.changeEnvironment(this._reviewAppService.defaultEnvironment);
      }
    }
    this.headerModel = {
      activities: new Array<Activity>(),
      environmentName: ENVIRONMENT.environment_name,
      isLoggedIn: false,
      isProduction: (ENVIRONMENT.environment_name === 'production'),
      showReviewApp: this.showReviewApp
    };
    this.memberModel = {
      balance: 0,
      currency: CONFIGURATION.currency_symbol,
      currencyFormat: CONFIGURATION.format.decimal,
      localeFormat: CONFIGURATION.format.locale,
      fullName: '',
      userName: ''
    };
    this.modal = {
      activationFailed: false,
      activationSuccess: false,
      borrowerSignUp: false,
      changeLanguage: false,
      investorSignUp: false,
      signUp: false
    };
    this.selectedLogInMobile = 'signUp';
    this.showActivityBox = false;
    this.showMenuContainer = false;
    this.showMobileHeaderMenu = false;
    this.showMobileLeftNavMenu = false;
    this.showMobileNavigation = false;
    this.showPublicNavigationBar = true;
    this.showReferBox = false;
    this.showServiceBox = false;
  }

  goToBlog() {
    window.open(this.blogLink, '_blank');
  }

  logOut(): void {
    this._userService.logOut().pipe(retryWhen(errors => errors.pipe(delay(3000), take(2)))).subscribe(
      res => { }
    );
    this._authService.logOut();
    this.goToFeedback(null);
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
    this.closeAllModals();
  }

  navigateToUrl(url: string): void {
    window.open(url, '_blank');
  }

  onCopyToClipboard(): void {
    this._notificationService.success(this.formModel.referral.copiedMessage);
  }

  onCountrySelectionChange(e): void {
    this._reviewAppService.changeCountry(e.srcElement.selectedOptions[0].value);
    window.location.reload();
  }

  onEnvironmentSelectionChange(e): void {
    this._reviewAppService.changeEnvironment(e.srcElement.selectedOptions[0].value);
    window.location.reload();
  }

  openMobileHeaderMenu() {
    this.showMobileHeaderMenu = !this.showMobileHeaderMenu;
    this.showMobileNavigation = true;
    this.showMobileLogIn = false;
  }

  parseFullName(fullName: string): string {
    var parsed = '';
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

  reverseMenuButton(): void {
    const dom = window['HYPE']['documents']['dashboard-nav'];
    dom.startTimelineNamed('Main Timeline back', dom.kDirectionReverse);
    this.showMenuContainer = false;
  }

  forwardMenuButton(): void {
    const dom = window['HYPE']['documents']['dashboard-nav'];
    dom.startTimelineNamed('Main Timeline back', dom.kDirectionForward);
    this.showMenuContainer = true;
  }

  toggleMenu() {
    const dom = window['HYPE']['documents']['dashboard-nav'];
    if (!dom.isPlayingTimelineNamed('Main Timeline back')) {
      // To make sure that the animation completed before we trigger
      // else the animation will stuck if there are multiple triggers
      if (this.showMenuContainer) {
        this.reverseMenuButton();
      } else {
        this.forwardMenuButton();
      }
      this.showActivityBox = false;
      this.showReferBox = false;
    }
  }

  share(platform: string): void {
    let referralLink = this.getMemberTypeCode() === this.memberTypeCodes.investor ?
      this.formModel.referral.investorLink + this.formModel.referral.code :
      this.formModel.referral.borrowerLink + this.formModel.referral.code;
    let sharedMessage = '';
    switch (platform) {
      case 'facebook':
        this._referralService.shareOnFacebook(referralLink);
        break;
      case 'google-plus':
        this._referralService.shareOnGooglePlus(referralLink);
        break;
      case 'linked-in':
        this._referralService.shareOnLinkedIn(referralLink, this.formModel.referral.sharedTitle);
        break;
      case 'twitter':
        this._referralService.shareOnTwitter(referralLink);
        break;
    }
  }

  showModal(type: string, optionalData?: any) {
    this.closeAllModals(type);
    this.modal.open = true;
    // Borrrowed from modal.component open method
    this._renderer.addClass(document.body, 'modal-open-fix-for-ios');
    switch (type) {
      case 'ACTIVATION-FAILED':
        this.modal.activationFailed = true;
        break;
      case 'ACTIVATION-SUCCESS':
        this.modal.activationSuccess = true;
        break;
      case 'CHANGE-LANGUAGE':
        this.modal.changeLanguage = true;
        break;
      case 'TWO-FA-LOG-IN':
        // TODO: Refractor this code
        const twoFaConfig = new TwoFaConfig('LOG-IN');
        this.twoFaConfig = Object.assign(twoFaConfig, optionalData);
        this.modal.twoFalogIn = true;
        break;
    }
  }

  toggleServiceBox() {
    this.showServiceBox = !this.showServiceBox;
  }

  goToStatement() {
    this.reverseMenuButton();
    switch (this.getMemberTypeCode()) {
      case this.formModel.signUpInvestor.memberTypeCode:
        this._router.navigate(['/admin-investor/statement']);
        break;
      case this.formModel.signUpBorrower.memberTypeCode:
        this._router.navigate(['/admin-borrower/statement']);
        break;
    }
  }

  goToFeedback(event: any) {
    this._router.navigate(['/response'], {
      queryParams: {
        feedback: true
      }
    });
  }

  getBorrowerMobilePhoneValidation(validation: boolean) {
    this.formModel.signUpBorrower.mobilePhoneValidation = !validation;
  }


  getInvestorMobilePhoneValidation(validation: boolean) {
    this.formModel.signUpInvestor.mobilePhoneValidation = !validation;
  }

  onTwoFaLogin(): void {
    const pass = this._authService.getTwoFaLoginPass();
    const userName = this._authService.getSignUpCredential().userName;
    const otpChannel = '';
    if (!this.headerModel.isLoggedIn) {
      this._cryptographyService
        .regeneratePublicKey()
        .then(response => {
          this._userService
            .logIn(
              userName,
              this._cryptographyService.encrypt(pass),
              this._cryptographyService.getUuid(),
              otpChannel
            ).subscribe(
              loginResponse => {
                this.onLogIn(loginResponse);
              },
              errorResponse => {
                this._notificationService.error();
              }
            );
        })
        .catch(error => {
          this._notificationService.error();
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
    this._authService.setRememberMe(true);
    this.getLogInDetails(true, onLogInResponse);
  }

}
