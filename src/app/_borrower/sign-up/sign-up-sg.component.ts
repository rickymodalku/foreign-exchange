
import { forkJoin as observableForkJoin, Observable } from 'rxjs';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import {
  ActivatedRoute,
  Params
} from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { MyInfoMappingService } from '../../services/myinfo-mapping.service';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import { ValidatorService } from '../../services/validator.service';
import { FormService } from '../../services/form.service';
import { MyInfoService } from '../../services/myinfo.service';
import { ModalService } from '../../services/modal.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { EventService } from '../../services/event.service';
import CONFIGURATION from '../../../configurations/configuration';
import { UtilityService } from '../../services/utility.service';
import { EventEmitter } from '@angular/core';
import { TwoFaPhoneNumberConfig } from '../../components/two-fa/two-fa-common/two-fa-interface';


enum BorrowerOnBoardSteps {
  business = 1
}
@Component({
  selector: 'app-sign-up-form-borrower-sg',
  templateUrl: './sign-up-sg.html'
})
export class SignupFormBorrowerSGComponent implements OnInit, AfterViewInit {
  countryCode: string;
  countryName: string;
  countryCurrencyCode: string;
  cpfHistoryDisplayDefaultNumber: number;
  cpfHistoryDisplayNumber: number;
  currentStep: number;
  formModel: any;
  masterData: any;
  myInfoData: any;
  myInfoDataMappingResult: any;
  phonePrefix: string;
  signUpBorrowerBusinessForm: FormGroup;
  signUpBorrowerMyInfoForm: FormGroup;
  steps: Array<any>;
  showMyInfoAndManualSelection: boolean;
  showMyInfoStep: boolean;
  showMyInfoError: boolean;
  myInfoFieldsMapping: object;
  borrowerFieldsForMyInfo: Array<string>;
  borrowerMyInfoExcludedFields: Array<string>;
  localeDecimalFormat: string;
  decimalFormat: string;
  onInitialized: EventEmitter<any>
  hasMyInfo: boolean;
  myInfoTranslation: any;
  featureToggles: any;
  twoFaOptions: any;
  CONFIGURATION: any;
  phoneNumberConfig: TwoFaPhoneNumberConfig;
  companyPhoneNumberConfig: TwoFaPhoneNumberConfig;
  borrowerMemberTypeCode: string;
  lastStepIndex: number;
  isInvestorOnboardingCompleted: boolean;
  memberTypeCode: string;
  @ViewChild(ModalComponent, { static: true }) viewChild: ModalComponent;

  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _formBuilder: FormBuilder,
    private _memberService: MemberService,
    private _myInfoMappingService: MyInfoMappingService,
    private _notificationService: NotificationService,
    private _router: Router,
    private _translateService: TranslateService,
    private _validatorService: ValidatorService,
    private _formService: FormService,
    private _myinfoService: MyInfoService,
    private _activatedRoute: ActivatedRoute,
    private _modalService: ModalService,
    private _utilityService: UtilityService,
    private _eventService: EventService,
  ) {
    this.CONFIGURATION = CONFIGURATION;
    this.onInitialized = new EventEmitter(true);
    this.showMyInfoAndManualSelection = true;
    this.countryCode = CONFIGURATION.country_code;
    this.countryName = CONFIGURATION.country_name;
    this.cpfHistoryDisplayDefaultNumber = 3;
    this.cpfHistoryDisplayNumber = this.cpfHistoryDisplayDefaultNumber;
    this.countryCurrencyCode = CONFIGURATION.currency_code;
    this.currentStep = 1; // By default we are at business page
    this.decimalFormat = CONFIGURATION.format.decimal;
    this.localeDecimalFormat = CONFIGURATION.format.locale;
    this.hasMyInfo = false;
    this.twoFaOptions = {};

    this.formModel = {
      completion: 0,
      existg: null,
      signUpBorrowerMyInfo: {
        country: '',
        state: ''
      },
      signUpBorrowerBusiness: {
        country: '',
        error: '',
        everBankrupt: false,
        success: '',
        state: '',
        totalEmployee: '',
        validation: false,
        mobilePhoneValidation: false,
        companyPhoneValidation: false
      }
    };
    this.masterData = {
      banks: new Array<any>(),
      bankAccountTypes: new Array<any>(),
      bankCurrencies: new Array<any>(),
      companyAnnualRevenues: new Array<any>(),
      companyAppointments: new Array<any>(),
      companyCapitals: new Array<any>(),
      companyCountries: new Array<any>(),
      companyCrimeStatuses: new Array<any>(),
      companyEntityTypes: new Array<any>(),
      companyStates: new Array<any>(),
      companyTotalEmployee: new Array<any>(),
      countries: new Array<any>(),
      genders: new Array<any>(),
      personalIdentityTypes: new Array<any>(),
      personalStates: new Array<any>()
    };
    this.myInfoData = {};
    this.phonePrefix = CONFIGURATION.phone_prefix;
    this.showMyInfoStep = false;
    this.signUpBorrowerMyInfoForm = this._formBuilder.group({
      fullName: new FormControl({ value: '', disabled: true }, [Validators.required]),
      uinfin: new FormControl({ value: '', disabled: true }, [Validators.required]),
      nationalityLabel: new FormControl({ value: '', disabled: true }, [Validators.required]),
      nationality: new FormControl({ value: '', disabled: true }, [Validators.required]),
      dob: new FormControl({ value: '', disabled: true }, [Validators.required]),
      employment: new FormControl({ value: '', disabled: true }, [Validators.required]),
      residentialStatusLabel: new FormControl({ value: '', disabled: true }, [Validators.required]),
      residentialStatus: new FormControl({ value: '', disabled: true }, [Validators.required]),
      sex: new FormControl({ value: '', disabled: true }, [Validators.required]),
      regAddCountry: new FormControl({ value: '', disabled: true }, [Validators.required]),
      regAddress1: new FormControl({ value: '', disabled: true }, [Validators.required]),
      regAddress2: new FormControl({ value: '', disabled: true }, []),
      regAddPostalCode: new FormControl({ value: '', disabled: true }, [Validators.required]),
      regAddUnit: new FormControl({ value: '', disabled: true }, []),
      regAddFloor: new FormControl({ value: '', disabled: true }, []),
      mobileNumberPrefix: new FormControl({ value: this.phonePrefix, disabled: true }, [Validators.required, Validators.pattern(this._validatorService.phonePrefixPattern)]),
      mobilePhoneNumber: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern(this._validatorService.numberPattern)]),
    });

    this.signUpBorrowerBusinessForm = this._formBuilder.group({
      fullName: new FormControl(null, [Validators.required]),
      mobilePhoneNumber: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      companyAnnualNetIncome: new FormControl(null, [Validators.required]),
      companyAnnualRevenue: new FormControl(null, [Validators.required]),
      companyCountryId: new FormControl(null, []),
      companyCurrentDebt: new FormControl(null, []),
      companyCurrentInstallment: new FormControl(null, []),
      companyEntityTypeId: new FormControl(null, [Validators.required, Validators.pattern(this._validatorService.numberPattern)]),
      companyEverBankrupt: new FormControl(null, []),
      companyName: new FormControl(null, [Validators.required]),
      companyOwnership: new FormControl(null, [Validators.required, this._validatorService.validateRangedDecimal(0, 100)]),
      companyPhoneNumber: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      companyTotalEmployeeId: new FormControl(null, [Validators.required, Validators.pattern(this._validatorService.numberPattern)]),
    });

    this.steps = this._baseParameterService.getBorrowerOnboardingStep();
    this.twoFaOptions = {};

    this.phoneNumberConfig = {
      mode: 'ANY',
      allowDropDown: true,
      onlyCountries: [(this.countryCode.toLowerCase())],
      mobilePhoneNumber: '',
      autoPlaceholder: 'polite'
    };

    this.companyPhoneNumberConfig = {
      mode: 'ANY',
      allowDropDown: true,
      onlyCountries: [(this.countryCode.toLowerCase())],
      mobilePhoneNumber: '',
      autoPlaceholder: 'polite'
    };
    this.borrowerMemberTypeCode = CONFIGURATION.member_type_code.borrower;
    this.lastStepIndex = 0;
    this.memberTypeCode = '';
  }

  ngOnInit() {
    this.hideMyInfoAndManualSelection(); //Hide Sign Up from MyInfo Temporary
    this.lastStepIndex = Math.max.apply(Math, this.steps.map(function (o) { return o.index; }));
    this.initialize();

    // Need asynchronous event to avoid change detection error in parent
    this._myinfoService.hideMyInfoAndManualSelectionEventEmitter.subscribe(response => {
      this.hideMyInfoAndManualSelection();
    });
  }
  // This is needed to make sure that the modal component
  // is registered in the service before using it
  ngAfterViewInit() {
    this.onInitialized.subscribe(response => {
      this._activatedRoute
        .queryParams
        .subscribe((params: Params) => {
          const signUpParams = Object.keys(params);
          if (signUpParams.includes('errorcode')) {
            this.onMyInfoError();
          } else if (signUpParams.includes('myinfo_success')) {
            if (params.myinfo_success === 'true') {
              this._myinfoService.hideMyInfoAndManualSelectionEventEmitter.emit(true);
              this._eventService.sendBrwSignupEvent('BRW-myinfo-signup');
            } else if (params.myinfo_success === 'false') {
              this.onMyInfoError();
            }
          }
        });
    })
  }

  updateLastSignUpStepWeb() {
    if (this._authService.getlastSignUpStepWeb()) {
      const body = {
        lastSignUpStepWeb: this._authService.getlastSignUpStepWeb()
      };
      this._memberService.updateMember(body).subscribe(
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
  }

  autoFormatCompanyCurrentInstallment(): void {
    this.signUpBorrowerBusinessForm.patchValue({
      companyCurrentInstallment: this._validatorService.addDelimiter(this.signUpBorrowerBusinessForm.value.companyCurrentInstallment, true)
    });
  }

  autoFormatCompanyAnnualNetIncome(): void {
    this.signUpBorrowerBusinessForm.patchValue({
      companyAnnualNetIncome: this._validatorService.addDelimiter(this.signUpBorrowerBusinessForm.value.companyAnnualNetIncome, true)
    });
  }

  autoFormatCompanyCurrentDebt(): void {
    this.signUpBorrowerBusinessForm.patchValue({
      companyCurrentDebt: this._validatorService.addDelimiter(this.signUpBorrowerBusinessForm.value.companyCurrentDebt, true)
    });
  }

  autoFormatCompanyAnnualRevenue(): void {
    this.signUpBorrowerBusinessForm.patchValue({
      companyAnnualRevenue: this._validatorService.addDelimiter(this.signUpBorrowerBusinessForm.value.companyAnnualRevenue, true)
    });
  }

  changeStep(stepIndex: number, backward: boolean = false): void {
    let step = this.steps.find(step => {
      return step.index === stepIndex;
    });
    if (step) {
      if (backward && this.currentStep < step.index) {
        return;
      }

      window.scrollTo(0, 0);
      this.currentStep = step.index;
      switch (step.index) {
        case BorrowerOnBoardSteps.business:
          if (this.formModel.existing) {
            this.prefillSignUpBorrowerBusinessForm();
          } else {
            this._memberService.getMemberDetail().subscribe(
                response => {
                  this.formModel.existing = response;
                  this.prefillSignUpBorrowerBusinessForm();
                },
                error => {
                  this._notificationService.error();
                  this.kickOut();
                }
              );
          }
          break;
      }
    }
  }

  initialize(): void {
    this.memberTypeCode = this._authService.getMemberTypeCode();
    observableForkJoin(
      this._memberService.getLookUpMasterData(),
      this._memberService.getMemberMasterData(this.memberTypeCode),
      this._translateService.get('form.onboarding-borrower.new-steps'),
      this._translateService.get('form.my-info')
    ).subscribe(result => {
      let masterData = result[0].data;
      let memberTypeMasterData = result[1].data;
      let steps = result[2];
      this.myInfoTranslation = result[3];

      this.masterData.countries = this._formService.getDefaultFirst(masterData.countries, CONFIGURATION.country_code);
      this.masterData.companyCountries = this.masterData.countries;
      this.masterData.genders = masterData.genders;
      this.masterData.personalIdentityTypes = masterData.personalIdentityTypes;
      this.masterData.banks = masterData.banks;
      this.masterData.bankCurrencies = masterData.currencies;

      for (let companyEntityType of memberTypeMasterData.companyEntityTypes) {
        if (companyEntityType.countryId === CONFIGURATION.country_code) {
          this.masterData.companyEntityTypes.push(companyEntityType);
        }
      }

      for (let totalEmployee of memberTypeMasterData.totalEmployees) {
        if (totalEmployee.countryId === CONFIGURATION.country_code) {
          this.masterData.companyTotalEmployee.push(totalEmployee);
        }
      }

      for (let bankAccountType of memberTypeMasterData.bankAccountTypes) {
        if (bankAccountType.countryId === CONFIGURATION.country_code) {
          this.masterData.bankAccountTypes.push(bankAccountType);
        }
      }

      this._utilityService.sortByKey(this.steps, 'alphabet', 'sort');
      this._memberService.getMemberDetail().subscribe(
        response => {
          this.formModel.existing = response;

          if (this.formModel.existing.lastSignUpStepWeb === this.steps.find(x => x.index === this.lastStepIndex).lastSignUpStepWeb) {
            this.isInvestorOnboardingCompleted = true;
          }

          if (!this.formModel.existing.lastSignUpStepWeb) {
            this.updateLastSignUpStepWeb();
          }
          const borrowerOnboardingStep = this._baseParameterService.getBorrowerOnboardingStep();
          const lastSignUpStepWeb = this.formModel.existing.lastSignUpStepWeb || this._authService.getlastSignUpStepWeb();
          const checkLastSignUpStepWeb = obj => obj.lastSignUpStepWeb === lastSignUpStepWeb;

          if (lastSignUpStepWeb === this._baseParameterService.getAccountVerificationStepDetail().label) {
            this.changeStep(1);
          } else {
            if (borrowerOnboardingStep.some(checkLastSignUpStepWeb)) {
              let step = this.steps.find(step => {
                return step.lastSignUpStepWeb === lastSignUpStepWeb;
              });
              this.changeStep(step.index + 1);
            } else {
              this.kickOut();
            }
          }
        },
        error => {
          this._notificationService.error();
          this.kickOut();
        }
      );
    });
    this._memberService
      .getLookUpMasterData()
      .subscribe(
        response => {
          let masterData = response.data;
          this.masterData.countries = this._formService.getDefaultFirst(masterData.countries, CONFIGURATION.country_code);
          this.masterData.companyCountries = this.masterData.countries
          this.masterData.genders = masterData.genders;
          this.masterData.personalIdentityTypes = masterData.personalIdentityTypes;
          this.masterData.banks = masterData.banks;
          this.masterData.bankCurrencies = masterData.currencies;
        },
        error => {
          this._notificationService.error();
          this.kickOut();
        }
      );

    this._translateService
      .get('master')
      .subscribe(
        masterData => {
          this.masterData.companyAnnualRevenues = masterData['company-annual-revenues'];
          this.masterData.companyAppointments = masterData['company-appointments'];
          this.masterData.companyCapitals = masterData['company-capitals'];
          this.masterData.companyCrimeStatuses = masterData['company-crime-statuses'];
        }
      );
  }

  hideBusinessFormFields(): void {
    this.signUpBorrowerBusinessForm.removeControl('fullName');
    this.signUpBorrowerBusinessForm.removeControl('mobilePhoneNumber');
    this.hasMyInfo = true;
  }

  prefillMyInfo(myInfoData): void {
    const myInfoNationality = myInfoData.nationality.value !== '' ? this._myInfoMappingService.getMyinfoCountryCodeMapping().find(x => x.key === myInfoData.nationality.value).label : '';
    const myInfoSex = myInfoData.sex.value !== '' ? this._myInfoMappingService.getMyinfoSexCodeMapping().find(x => x.key === myInfoData.sex.value).label : '';
    const myInfoResidentialStatusLabel = myInfoData.residentialstatus.value !== '' ? this._myInfoMappingService.getMyinfoResidentialCodeMapping().find(x => x.key === myInfoData.residentialstatus.value).label : '';
    const myInfoPrivatePropertyLabel = myInfoData.ownerprivate ? this.myInfoTranslation['yes'] : this.myInfoTranslation['no'];
    myInfoData.ownerprivate.label = myInfoPrivatePropertyLabel;
    let address2FloorAndUnit = '';
    if (myInfoData.regadd.unit !== '' && myInfoData.regadd.floor !== '') {
      address2FloorAndUnit = `#${myInfoData.regadd.floor}-${myInfoData.regadd.unit}`;
    }

    this.signUpBorrowerMyInfoForm.patchValue({
      fullName: myInfoData.name.value,
      uinfin: myInfoData.uinfin,
      dob: myInfoData.dob.value,
      sex: myInfoSex,
      nationalityLabel: myInfoNationality,
      nationality: myInfoData.nationality.value,
      residentialStatusLabel: myInfoResidentialStatusLabel,
      residentialStatus: myInfoData.residentialstatus.value,
      regAddCountry: myInfoData.regadd.country,
      regAddUnit: myInfoData.regadd.unit,
      regAddFloor: myInfoData.regadd.floor,
      regAddress1: `${this.myInfoData.regadd.block} ${this.myInfoData.regadd.street}`,
      regAddress2: `${myInfoData.regadd.building}`,
      regAddPostalCode: this.myInfoData.regadd.postal,
      mobileNumberPrefix: this.myInfoData.mobileno.prefix + this.myInfoData.mobileno.code,
      mobilePhoneNumber: this.myInfoData.mobileno.nbr
    });
  }

  kickOut(): void {
    this._authService.logOut();
    this._router.navigate(['/sign-up-borrower']);
  }

  getCurrentStepKey() {
    if (this.steps.length > 0) {
      const currentStepKey = this.steps.find(step => {
        return step.key === this.currentStep;
      }).key;
      return 0;
    }
  }

  onResidentialCountryChange(countryCode: string, stateId: number = null): void {
    if (countryCode) {
      this.signUpBorrowerMyInfoForm.patchValue({
        state: null,
        city: null
      });

      this._memberService
        .getLookUpStates(countryCode)
        .subscribe(
          response => {
            const states = response.data;
            this.masterData.companyStates = states;

            if (stateId) {
              this.signUpBorrowerMyInfoForm.patchValue({
                state: stateId
              });
            }
          },
          error => {
            console.error("onCompanyCountryChange", error)
          }
        )
    }
  }

  onSignUpBusinessEverBankruptCheck(event: any): void {
    this.formModel.signUpBorrowerBusiness.everBankrupt = event.checked;
  }

  onSignUpBorrowerBusinessFormSubmit(): void {
    this.formModel.signUpBorrowerBusiness.validation = true;
    this._formService.throwErrorForRequiredFields(this.signUpBorrowerBusinessForm);
    if (this.signUpBorrowerBusinessForm.valid &&
      !this.formModel.signUpBorrowerBusiness.companyPhoneValidation &&
      !this.formModel.signUpBorrowerBusiness.mobilePhoneValidation) {
      const body = {
        companyEntityTypeId: this.signUpBorrowerBusinessForm.value.companyEntityTypeId,
        companyName: this.signUpBorrowerBusinessForm.value.companyName,
        companyPhoneNumber: this.signUpBorrowerBusinessForm.value.companyPhoneNumber,
        companyCountryId: CONFIGURATION.country_code,
        companyTotalEmployeeId: this.signUpBorrowerBusinessForm.value.companyTotalEmployeeId,
        companyEverBankrupt: this.formModel.signUpBorrowerBusiness.everBankrupt,
        companyOwnership: this.signUpBorrowerBusinessForm.value.companyOwnership,
        companyAnnualRevenue: this._validatorService.removeDelimiter(this.signUpBorrowerBusinessForm.value.companyAnnualRevenue),
        companyAnnualNetIncome: this._validatorService.removeDelimiter(this.signUpBorrowerBusinessForm.value.companyAnnualNetIncome),
        companyCurrentDebt: this.signUpBorrowerBusinessForm.value.companyCurrentDebt ? this._validatorService.removeDelimiter(this.signUpBorrowerBusinessForm.value.companyCurrentDebt) : 0,
        companyCurrentInstallment: this.signUpBorrowerBusinessForm.value.companyCurrentInstallment ? this._validatorService.removeDelimiter(this.signUpBorrowerBusinessForm.value.companyCurrentInstallment) : 0,
        lastSignUpStepWeb: this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb
      }
      this._memberService.updateMember(body).subscribe(
        response => {
          if (response.status === 'success') {
            this._authService.setLastSignUStepWeb(this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb);
            this.isInvestorOnboardingCompleted = true;
            this.formModel.existing = null;
            this.formModel.signUpBorrowerBusiness.validation = false;
            this.signUpBorrowerBusinessForm.reset();
          }
        },
        error => {
          this._notificationService.error();
        }
      );
    } else {
      window.scrollTo(0, 0);
    }
  }

  prefillSignUpBorrowerBusinessForm(): void {
    this.formModel.signUpBorrowerBusiness.entityType = this.formModel.existing.companyEntityTypeId;
    this.formModel.signUpBorrowerBusiness.totalEmployee = this.formModel.existing.companyTotalEmployeeId;
    this.formModel.signUpBorrowerBusiness.everBankrupt = this.formModel.existing.companyEverBankrupt;
    const mobileNumber = this._formService.getPhoneNumberWithPrefix(this.formModel.existing.mobilePhoneNumber);
    this.signUpBorrowerBusinessForm.patchValue({
      fullName: this.formModel.existing.firstName,
      mobilePhoneNumber: mobileNumber.mobilePhoneNumber,
      companyEntityTypeId: this.formModel.existing.companyEntityTypeId,
      companyName: this.formModel.existing.companyName,
      companyPhoneNumber: this.formModel.existing.companyPhoneNumber,
      companyCountryId: this.formModel.existing.companyCountryId,
      companyTotalEmployeeId: this.formModel.existing.companyTotalEmployeeId,
      companyEverBankrupt: this.formModel.existing.companyEverBankrupt,
      companyOwnership: this.formModel.existing.companyOwnership,
      companyAnnualRevenue: this._validatorService.addDelimiter(parseFloat(this.formModel.existing.companyAnnualRevenue).toString(), true),
      companyAnnualNetIncome: this._validatorService.addDelimiter(parseFloat(this.formModel.existing.companyAnnualNetIncome).toString(), true),
      companyCurrentDebt: this._validatorService.addDelimiter(parseFloat(this.formModel.existing.companyCurrentDebt).toString(), true),
      companyCurrentInstallment: this._validatorService.addDelimiter(parseFloat(this.formModel.existing.companyCurrentInstallment).toString(), true)
    });
    this.phoneNumberConfig.mobilePhoneNumber = mobileNumber.mobilePhoneNumber;
  }

  hideMyInfoAndManualSelection(): void {
    this.showMyInfoAndManualSelection = false;
  }
  // Toggle CPF display
  updateNumberofCPFHistoryDisplay() {
    if (this.cpfHistoryDisplayNumber > this.cpfHistoryDisplayDefaultNumber) {
      this.cpfHistoryDisplayNumber = this.cpfHistoryDisplayDefaultNumber;
    } else {
      this.cpfHistoryDisplayNumber = this.myInfoData.cpfcontributions.cpfcontribution.length;
    }
  }

  callAuthoriseApi(): void {
    const myInfoBorrowerAttributes = this._baseParameterService.getMyInfoAttributes('borrower');
    const borrowerFieldsForMyInfo = this._baseParameterService.getMyInfoSelectedAttributes(CONFIGURATION.member_type_code.borrower);
    const approvedBorrowerFields = borrowerFieldsForMyInfo
      .filter(myInfoBorrowerfield => myInfoBorrowerAttributes.includes(myInfoBorrowerfield));

    const url = this._myinfoService.getAuthoriseUrl(CONFIGURATION.member_type_code.borrower, approvedBorrowerFields.join(','));
    window.location.assign(url);
  }

  openModal(id: string): void {
    this._modalService.open(id);
  }

  closeModal(id: string): void {
    this._modalService.close(id);
  }

  onMyInfoError(): void {
    this._myinfoService.hideMyInfoAndManualSelectionEventEmitter.emit(true);
    this.openModal('MyInfoErrorModal');
  }

  displayMyInfoStep(): void {
    this.showMyInfoStep = true;
    const myInfoStepIndex = this.steps.findIndex((obj => obj.key === 0));
    this.steps[myInfoStepIndex].show = true;
  }

  patchMobilePhoneNumber(phoneNumber: string) {
    if (phoneNumber) {
      this.signUpBorrowerBusinessForm.patchValue({
        mobilePhoneNumber: phoneNumber
      });
    }
  }

  getMobilePhoneValidation(validation: boolean) {
    this.formModel.signUpBorrowerBusiness.mobilePhoneValidation = validation;
  }

  patchCompanyMobilePhoneNumber(phoneNumber: string) {
    if (phoneNumber) {
      this.signUpBorrowerBusinessForm.patchValue({
        companyPhoneNumber: phoneNumber
      });
    }
  }

  getCompanyMobilePhoneValidation(validation: boolean) {
    this.formModel.signUpBorrowerBusiness.companyPhoneValidation = validation;
  }

  goToDashboard() {
    this._router.navigate(['/admin-borrower/overview']);
  }

}
