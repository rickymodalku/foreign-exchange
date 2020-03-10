import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import CONFIGURATION from '../../../../configurations/configuration';
import { ZohoLead } from '../../../models/member.class';
import { PasswordRestriction } from '../../../models/auth.class';
import { TranslateService } from '@ngx-translate/core';
import { TwoFaPhoneNumberConfig } from '../../../components/two-fa/two-fa-common/two-fa-interface';
import { MemberService } from '../../../services/member.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { UtilityService } from '../../../services/utility.service';
import { EventService } from '../../../services/event.service';
import { FeatureFlagService } from '../../../services/feature-flag.service';
import { CryptographyService } from '../../../services/cryptography.service';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'standalone-sign-up',
  templateUrl: './sign-up.html'
})
export class SignUpComponent implements OnInit {
  activeView: string;
  memberTypeCodes: any;

  formModel: any;
  forgotPasswordForm: FormGroup;
  headerModel: any;
  howDidYouFindUsSourcesBorrower: Array<any>;
  howDidYouFindUsSourcesInvestor: Array<any>;
  logInModel: any;
  memberModel: any;
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
  signUpBorrowerForm: FormGroup;
  signUpInvestorForm: FormGroup;
  countryCode: string;
  countries: Array<Object>;
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
  investorPhoneNumberConfig: TwoFaPhoneNumberConfig;
  borrowerPhoneNumberConfig: TwoFaPhoneNumberConfig;
  featureFlagObservable: Observable<any>;
  enableFormStackId: boolean;
  investorSignUpSource: string;
  disabledInvestorHowDidYouFindUs: boolean;
  idFormStackUrl: any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _translateService: TranslateService,
    private _authService: AuthService,
    private _cryptographyService: CryptographyService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _eventService: EventService,
    private _utilityService: UtilityService,
    private featureFlagService: FeatureFlagService,
    private _domSanitizer: DomSanitizer,
  ) {
    this.idFormStackUrl = this._domSanitizer.bypassSecurityTrustResourceUrl('https://modalku.formstack.com/forms/borrow_id');
    this.enableFormStackId = false;
    this.CONFIGURATION = CONFIGURATION;
    this.showPrivacyNotice = CONFIGURATION.showPrivacyNotice;
    this.activeView = 'sign-up';
    this.countryCode = CONFIGURATION.country_code;
    this.memberTypeCodes = CONFIGURATION.member_type_code;
    this.formModel = {
      referral: {
        borrowerLink: window.location.origin + '/sign-up-borrower?referral=',
        code: '',
        copiedMessage: '',
        investorLink: window.location.origin + '/sign-up-investor?referral=',
        sharedTitle: ''
      },
      zoho: {
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
        utmTerm: '',
        utmContent: ''
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
    this.signUpBorrowerForm = this._formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      fullName: new FormControl(null, [Validators.required]),
      howDidYouFindUs: new FormControl(null, [Validators.required]),
      howDidYouFindUsOther: new FormControl(null, []),
      mobilePhoneNumber: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      referralRemark: new FormControl(null, []),
      retypedPassword: new FormControl(null, [Validators.required])
    });
    this.signUpInvestorForm = this._formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      fullName: new FormControl(null, [Validators.required]),
      howDidYouFindUs: new FormControl(null, [Validators.required]),
      howDidYouFindUsOther: new FormControl(null, []),
      mobilePhoneNumber: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      referralRemark: new FormControl(null, []),
      retypedPassword: new FormControl(null, [Validators.required])
    });
    this.excludeParameter = 'referral';
    this.investorPhoneNumberConfig = {
      mode: 'ANY',
      allowDropDown: true,
      mobilePhoneNumber: '',
      autoPlaceholder: 'polite'
    };

    this.borrowerPhoneNumberConfig = {
      mode: 'ANY',
      allowDropDown: true,
      mobilePhoneNumber: '',
      // onlyCountries: [(this.countryCode.toLowerCase())],
      autoPlaceholder: 'polite'
    };
    this.disabledInvestorHowDidYouFindUs = false;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this._activatedRoute
      .params
      .subscribe((params: Params) => {
        const isSignUp = this._router.url.includes('/sign-up');
        if (isSignUp && params['member-type']) {
          this.activeView = this.memberTypeCodes[params['member-type'].toLowerCase()];
        } else if (this._router.url.includes('/sign-up-investor')) {
          this.activeView = this.memberTypeCodes['investor'].toLowerCase();
          this.investorSignUpSource = localStorage.getItem('source');
        } else if (this._router.url.includes('/sign-up-borrower')) {
          this.activeView = this.memberTypeCodes['borrower'].toLowerCase();
        } else {
          this.activeView = 'sign-up';
        }
        this._activatedRoute
          .queryParams
          .subscribe((params: Params) => {
            this.formModel.signUpBorrower.params = params;
            this.formModel.signUpInvestor.params = params;
            if (params['referral']) {
              this.formModel.signUpBorrower.referralRemark = params['referral'];
              this.formModel.signUpInvestor.referralRemark = params['referral'];
              this.patchReferralRemark();
            }
            this.formModel.zoho.utmSource = params['utm_source'];
            this.formModel.zoho.utmMedium = params['utm_medium'];
            this.formModel.zoho.utmCampaign = params['utm_campaign'];
            this.formModel.zoho.utmTerm = params['utm_term'];
            this.formModel.zoho.utmContent = params['utm_content'];
          });
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
          if (localStorage.getItem('source')) {
            this.disabledInvestorHowDidYouFindUs = true;
            this.formModel.signUpInvestor.howDidYouFindUsOtherValue = localStorage.getItem('source');
          }
        }
      );


    this._translateService
      .get('master.password-restrictions')
      .subscribe(
        passwordRestrictions => {
          passwordRestrictions.forEach(passwordRestriction => {
            this.formModel.signUpInvestor.passwordRestrictions.push(<PasswordRestriction>({
              label: passwordRestriction.label,
              regex: new RegExp(passwordRestriction.regex),
              valid: true
            }));
            this.formModel.signUpBorrower.passwordRestrictions.push(<PasswordRestriction>({
              label: passwordRestriction.label,
              regex: new RegExp(passwordRestriction.regex),
              valid: true
            }));
          });
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

    this._translateService
      .get('form.sign-up-borrower')
      .subscribe(
        signUpBorrower => {
          this.formModel.signUpBorrower.error = signUpBorrower.error;
          this.formModel.signUpBorrower.success = signUpBorrower.success;
        }
      );

    this._translateService
      .get('form.sign-up-investor')
      .subscribe(
        signUpInvestor => {
          this.formModel.signUpInvestor.error = signUpInvestor.error;
          this.formModel.signUpInvestor.success = signUpInvestor.success;
        }
      );
    const { idFormStackBorrower } = this.featureFlagService.getFeatureFlagKeys();
    this.featureFlagObservable = this.featureFlagService.getFeatureFlagObservable();
    this.featureFlagObservable.subscribe((flags) => {
      this.enableFormStackId = flags[idFormStackBorrower];
    });
  }

  onBorrowerHowDidYouFindUsChange(value: string): void {
    this.formModel.signUpBorrower.showHowDidYouFindUsOther = (value === 'Others' || value === 'Blogs' || value === 'News Articles' || value === 'Events' || value === 'Friends & relatives');
  }

  onInvestorHowDidYouFindUsChange(value: string): void {
    this.formModel.signUpInvestor.showHowDidYouFindUsOther = (value === 'Others' || value === 'Blogs' || value === 'News Articles' || value === 'Events' || value === 'Friends & relatives');
  }

  onSignUpBorrowerFormAccept(event: any): void {
    this.formModel.signUpBorrower.accepted = event.checked;
  }

  patchPhoneNumber(phoneNumber: string, membertype: string) {
    if (membertype === CONFIGURATION.member_type_code.borrower) {
      this.signUpBorrowerForm.patchValue({
        mobilePhoneNumber: phoneNumber
      });
    } else if (membertype === CONFIGURATION.member_type_code.investor) {
      this.signUpInvestorForm.patchValue({
        mobilePhoneNumber: phoneNumber
      });
    }
  }

  onSignUpBorrowerFormSubmit(): void {
    this.onSignUpBorrowerTypePassword();
    this.formModel.signUpBorrower.catch = false;
    this.formModel.signUpBorrower.howDidYouFindUsOtherValid = !this.formModel.signUpBorrower.showHowDidYouFindUsOther || (this.formModel.signUpBorrower.showHowDidYouFindUsOther && this.signUpBorrowerForm.value.howDidYouFindUsOther && this.signUpBorrowerForm.value.howDidYouFindUsOther.length > 0);
    this.formModel.signUpBorrower.retypedPasswordMatches = (this.signUpBorrowerForm.value.password === this.signUpBorrowerForm.value.retypedPassword);
    this.formModel.signUpBorrower.validation = true;
    if (
      this.formModel.signUpBorrower.howDidYouFindUsOtherValid &&
      this.formModel.signUpBorrower.passwordValid &&
      this.formModel.signUpBorrower.retypedPasswordMatches &&
      this.formModel.signUpBorrower.mobilePhoneValidation &&
      this.signUpBorrowerForm.valid
    ) {
      if (Object.keys(this.formModel.signUpBorrower.params).length > 0) {
        this.campaignParameter = JSON.stringify(this._utilityService.getCampaignParameter(this.formModel.signUpBorrower.params, this.excludeParameter));
      }
      if (CONFIGURATION.country_code === 'MY' || CONFIGURATION.country_code === 'SG') {
        this.zohoModel = {
          companyName: '',
          companyRevenue: 0,
          companyType: '',
          contactNumber: this.signUpBorrowerForm.value.mobilePhoneNumber,
          mobile_phone_number: this.signUpBorrowerForm.value.mobilePhoneNumber,
          countryId: CONFIGURATION.country_code,
          email: this.signUpBorrowerForm.value.email,
          fullName: this.signUpBorrowerForm.value.fullName,
          gclid: '',
          utmSource: this.formModel.zoho.utmSource,
          utmMedium: this.formModel.zoho.utmMedium,
          utmCampaign: this.formModel.zoho.utmCampaign,
          utmTerm: this.formModel.zoho.utmTerm,
          utmContent: this.formModel.zoho.utmContent,
          leadType: 'BORROWER',
          loanAmount: 0,
          loanTenor: '0',
          notes: 'How did you find us : ' +
            this.signUpBorrowerForm.value.howDidYouFindUs + (this.signUpBorrowerForm.value.showHowDidYouFindUsOther ?
              ' - ' + this.signUpBorrowerForm.value.howDidYouFindUsOther : ''),
          pic: 'FRONT_END',
          howDidYouFindUs: this.signUpBorrowerForm.value.howDidYouFindUs,
          howDidYouFindUsDetails: this.formModel.signUpBorrower.showHowDidYouFindUsOther ? this.signUpBorrowerForm.value.howDidYouFindUsOther : '',
          zohoLeadsOwnerId: CONFIGURATION.zoho_leads_owner_id,
          zohoLeadsOwner: CONFIGURATION.zoho_leads_owner,
          zoho_leads_source: CONFIGURATION.zoho_leads_source_signup,
        };
        this._memberService
          .addLead(this.zohoModel).subscribe(
            response => { },
            error => {
              console.log(error);
            }
          );

      }
      this.signUpBorrowerForm.controls['referralRemark'].enable();
      this._cryptographyService
        .regeneratePublicKey()
        .then(response => {
          let signupData = {
            "country_id": CONFIGURATION.country_code,
            "member_type_code": this.formModel.signUpBorrower.memberTypeCode,
            "username": this.signUpBorrowerForm.value.email,
            "fullname": this.signUpBorrowerForm.value.fullName,
            "password": this._cryptographyService.encrypt(this.signUpBorrowerForm.value.password),
            "mobile_phone_number": this.signUpBorrowerForm.value.mobilePhoneNumber,
            "how_did_you_find_us": this.signUpBorrowerForm.value.howDidYouFindUs + (this.formModel.signUpBorrower.showHowDidYouFindUsOther ? ' - ' + this.signUpBorrowerForm.value.howDidYouFindUsOther : ''),
            "referral_remark": this.signUpBorrowerForm.value.referralRemark,
            "subscribe_newsletter": false,
            "uuid": this._cryptographyService.getUuid()
          };
          if (this.campaignParameter != null) {
            signupData['campaign_parameters'] = this.campaignParameter;
          }
          this._memberService
            .signUp(signupData)
            .subscribe(
              response => {
                this.formModel.signUpBorrower.accepted = true;
                this.formModel.signUpBorrower.catch = false;
                this.formModel.signUpBorrower.howDidYouFindUsOtherValid = true;
                this.formModel.signUpBorrower.passwordValid = true;
                this.formModel.signUpBorrower.retypedPasswordMatches = true;
                this.formModel.signUpBorrower.showHowDidYouFindUsOther = false;
                this.formModel.signUpBorrower.validation = false;
                this._authService.setTwoFaLogin(this.signUpBorrowerForm.value.password);
                this._authService.setSignUpCredential(response.data.userName, response.data.token, this.formModel.signUpBorrower.memberTypeCode);
                this._eventService.sendBrwSignupEvent("BRW-register");
                this._router.navigate(['/sign-up/forms/borrower']);
                if (this._router.url.indexOf('/sign-up/forms/borrower') >= 0) {
                  window.location.reload();
                }
              },
              error => {
                this.formModel.signUpBorrower.catch = true;
                this._notificationService.error(error.message);
                if (this.formModel.signUpBorrower.params.referral) {
                  this.signUpBorrowerForm.controls['referralRemark'].disable();
                }
              }
            );
        })
        .catch(error => {
          this.formModel.signUpBorrower.catch = true;
          this._notificationService.error(error.message);
          if (this.formModel.signUpBorrower.params.referral) {
            this.signUpBorrowerForm.controls['referralRemark'].disable();
          }
        });
    }
  }

  onSignUpBorrowerRetypePassword(): void {
    this.formModel.signUpBorrower.retypedPasswordMatches = (this.signUpBorrowerForm.value.password === this.signUpBorrowerForm.value.retypedPassword);
  }

  onSignUpBorrowerTypePassword(): void {
    let password = this.signUpBorrowerForm.value.password;
    this.formModel.signUpBorrower.passwordValid = true;
    this.formModel.signUpBorrower.passwordRestrictions
      .forEach(passwordRestriction => {
        passwordRestriction.valid = passwordRestriction.regex.test(password);
        if (!passwordRestriction.valid) {
          this.formModel.signUpBorrower.passwordValid = false;
        }
      });
  }

  onSignUpInvestorFormAccept(event: any): void {
    this.formModel.signUpInvestor.accepted = event.checked;
  }

  onSignUpInvestorFormSubscribeNewsLetter(event: any): void {
    this.formModel.signUpInvestor.subscribeNewsletter = event.checked;
  }

  onSignUpInvestorFormSubmit(): void {
    this.onSignUpInvestorTypePassword();
    this.formModel.signUpInvestor.catch = false;
    this.formModel.signUpInvestor.howDidYouFindUsOtherValid = !this.formModel.signUpInvestor.showHowDidYouFindUsOther || (this.formModel.signUpInvestor.showHowDidYouFindUsOther && this.signUpInvestorForm.value.howDidYouFindUsOther && this.signUpInvestorForm.value.howDidYouFindUsOther.length > 0);
    this.formModel.signUpInvestor.retypedPasswordMatches = (this.signUpInvestorForm.value.password === this.signUpInvestorForm.value.retypedPassword);
    this.formModel.signUpInvestor.validation = true;
    const investorHowDidYouFindUs = this.signUpInvestorForm.value.howDidYouFindUs + (this.formModel.signUpInvestor.showHowDidYouFindUsOther ? ' - ' + this.signUpInvestorForm.value.howDidYouFindUsOther : '');

    if (
      this.formModel.signUpInvestor.howDidYouFindUsOtherValid &&
      this.formModel.signUpInvestor.passwordValid &&
      this.formModel.signUpInvestor.retypedPasswordMatches &&
      this.formModel.signUpInvestor.mobilePhoneValidation &&
      this.signUpInvestorForm.valid
    ) {
      if (Object.keys(this.formModel.signUpInvestor.params).length > 0) {
        this.campaignParameter = JSON.stringify(this._utilityService.getCampaignParameter(this.formModel.signUpInvestor.params, this.excludeParameter));
      }
      this.signUpInvestorForm.controls['referralRemark'].enable();
      this._cryptographyService
        .regeneratePublicKey()
        .then(response => {
          let signupData = {
            "country_id": CONFIGURATION.country_code,
            "member_type_code": this.formModel.signUpInvestor.memberTypeCode,
            "username": this.signUpInvestorForm.value.email,
            "fullname": this.signUpInvestorForm.value.fullName,
            "password": this._cryptographyService.encrypt(this.signUpInvestorForm.value.password),
            "mobile_phone_number": this.signUpInvestorForm.value.mobilePhoneNumber,
            "how_did_you_find_us": investorHowDidYouFindUs,
            "referral_remark": this.signUpInvestorForm.value.referralRemark,
            "subscribe_newsletter": this.formModel.signUpInvestor.subscribeNewsletter,
            "uuid": this._cryptographyService.getUuid()
          };
          if (this.campaignParameter != null) {
            signupData['campaign_parameters'] = this.campaignParameter;
          }
          this._memberService
            .signUp(signupData)
            .subscribe(
              response => {
                this._eventService.sendInvSignupEvent('INV-register',
                  {
                    'How Did You Find Us': investorHowDidYouFindUs
                  }
                );
                this.formModel.signUpInvestor.accepted = true;
                this.formModel.signUpInvestor.catch = false;
                this.formModel.signUpInvestor.howDidYouFindUsOtherValid = true;
                this.formModel.signUpInvestor.passwordValid = true;
                this.formModel.signUpInvestor.retypedPasswordMatches = true;
                this.formModel.signUpInvestor.showHowDidYouFindUsOther = false;
                this.formModel.signUpInvestor.validation = false;
                this._authService.setSignUpCredential(response.data.userName, response.data.token, this.formModel.signUpInvestor.memberTypeCode);
                this._authService.setTwoFaLogin(this.signUpInvestorForm.value.password);
                this._router.navigate(['/sign-up/forms/investor']);
                if (this._router.url.indexOf('/sign-up/forms/investor') >= 0) {
                  window.location.reload();
                }
              },
              error => {
                this.formModel.signUpInvestor.catch = true;
                // Throwing a more generic error for system error
                // example, "Failed to decrypt password" from member service
                if (error.status === 500) {
                  this._notificationService.error();
                } else {
                  this._notificationService.error(error.message);
                }
                if (this.formModel.signUpInvestor.params.referral) {
                  this.signUpInvestorForm.controls['referralRemark'].disable();
                }
              }
            );
        })
        .catch(error => {
          this.formModel.signUpInvestor.catch = true;
          this._notificationService.error(error.message);
          if (this.formModel.signUpInvestor.params.referral) {
            this.signUpInvestorForm.controls['referralRemark'].disable();
          }
        });

    }
  }

  onSignUpInvestorRetypePassword(): void {
    this.formModel.signUpInvestor.retypedPasswordMatches = (this.signUpInvestorForm.value.password === this.signUpInvestorForm.value.retypedPassword);
  }

  onSignUpInvestorTypePassword(): void {
    let password = this.signUpInvestorForm.value.password;
    this.formModel.signUpInvestor.passwordValid = true;
    this.formModel.signUpInvestor.passwordRestrictions
      .forEach(passwordRestriction => {
        passwordRestriction.valid = passwordRestriction.regex.test(password);
        if (!passwordRestriction.valid) {
          this.formModel.signUpInvestor.passwordValid = false;
        }
      });
  }

  getBorrowerMobilePhoneValidation(validation: boolean) {
    this.formModel.signUpBorrower.mobilePhoneValidation = !validation;
  }

  getInvestorMobilePhoneValidation(validation: boolean) {
    this.formModel.signUpInvestor.mobilePhoneValidation = !validation;
  }

  patchReferralRemark() {
    if (this.formModel.signUpBorrower.referralRemark) {
      this.signUpBorrowerForm.patchValue({
        referralRemark: this.formModel.signUpBorrower.referralRemark
      });
      this.signUpBorrowerForm.controls['referralRemark'].disable();
    }
    if (this.formModel.signUpInvestor.referralRemark) {
      this.signUpInvestorForm.patchValue({
        referralRemark: this.formModel.signUpInvestor.referralRemark
      });
      this.signUpInvestorForm.controls['referralRemark'].disable();
    }
  }

  highlightInvestorAndBorrower() {
    return this.countryCode === 'ID';
  }

}
