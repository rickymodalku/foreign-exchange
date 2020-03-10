import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import CONFIGURATION from '../../../../configurations/configuration';
import { ZohoLead } from '../../../models/member.class';
import { TranslateService } from '@ngx-translate/core';
import { TwoFaPhoneNumberConfig } from '../../../components/two-fa/two-fa-common/two-fa-interface';
import { MemberService } from '../../../services/member.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { UtilityService } from '../../../services/utility.service';
import { EventService } from '../../../services/event.service';
import { ValidatorService } from '../../../services/validator.service';
import { BaseParameterService } from '../../../services/base-parameter.service';
import { CryptographyService } from '../../../services/cryptography.service';

@Component({
  selector: 'standalone-check-eligibility',
  templateUrl: './check-eligibility.html'
})
export class CheckEligibilityComponent implements OnInit {
  borrowForm: FormGroup;
  borrowFormModel: any;
  checkEligibilityResultFlag: boolean;
  phonePrefix: string;
  masterData: any;
  borrowerPhoneNumberConfig: TwoFaPhoneNumberConfig;
  countryCode: string;
  showResult: boolean;
  loanAmount: number;
  loanTenor: number;
  currency: string;
  localeDecimalFormat: string;

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
    private _validatorService: ValidatorService,
    private _baseParameterService: BaseParameterService,
  ) {
    this.checkEligibilityResultFlag = false;
    this.currency = CONFIGURATION.currency_symbol;
    this.countryCode = CONFIGURATION.country_code;
    this.phonePrefix = CONFIGURATION.phone_prefix;
    this.localeDecimalFormat = CONFIGURATION.format.locale;
    this.borrowForm = this._formBuilder.group({
      companyName: new FormControl(null, [Validators.required]),
      companyType: new FormControl(null, [Validators.required]),
      companyRevenue: new FormControl(null, [Validators.required, this._validatorService.validatePositiveDecimal]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      fullName: new FormControl(null, [Validators.required]),
      loanAmount: new FormControl(null, [Validators.required, this._validatorService.validatePositiveDecimal]),
      loanTenor: new FormControl(null, [Validators.required]),
      mobilePhoneNumber: new FormControl(null, [Validators.required]),
      howDidYouFindUs: new FormControl(null, [Validators.required]),
      howDidYouFindUsOther: new FormControl(null, [])
    });
    this.borrowFormModel = {
      accepted: true,
      companyTypes: '',
      error: '',
      gclid: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmTerm: '',
      utmContent: '',
      loanAmount: '',
      tenorLength: '',
      success: '',
      howDidYouFindUs: '',
      howDidYouFindUsOtherValid: true,
      showHowDidYouFindUsOther: false,
      validation: false,
      valueFrom: 0,
      valueTo: 0,
      mobilePhoneValidation: true,
    };
    this.masterData = {
      tenors: new Array<any>(),
      companyTypes: new Array<any>(),
      howDidYouFindUsSources: new Array<any>()
    };
    this.borrowerPhoneNumberConfig = {
      mode: 'ANY',
      allowDropDown: true,
      onlyCountries: [(this.countryCode.toLowerCase())],
      mobilePhoneNumber: '',
      autoPlaceholder: 'polite'
    };
    this.showResult = false;
    this.loanAmount = 0;
    this.loanTenor = 0;
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this._activatedRoute
      .queryParams
      .subscribe((params: Params) => {
        this.borrowFormModel.utmSource = params['utm_source'];
        this.borrowFormModel.utmMedium = params['utm_medium'];
        this.borrowFormModel.utmCampaign = params['utm_campaign'];
        this.borrowFormModel.utmTerm = params['utm_term'];
        this.borrowFormModel.utmContent = params['utm_content'];
      });

    this._activatedRoute
      .params
      .subscribe((params: Params) => {
        if (this._router.url.includes('/check-eligibility')) {
          this.showResult = false;
        } else if (this._router.url.includes('/eligibility-results')) {
          this._activatedRoute
            .queryParams
            .subscribe((params2: Params) => {
              if (params2['amount'] && params2['tenor']) {
                this.showResult = true;
                this.loanAmount = params2['amount'];
                this.loanTenor = params2['tenor'];
                this.calculateInterest();
              } else {
                this._router.navigate(['/borrow/check-eligibility']);
              }
            });
        } else {
          this._router.navigate(['/borrow']);
        }
      });
    this._translateService
      .get('master.company-types')
      .subscribe(
        companyTypes => {
          for (const data of companyTypes) {
            if (data) {
              this.masterData.companyTypes.push({
                value: data.key,
                label: data.value
              });
            }
          }
        });

    this._translateService
      .get('master.how-did-you-find-us-sources.sign-up-borrower')
      .subscribe(
        howDidYouFindUsSources => {
          for (const data of howDidYouFindUsSources) {
            if (data) {
              this.masterData.howDidYouFindUsSources.push({
                value: data.key,
                label: data.value
              });
            }
          }
        });

    this._translateService
      .get('master.tenors')
      .subscribe(
        tenors => {
          for (const key in tenors) {
            if (key) {
              this.masterData.tenors.push({
                value: key,
                label: tenors[key]
              });
            }
          }
        });

  }

  autoFormatBorrowFormCompanyRevenue(): void {
    this.borrowForm.patchValue({
      companyRevenue: this._validatorService.addDelimiter(this.borrowForm.value.companyRevenue, false)
    });
  }

  autoFormatBorrowFormLoanAmount(): void {
    this.borrowForm.patchValue({
      loanAmount: this._validatorService.addDelimiter(this.borrowForm.value.loanAmount, false)
    });
  }

  onBorrowFormSubmit(): void {
    this.borrowFormModel.validation = true;
    this.borrowFormModel.howDidYouFindUsOtherValid =
      !this.borrowFormModel.showHowDidYouFindUsOther ||
      (this.borrowFormModel.showHowDidYouFindUsOther &&
        this.borrowForm.value.howDidYouFindUsOther &&
        this.borrowForm.value.howDidYouFindUsOther.length > 0
      );
    if (this.borrowForm.valid && this.borrowFormModel.howDidYouFindUsOtherValid) {
      let zohoLeadOwner = CONFIGURATION.zoho_leads_owner;
      let zohoLeadOwnerId = CONFIGURATION.zoho_leads_owner_id;
      if (CONFIGURATION.country_code === 'ID') {
        const amount = Number(this._validatorService.removeDelimiter(this.borrowForm.value.loanAmount));
        if (amount < CONFIGURATION.leadAmountSetting) {
          zohoLeadOwner = CONFIGURATION.zohoLeadsOwnerBorrow[0].email;
          zohoLeadOwnerId = CONFIGURATION.zohoLeadsOwnerBorrow[0].id;
        } else {
          zohoLeadOwner = CONFIGURATION.zohoLeadsOwnerBorrow[1].email;
          zohoLeadOwnerId = CONFIGURATION.zohoLeadsOwnerBorrow[1].id;
        }
      }
      this._memberService
        .addLead({
          companyName: this.borrowForm.value.companyName,
          companyRevenue: this._validatorService.removeDelimiter(this.borrowForm.value.companyRevenue),
          companyType: this.borrowForm.value.companyType,
          contactNumber: this.borrowForm.value.mobilePhoneNumber,
          mobile_phone_number: this.borrowForm.value.mobilePhoneNumber,
          countryId: CONFIGURATION.country_code,
          email: this.borrowForm.value.email,
          fullName: this.borrowForm.value.fullName,
          gclid: this.borrowFormModel.gclid,
          utmSource: this.borrowFormModel.utmSource,
          utmMedium: this.borrowFormModel.utmMedium,
          utmCampaign: this.borrowFormModel.utmCampaign,
          utmTerm: this.borrowFormModel.utmTerm,
          utmContent: this.borrowFormModel.utmContent,
          leadType: 'BORROWER',
          loanAmount: this._validatorService.removeDelimiter(this.borrowForm.value.loanAmount),
          loanTenor: this.borrowForm.value.loanTenor,
          pic: 'FRONT_END',
          notes: 'How did you find us : ' +
            this.borrowForm.value.howDidYouFindUs + (this.borrowForm.value.howDidYouFindUsOther ?
              ' - ' + this.borrowForm.value.howDidYouFindUsOther : ''),
          howDidYouFindUs: this.borrowForm.value.howDidYouFindUs,
          howDidYouFindUsDetails: this.borrowForm.value.howDidYouFindUsOther ? this.borrowForm.value.howDidYouFindUsOther : '',
          zohoLeadsOwnerId: zohoLeadOwnerId,
          zohoLeadsOwner: zohoLeadOwner,
          zoho_leads_source: CONFIGURATION.zoho_leads_source,
        })
        .subscribe(
          response => {
            this._router.navigate(['/borrow/eligibility-results'],
              {
                queryParams: { amount: this._validatorService.removeDelimiter(this.borrowForm.value.loanAmount), tenor: this.borrowForm.value.loanTenor },
              });
          },
          error => {
            this._notificationService.error(this.borrowFormModel.error);
          }
        );
    }
  }

  openCheckEligibitiyResultPopUp() {
    this.checkEligibilityResultFlag = true;
    window.history.pushState('', '', 'check-eligibility-result');
  }

  closeCheckEligibitiyResultPopUp(event) {
    this.checkEligibilityResultFlag = false;
    window.history.pushState('', '', '/');
  }

  getBorrowerMobilePhoneValidation(validation: string) {
    this.borrowFormModel.mobilePhoneValidation = !validation;
  }

  patchBorrowerMobilePhoneNumber(phoneNumber: string) {
    if (phoneNumber) {
      this.borrowForm.patchValue({
        mobilePhoneNumber: phoneNumber
      });
    }
  }

  onHowDidYouFindUsChange(value: string): void {
    this.borrowFormModel.showHowDidYouFindUsOther = (value === 'Others' || value === 'Blogs' || value === 'News Articles' || value === 'Events' || value === 'Friends & relatives');
  }

  getFromValue() {
    return this._baseParameterService.getInterestRate().valueFrom;
  }

  getToValue() {
    return this._baseParameterService.getInterestRate().valueTo;
  }

  calculateInterest() {
    this.borrowFormModel.valueFrom = (Number(this._validatorService.removeDelimiter(String(this.loanAmount))) *
      (1 + (this._baseParameterService.getInterestRate().valueFrom / 12 * this.loanTenor))) / this.loanTenor;
    this.borrowFormModel.valueTo = (Number(this._validatorService.removeDelimiter(String(this.loanAmount))) *
      (1 + (this._baseParameterService.getInterestRate().valueTo / 12 * this.loanTenor))) / this.loanTenor;
    this.borrowFormModel.valueFrom = this._utilityService.formatDecimal(this.borrowFormModel.valueFrom);
    this.borrowFormModel.valueTo = this._utilityService.formatDecimal(this.borrowFormModel.valueTo);
  }
}
