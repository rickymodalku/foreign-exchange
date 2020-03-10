
import {forkJoin as observableForkJoin } from 'rxjs';
// TODO: Please find chance to refractor the usage of label to match the backend field, currently
// the label has changed and it will break core functionality of the SA
// With v2,  /v2/members/{member_uuid}/subscription_agreements/{id}
//  we can use the exact fields given in v2/members/subscription_agreement_templates/MY to map those fields

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
  Validators
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  MemberBankAccount,
  SubscriptionAgreementTemplate,
} from '../../models/member.class';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import { ValidatorService } from '../../services/validator.service';
import { ModalService } from 'app/services/modal.service';
import { EventService } from '../../services/event.service';
import { UtilityService } from '../../services/utility.service';
import CONFIGURATION from '../../../configurations/configuration';
import { FormService } from '../../services/form.service';
import { debounce } from 'lodash';
import { Router } from '@angular/router';

enum EmploymentStatuses {
  employment = 6,
  business = 7,
  retiredOrUnemployed = 8,
  housewife = 9,
  student = 10
}

enum AccreditedStatuses {
  retail = 5,
  angelBasedOnAnnualIncome = 6,
  angelBasedOnAssestValue = 7,
  angelBasedOnAnnualIncomeAndNetAsset = 8
}

enum NetWorthSources {
  savings = 1,
  investments = 2,
  pension = 3,
  spouse = 4,
  parents = 5,
  otherFamilyMembersFriends = 6,
  inheritance = 7,
  siblings = 8,
  scholarships = 9
}
@Component({
  selector: 'agreement-my',
  templateUrl: './agreement-my.html'
})
export class AgreementMYComponent implements OnInit {
  bankForm: FormGroup;
  checkboxSelectAll: boolean;
  configuration: any;
  currentDate: Date;
  currentStep: number;
  formModel: any;
  imageBaseUrl: any;
  masterData: any;
  currentSourceOfWealthForm: FormGroup;
  sourceOfWealthForm: FormGroup;
  authorizationConsentForm: FormGroup;
  authorizationConsentModel = {
    faAuthorizationConsentAcceptedAt: null
  };
  authorizationConsentFlag = false;
  employmentSourceOfWealthForm: FormGroup;
  businessSourceOfWealthForm: FormGroup;
  retiredOrUnemployedSourceOfWealthForm: FormGroup;
  housewifeSourceOfWealthForm: FormGroup;
  studentSourceOfWealthForm: FormGroup;
  steps: Array<any>;
  subscriptionAgreementTemplates: Array<SubscriptionAgreementTemplate>;
  swiperConfiguration: SwiperConfigInterface;
  testimonialContent: Array<any>;
  testimonialContentFlag: boolean;
  housewifeNetWorthSources: Array<any>;
  studentNetWorthSources: Array<any>;
  retiredOrUnemployedNetWorthSources: Array<any>;
  showPreviousJobFields: boolean;
  showSpousePreviousJobFields: boolean;
  riskDisclosureScrollFlag: boolean;
  platformAgreementScrollFlag: boolean;
  platformAgreementHtml: string;
  riskDisclosureAcceptedAt: any;
  authorizationConsentTranslateParams: any;
  translations = {
    link: CONFIGURATION.authorizationConsent.websiteLink
  };
  @ViewChild('platformAgreementContainer', { static: false }) private platformAgreementContainer: ElementRef;
  @ViewChild('riskDisclosureContainer', { static: true }) private riskDisclosureContainer: ElementRef;

  debounceOnScrollEvent: any;
  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _formBuilder: FormBuilder,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _validatorService: ValidatorService,
    private _modalService: ModalService,
    private _eventService: EventService,
    private _router: Router,
    private _utilityService: UtilityService,
    private _formService: FormService
  ) {
    this.checkboxSelectAll = false;
    this.currentStep = 1;
    this.formModel = {
      bank: {
        bankOtherValid: true,
        error: '',
        existing: null,
        showBankOther: false,
        success: '',
        validation: false,
        bankId: ''
      },
      sourceOfWealth: {
        error: '',
        errors: null,
        toggleDisplay: {
          business: false,
          employment: false,
          retiredOrUnemployed: false,
          student: false,
          housewife: false,
        },
        success: '',
        valid: {
          asset: true,
          business: true,
          employment: true,
          gift: true,
          inheritance: true,
          other: true,
          past: true
        },
        validation: false,
        employmentStatus: '',
        employmentAnnualIncome: ''
      },
      riskDisclosureModal: false,
      riskDisclosureAgree: false,
    };
    this.imageBaseUrl = CONFIGURATION.image_base_url;
    this.masterData = {
      accreditedStatuses: new Array<any>(),
      bankAccountTypes: new Array<any>(),
      banks: new Array<any>(),
      currencies: new Array<any>(),
      employmentStatuses: new Array<any>(),
      jobCategories: new Array<any>(),
      jobTitles: new Array<any>(),
      wealthAmounts: new Array<any>(),
      countries: new Array<any>(),
    };
    this.bankForm = this._formBuilder.group({
      address: new FormControl(null, []),
      bankAccountTypeId: new FormControl(null, [Validators.required]),
      bankId: new FormControl(null, [Validators.required]),
      bankOther: new FormControl(null, []),
      branch: new FormControl(null, [Validators.required]),
      currency: new FormControl(null, [Validators.required]),
      id: new FormControl(null, [Validators.pattern(this._validatorService.numberPattern)]),
      name: new FormControl(null, [Validators.required]),
      number: new FormControl(null, [Validators.required]),
      swiftCode: new FormControl(null, []),
    });

    this.sourceOfWealthForm = this._formBuilder.group({
      accreditedStatus: new FormControl(null, [Validators.required]),
      employmentStatus: new FormControl(null, [Validators.required]),
      employmentEmployed: new FormControl(false, []),
      taxResidency: new FormControl(null, []),
    });

    this.authorizationConsentForm = this._formBuilder.group({
      discloseInformation: new FormControl(false, [Validators.requiredTrue]),
      activitiesPermission: new FormControl(false, [Validators.requiredTrue]),
      accountViewAccess: new FormControl(false, [Validators.requiredTrue]),
      agreed: new FormControl(false, [Validators.requiredTrue])
    });

    this.employmentSourceOfWealthForm = this._formBuilder.group({
      employmentCompanyNameFull: new FormControl(null, [Validators.required]),
      employmentJobCategory: new FormControl(null, [Validators.required]),
      employmentTitle: new FormControl(null, [Validators.required]),
      employmentAnnualIncome: new FormControl(null, [Validators.required]),
      employmentNetWorth: new FormControl(null, [Validators.required]),
    });

    this.businessSourceOfWealthForm = this._formBuilder.group({
      businessCompanyNameFull: new FormControl(null, [Validators.required]),
      businessAnnualProfit: new FormControl(null, [Validators.required]),
      businessAnnualRevenue: new FormControl(null, [Validators.required]),
      businessJobCategory: new FormControl(null, [Validators.required])
    });

    this.retiredOrUnemployedSourceOfWealthForm = this._formBuilder.group({
      retiredOrUnemployedNetWorthSource: new FormControl(null, [Validators.required]),
      retiredOrUnemployedNetWorth: new FormControl(null, [Validators.required]),
      isEmployedPreviously: new FormControl(false, []),
      retiredOrUnemployedPreviousCompanyNameFull: new FormControl(null, []),
      retiredOrUnemployedPreviousJobCategory: new FormControl(null, []),
      retiredOrUnemployedPreviousJobTitle: new FormControl(null, [])
    });

    this.housewifeSourceOfWealthForm = this._formBuilder.group({
      housewifeNetWorthSource: new FormControl(null, []),
      housewifeNetWorth: new FormControl(null, []),
      isSpouseEmployed: new FormControl(null, []),
      spouseCompanyNameFull: new FormControl(null, []),
      spouseEmploymentTitle: new FormControl(null, []),
      spouseJobCategory: new FormControl(null, []),
    });

    this.studentSourceOfWealthForm = this._formBuilder.group({
      studentNetWorthSource: new FormControl(null, [Validators.required]),
      studentNetWorth: new FormControl(null, [Validators.required]),
      studentInstitution: new FormControl(null, [Validators.required])
    });

    this.steps = new Array<any>();
    this.subscriptionAgreementTemplates = new Array<SubscriptionAgreementTemplate>();
    this.swiperConfiguration = _baseParameterService.sign_up_swipper_config;
    this.configuration = CONFIGURATION;
    this.testimonialContent = new Array<any>();
    this.testimonialContentFlag = false;
    this.showPreviousJobFields = false;
    this.housewifeNetWorthSources = [
      { id: NetWorthSources['savings'] },
      { id: NetWorthSources['investments'] },
      { id: NetWorthSources['pension'] },
      { id: NetWorthSources['spouse'] },
      { id: NetWorthSources['parents'] },
      { id: NetWorthSources['otherFamilyMembersFriends'] },
      { id: NetWorthSources['inheritance'] },
    ];
    this.studentNetWorthSources = [
      { id: NetWorthSources['spouse'] },
      { id: NetWorthSources['parents'] },
      { id: NetWorthSources['siblings'] },
      { id: NetWorthSources['otherFamilyMembersFriends'] },
      { id: NetWorthSources['scholarships'] },
      { id: NetWorthSources['inheritance'] },
    ];
    this.retiredOrUnemployedNetWorthSources = this.housewifeNetWorthSources;
    this.platformAgreementHtml = '';
    this.debounceOnScrollEvent = debounce(
      (container) => this.onScroll(container),
      100);
  }

  ngOnInit() {
    observableForkJoin(
      this._memberService.getMemberMasterData(this._authService.getMemberTypeCode()),
      this._translateService.get('master.bank-account-types')
    ).subscribe(responses => {
      let bankAccountTypes = responses[0].data.bankAccountTypes.filter(bankAccountType => {
        return bankAccountType.countryId === CONFIGURATION.country_code;
      });
      Object.keys(bankAccountTypes).forEach(key => {
        this.masterData.bankAccountTypes.push({
          code: bankAccountTypes[key].code,
          id: bankAccountTypes[key].id,
          order: bankAccountTypes[key].order,
          name: responses[1].find(x => x.code === bankAccountTypes[key].code).name
        });
      });
    }, error => {
      this._notificationService.error();
    });


    this._translateService
      .get('form.setting-bank')
      .subscribe(
        bank => {
          this.formModel.bank.error = bank.error;
          this.formModel.bank.success = bank.success;
        }
      );
    this._translateService
      .get('form.source-of-wealth')
      .subscribe(
        sourceOfWealth => {
          this.formModel.sourceOfWealth.error = sourceOfWealth.error;
          this.formModel.sourceOfWealth.errors = sourceOfWealth.errors;
          this.formModel.sourceOfWealth.success = sourceOfWealth.success;
        }
      );

    this._memberService.getMemberDetail()
      .subscribe(member => {
        let investorAgreementStep = null;
        if (member.faMemberId) {
          investorAgreementStep = this._baseParameterService.getInvestorAgreementStepWithAuthorizationConsent();
        } else {
          investorAgreementStep = this._baseParameterService.getInvestorAgreementStep();
        }
        this.steps = Object.keys(investorAgreementStep)
          .map(key => {
            return {
              index: parseInt(key, 0) + 1,
              key: investorAgreementStep[key].key,
              label: investorAgreementStep[key].label
            };
          });
        this.changeStep(this.currentStep, true);
      });

    this._translateService
      .get('form.onboarding-investor.image-swipper')
      .subscribe(
        testimonial => {
          this.testimonialContent = testimonial;
          this.testimonialContentFlag = true;
        });

    this._translateService
      .get('master')
      .subscribe(
        masterData => {
          const accreditedStatuses = this._baseParameterService.getAccreditedStatuses();
          for (const accreditedStatus of accreditedStatuses) {
            accreditedStatus.label = masterData['accredited-statuses-label'][AccreditedStatuses[accreditedStatus.id]];
          }
          this.masterData.accreditedStatuses = accreditedStatuses;
          const employmentStatuses = this._baseParameterService.getEmploymentStatuses();
          for (const employmentStatus of employmentStatuses) {
            employmentStatus.label = masterData['employment-statuses-label'][EmploymentStatuses[employmentStatus.id]];
          }
          this.masterData.employmentStatuses = employmentStatuses;
          this.masterData.jobCategories = masterData['job-categories'];
          this.masterData.jobTitles = masterData['job-levels'];
          this.masterData.wealthAmounts = this._baseParameterService.getEmploymentAnnualRevenueList();
          this.masterData.netWorthList = this._baseParameterService.getEmploymentAnnualRevenueList();
          this.masterData.studentNetWorthSources = this.studentNetWorthSources.map(netWorthSource => {
            netWorthSource.label = masterData['net-worth-sources'][NetWorthSources[netWorthSource.id]];
            return netWorthSource;
          });
          this.masterData.housewifeNetWorthSources = this.housewifeNetWorthSources.map(netWorthSource => {
            netWorthSource.label = masterData['net-worth-sources'][NetWorthSources[netWorthSource.id]];
            return netWorthSource;
          });
          this.masterData.retiredOrUnemployedNetWorthSources = this.masterData.housewifeNetWorthSources;
        }
      );
    this._memberService
      .getLookUpMasterData()
      .subscribe(
        response => {
          const masterData = response.data;
          this.masterData.countries = this._utilityService.shiftElementToTheTopOfArray(masterData.countries);
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  changeStep(stepIndex: number, firstLoad: boolean = false): void {
    const step = this.steps.find(step => {
      return step.index === stepIndex;
    });
    if (step) {
      window.scrollTo(0, 0);
      this.currentStep = step.index;
      switch (step.key) {
        case 0:
          this.initializeBank(firstLoad);
          break;
        case 1:
          this.initializeSourceOfWealth();
          break;
        case 2:
          if (this.steps.length === 5) {
            this.initializeAuthorizationConsent();
          } else {
            this.initializePlatformAgreement();
          }
          break;
        case 3:
          if (this.steps.length === 5) {
            this.initializePlatformAgreement();
          }
          break;
      }
    }
  }

  onScrollDebounce(container: string): void {
    this.debounceOnScrollEvent(container);
  }

  onScroll(container: string) {
    let element;
    this.riskDisclosureScrollFlag = false;
    this.platformAgreementScrollFlag = false;
    if (container === 'riskDisclosureAgreement') {
      element = this.riskDisclosureContainer.nativeElement;
    } else if (container === 'platformAgreement') {
      element = this.platformAgreementContainer.nativeElement;
    }
    const atBottom = Math.round(element.scrollHeight - element.scrollTop) <=
      (element.clientHeight + this._baseParameterService.getScrollTolerance());
    if (atBottom) {
      if (container === 'riskDisclosureAgreement') {
        this.riskDisclosureScrollFlag = true;
      } else if (container === 'platformAgreement') {
        this.platformAgreementScrollFlag = true;
      }
    }
  }

  checkSourceOfWealthCompletion(formControlName: string): boolean {
    const control = this.sourceOfWealthForm.get(formControlName).value;
    return control && control.length > 0;
  }

  initializeBank(firstLoad: boolean): void {
    this._memberService
      .getMemberDetail()
      .subscribe(
        member => {
          this.formModel.bank.existing = member.memberBankAccounts.find(memberBankAccount => {
            return memberBankAccount.isDefault;
          });
          if (this.formModel.bank.existing) {
            if (firstLoad) {
              this.changeStep(this.currentStep + 1);
            } else {
              this.bankForm.patchValue({
                id: this.formModel.bank.existing.id,
                bankId: this.formModel.bank.existing.bankId,
                bankOther: this.formModel.bank.existing.bankOther,
                bankAccountTypeId: this.formModel.bank.existing.bankAccountTypeId,
                branch: this.formModel.bank.existing.branch,
                address: this.formModel.bank.existing.address,
                swiftCode: this.formModel.bank.existing.swiftCode,
                currency: this.formModel.bank.existing.currency,
                name: this.formModel.bank.existing.name,
                number: this.formModel.bank.existing.number
              });
            }
          }

          if (this.masterData.banks.length === 0 && this.masterData.currencies.length === 0) {
            this._memberService
              .getLookUpMasterData()
              .subscribe(
                response => {
                  const masterData = response.data;
                  this.masterData.banks = masterData.banks;
                  this.masterData.currencies = masterData.currencies;
                  const currency = this.masterData.currencies.find((element) => {
                    return element.code === CONFIGURATION.currency_code;
                  });
                  this.masterData.currencies = this.masterData.currencies.filter((element) => {
                    return element.code !== CONFIGURATION.currency_code;
                  });

                  for (const x of this.masterData.banks) {
                    if (x.id === this._baseParameterService.other_bank_id[CONFIGURATION.country_code]) {
                      this.masterData.banks.push(this.masterData.banks.splice(this.masterData.banks.indexOf(x), 1)[0]);
                    }
                  }

                  this.masterData.currencies.unshift(currency);
                  this.onBankIdChange(this.bankForm.value.bankId);
                },
                error => {
                  this._notificationService.error();
                }
              );
          } else {
            this.onBankIdChange(this.bankForm.value.bankId);
          }
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  initializeSourceOfWealth(): void {
    this._memberService
      .getSubscriptionAgreementTemplates()
      .subscribe(
        subscriptionAgreementTemplates => {
          this.subscriptionAgreementTemplates = subscriptionAgreementTemplates;
          this._memberService
            .getMemberDetail()
            .subscribe(
              member => {
                let template = this.subscriptionAgreementTemplates.find(element => {
                  return element.label === 'Fullname';
                });
                if (template) {
                  template.valueString = member.firstName;
                }

                if (member.citizenshipCountryId === 'MY') {
                  this.sourceOfWealthForm.patchValue({
                    taxResidency: true
                  });
                }

                template = null;
                template = this.subscriptionAgreementTemplates.find(element => {
                  return element.label === 'Email';
                });
                if (template) {
                  template.valueString = member.userName;
                }

                template = null;
                template = this.subscriptionAgreementTemplates.find(element => {
                  return element.label === 'IC/Passport Number';
                });
                if (template) {
                  template.valueString = member.icNumber ? member.icNumber : member.passportNumber;
                }
              },
              error => {
                this._notificationService.error();
              }
            );
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  initializeAuthorizationConsent(): void {
    this._memberService.getMemberDetail()
      .subscribe(member => {
        this.authorizationConsentTranslateParams = {
          investor: {
            name: member.fullName,
            registration: member.icNumber || member.passportNumber || 'N/A'
          },
          fa: {
            company_name: member.faMember && member.faMember.companyName,
            code: member.faMember && member.faMember.referralCode,
            name: member.faMember && member.faMember.fullname,
            registration: member.faMember && member.faMember.icNumber,
            email: member.faMember && member.faMember.userName
          }
        }
      });
  }

  initializePlatformAgreement(): void {
    this._memberService
      .getPlatformAgreement(CONFIGURATION.country_code)
      .subscribe(
        platformAgreement => {
          this.platformAgreementHtml = platformAgreement.data.content;
        },
        error => {
          this._notificationService.error(error);
        });
  }

  onBankIdChange(value: string): void {
    const existingBank = this.masterData.banks.find(bank => {
      return bank.id === value;
    });
    this.formModel.bank.showBankOther = existingBank && existingBank.name === 'Other';
  }

  onBankFormSubmit(): void {
    this.formModel.bank.validation = true;
    this.formModel.bank.bankOtherValid = !this.formModel.bank.showBankOther || (this.formModel.bank.showBankOther && this.bankForm.value.bankOther && this.bankForm.value.bankOther.length > 0);

    if (
      this.formModel.bank.bankOtherValid &&
      this.bankForm.valid
    ) {
      if (this.formModel.bank.existing) {
        let list = new Array<MemberBankAccount>()
        list.push(<MemberBankAccount>({
          address: this.bankForm.value.address,
          bankAccountTypeId: this.bankForm.value.bankAccountTypeId,
          bankAccountTypeName: this.bankForm.value.bankAccountTypeName,
          bankId: this.bankForm.value.bankId,
          bankName: this.bankForm.value.bankName,
          bankOther: this.formModel.bank.showBankOther ? this.bankForm.value.bankOther : '',
          branch: this.bankForm.value.branch,
          currency: this.bankForm.value.currency,
          id: this.bankForm.value.id,
          isDefault: true,
          isValid: true,
          memberId: this._authService.getMemberId(),
          name: this.bankForm.value.name,
          number: this.bankForm.value.number,
          pic: this._authService.getUserName() + (!this._authService.isAdministrator() ? ' (' + this._authService.getSubaccountUserName() + ')' : ''),
          swiftCode: this.bankForm.value.swiftCode
        }));
        this._memberService
          .updateBankAccounts(
            list
          )
          .subscribe(
            response => {
              this.formModel.bank.validation = false;
              this.changeStep(this.currentStep + 1);
            },
            error => {
              this._notificationService.error(error.message);
            }
          );
      } else {
        this._memberService
          .addBankAccount(<MemberBankAccount>({
            address: this.bankForm.value.address,
            bankAccountTypeId: this.bankForm.value.bankAccountTypeId,
            bankAccountTypeName: this.bankForm.value.bankAccountTypeName,
            bankId: this.bankForm.value.bankId,
            bankName: this.bankForm.value.bankName,
            bankOther: this.formModel.bank.showBankOther ? this.bankForm.value.bankOther : '',
            branch: this.bankForm.value.branch,
            currency: this.bankForm.value.currency,
            id: null,
            isDefault: true,
            isValid: true,
            name: this.bankForm.value.name,
            number: this.bankForm.value.number,
            pic: this._authService.getUserName() + (!this._authService.isAdministrator() ? ' (' + this._authService.getSubaccountUserName() + ')' : ''),
            swiftCode: this.bankForm.value.swiftCode
          }))
          .subscribe(
            response => {
              this.formModel.bank.validation = false;
              this._eventService.sendInvActivationEvent('INV-bank');
              this.changeStep(this.currentStep + 1);
            },
            error => {
              this._notificationService.error(error.message);
            }
          );
      }
    } else {
      window.scrollTo(0, 0);
    }
  }

  onEmploymentStatusChange(value: any): void {
    const employmentStatus = this.masterData.employmentStatuses.find(element => {
      return parseInt(element.id, 10) === parseInt(value, 10);
    });
    if (employmentStatus) {
      const isEmployed = employmentStatus.id === EmploymentStatuses['employment'] ||
        employmentStatus.id === EmploymentStatuses['retiredOrUnemployed'] ||
        employmentStatus.id === EmploymentStatuses['housewife'];
      switch (employmentStatus.id) {
        case EmploymentStatuses['employment']:
          this.currentSourceOfWealthForm = this.employmentSourceOfWealthForm;
          break;
        case EmploymentStatuses['business']:
          this.currentSourceOfWealthForm = this.businessSourceOfWealthForm;
          break;
        case EmploymentStatuses['retiredOrUnemployed']:
          this.currentSourceOfWealthForm = this.retiredOrUnemployedSourceOfWealthForm;
          break;
        case EmploymentStatuses['housewife']:
          this.currentSourceOfWealthForm = this.housewifeSourceOfWealthForm;
          break;
        case EmploymentStatuses['student']:
          this.currentSourceOfWealthForm = this.studentSourceOfWealthForm;
          break;
      }

      Object.keys(this.formModel.sourceOfWealth.toggleDisplay).forEach(key => {
        this.formModel.sourceOfWealth.toggleDisplay[key] = key === EmploymentStatuses[employmentStatus.id];
        this.formModel.sourceOfWealth.valid[key] = true;
        this.sourceOfWealthForm.patchValue({
          employmentStatus: employmentStatus.id
        });
      });

      this.sourceOfWealthForm.patchValue({
        employmentEmployer: null,
        employmentTitle: null,
        employmentNetWorth: null,
        employmentAnnualIncome: null,
        businessName: null,
        studentInstitution: null,
        businessAnnualRevenue: null,
        businessAnnualProfit: null,
        employmentCompanyNameFull: null,
        businessCompanyNameFull: null,
      });
    }
  }

  onEmploymentAnnualRevenueChange(revenue: string) {
    const angelInvestorFlag = this._baseParameterService.getEmploymentAnnualRevenueList().find(employeeAnnualRevenue => {
      return employeeAnnualRevenue.value === revenue;
    }).angelInvestorFlag;
    if (angelInvestorFlag) {
      this.sourceOfWealthForm.patchValue({
        accreditedStatus: this._baseParameterService.getAccreditedBasedOnAnnualIncomeId().id
      });
    } else {
      this.sourceOfWealthForm.patchValue({
        accreditedStatus: this._baseParameterService.getAccreditedDefaultValue().id
      });
    }
  }

  onIsSpouseEmployedChange(isEmployed: boolean) {
    this.showSpousePreviousJobFields = isEmployed;
    this.sourceOfWealthForm.patchValue({
      employmentEmployed: isEmployed
    });
    this.setRequiredForSubfields(isEmployed, this.housewifeSourceOfWealthForm);
  }

  onIsEmployedPreviouslyChange(isEmployed: boolean) {
    this.showPreviousJobFields = isEmployed;
    this.retiredOrUnemployedSourceOfWealthForm.patchValue({
      employmentEmployed: isEmployed
    });
    this.setRequiredForSubfields(isEmployed, this.retiredOrUnemployedSourceOfWealthForm);
  }

  setRequiredForSubfields(enable: boolean, formGroup: FormGroup) {
    if (enable) {
      Object.values(formGroup.controls).forEach(control => {
        control.setValidators([Validators.required]);
        control.updateValueAndValidity();
      });
    } else {
      Object.values(formGroup.controls).forEach(control => {
        control.clearValidators();
        control.updateValueAndValidity();
      });
    }
  }

  riskDisclosurePopUp() {
    this._formService.validateAllFormFields(this.sourceOfWealthForm);
    if (this.sourceOfWealthForm.controls.employmentStatus.valid) {
      this._formService.validateAllFormFields(this.currentSourceOfWealthForm);
    } else {
      this._notificationService.error(this.formModel.sourceOfWealth.errors['none-selected']);
    }
    if (this.currentSourceOfWealthForm) {
      if (this.currentSourceOfWealthForm.valid && this.sourceOfWealthForm.valid) {
        this.onSourceOfWealthFormSubmit();
      } else {
        this._formService.throwErrorForRequiredFields(this.currentSourceOfWealthForm);
      }
    }
  }

  onSourceOfWealthFormSubmit(): void {
    this.openModal('fsRiskDisclosureModal');
    this.formModel.sourceOfWealth.validation = false;
    this.changeStep(this.currentStep + 1);
    this._eventService.sendInvActivationEvent('INV-sow');
  }

  onPlatformAgreementClick() {
    for (const template of this.subscriptionAgreementTemplates) {
      switch (template.label) {
        // Employment Status
        case 'Employment Status':
          template.valueString = this.sourceOfWealthForm.get('employmentStatus').value;
          break;
        // Tax Residency
        case 'Tax Residency':
          template.valueBoolean = this.sourceOfWealthForm.get('taxResidency').value;
          break;
        // Employment
        case 'From Employment':
          template.valueBoolean = this.formModel.sourceOfWealth.toggleDisplay.employment ||
            this.formModel.sourceOfWealth.toggleDisplay.housewife ||
            this.formModel.sourceOfWealth.toggleDisplay.retiredOrUnemployed;
          break;
        case 'Employment Employed':
          template.valueBoolean = this.housewifeSourceOfWealthForm.get('isSpouseEmployed').value ||
            this.retiredOrUnemployedSourceOfWealthForm.get('isEmployedPreviously').value;
          break;
        case 'Employment Employer':
          template.valueString = this.employmentSourceOfWealthForm.get('employmentEmployer').value;
          break;
        case 'Employment Title':
          template.valueString = this.employmentSourceOfWealthForm.get('employmentTitle').value ||
            this.housewifeSourceOfWealthForm.get('spouseEmploymentTitle').value ||
            this.retiredOrUnemployedSourceOfWealthForm.get('retiredOrUnemployedPreviousJobTitle').value;
          break;
        case 'Employment Net Worth Amount':
          template.valueString = this.employmentSourceOfWealthForm.get('employmentNetWorth').value ||
            this.housewifeSourceOfWealthForm.get('housewifeNetWorth').value ||
            this.retiredOrUnemployedSourceOfWealthForm.get('retiredOrUnemployedNetWorth').value;
          break;
        case 'Employment Job Category':
          template.valueString = this.employmentSourceOfWealthForm.get('employmentJobCategory').value ||
            this.housewifeSourceOfWealthForm.get('spouseJobCategory').value ||
            this.retiredOrUnemployedSourceOfWealthForm.get('retiredOrUnemployedPreviousJobCategory').value;
          break;
        case 'Employment Source of Net Worth Amount':
          template.valueString = NetWorthSources[this.housewifeSourceOfWealthForm.get('housewifeNetWorthSource').value] ||
            NetWorthSources[this.retiredOrUnemployedSourceOfWealthForm.get('retiredOrUnemployedNetWorthSource').value];
          break;
        case 'Employment Annual Income':
          template.valueString = this.employmentSourceOfWealthForm.get('employmentAnnualIncome').value;
          break;
        case 'Employment Company Name':
          template.valueString = this.employmentSourceOfWealthForm.get('employmentCompanyNameFull').value ||
            this.housewifeSourceOfWealthForm.get('spouseCompanyNameFull').value ||
            this.retiredOrUnemployedSourceOfWealthForm.get('retiredOrUnemployedPreviousCompanyNameFull').value;
          break;
        case 'Employment Employed':
          template.valueBoolean = this.sourceOfWealthForm.get('employmentEmployed').value;
          break;
        // Business
        case 'From Business':
          template.valueBoolean = this.formModel.sourceOfWealth.toggleDisplay.business;
          break;
        case 'Business Company Name':
          template.valueString = this.businessSourceOfWealthForm.get('businessCompanyNameFull').value;
          break;
        case 'Business Job Category':
          template.valueString = this.businessSourceOfWealthForm.get('businessJobCategory').value;
          break;
        case 'Business Annual Profit':
          template.valueString = this.businessSourceOfWealthForm.get('businessAnnualProfit').value;
          break;
        case 'Business Annual Revenue':
          template.valueString = this.businessSourceOfWealthForm.get('businessAnnualRevenue').value;
          break;
        // Student
        case 'From Student':
          template.valueBoolean = this.formModel.sourceOfWealth.toggleDisplay.student;
          break;
        case 'Student Institution':
          template.valueString = this.studentSourceOfWealthForm.get('studentInstitution').value;
          break;
        case 'Student Source of Net Worth Amount':
          template.valueString = NetWorthSources[this.studentSourceOfWealthForm.get('studentNetWorthSource').value];
          break;
        case 'Student Net Worth Amount':
          template.valueString = this.studentSourceOfWealthForm.get('studentNetWorth').value;
          break;
        // Others
        case 'Risk Disclosure Agreement':
          template.valueBoolean = true;
          break;
        case 'Terms and Conditions Footer 3':
          template.valueDecimal = this.riskDisclosureAcceptedAt;
          break;

        case 'Accredited Status':
          template.valueString = String(this.sourceOfWealthForm.get('accreditedStatus').value);
          break;
      }
    }

    for (const template of this.subscriptionAgreementTemplates) {
      switch (template.label) {
        case 'Terms and Conditions 1':
        case 'Terms and Conditions 2':
        case 'Terms and Conditions 3':
        case 'Terms and Conditions 4':
        case 'Terms and Conditions 5':
        case 'Terms and Conditions 6':
          template.valueBoolean = true;
          break;
        case 'Terms and Conditions Footer 2':
          template.valueString = String(this.currentDate);
          break;
      }
    }

    this._memberService.createMemberSubscriptionAgreement(this.subscriptionAgreementTemplates).subscribe(
      saResponse => {
        this._eventService.sendInvActivationEvent('INV-platform-agreement');
        this._memberService.updateMemberActivationStep({
          activationStepId: null,
          activationStepCode: CONFIGURATION.activation_step_code.fill_information
        })
          .subscribe(
            response => {
              this._authService.setActivationStepCode(CONFIGURATION.activation_step_code.fill_information);
              this._router.navigate(['/admin-investor']);
            },
            error => {
              this._notificationService.error(error.message);
            });

      },
      error => {
        this._notificationService.error();
      }
    );
  }

  onTaxResidencyChange(value: boolean): void {
    this.sourceOfWealthForm.patchValue({
      taxResidency: value
    });
  }

  openModal(id: string): void {
    this._modalService.open(id);
  }

  closeModal(id: string): void {
    this._modalService.close(id);
  }

  scrollDown(el: HTMLElement) {
    el.scrollTop = el.scrollTop + 300;
  }

  onRiskDisclosureAgreementAgree() {
    this._eventService.sendInvActivationEvent('INV-risk-disclosure');
    this.riskDisclosureAcceptedAt = new Date().getTime() / 1000;
    this.closeModal('fsRiskDisclosureModal');
  }

  checkAuthorizationConsent() {
    if (this.authorizationConsentForm.valid) {
      this.authorizationConsentModel = {
        faAuthorizationConsentAcceptedAt: Date.now()
      };
      this.authorizationConsentFlag = true;
    } else {
      this.authorizationConsentModel = {
        faAuthorizationConsentAcceptedAt: null
      };
      this.authorizationConsentFlag = false;
    }
  }

  authorizationConsentSubmit() {
    if (this.authorizationConsentModel
      && this.authorizationConsentModel.faAuthorizationConsentAcceptedAt
      && this.subscriptionAgreementTemplates.length) {
      const template = this.subscriptionAgreementTemplates.find(element => {
        return element.label === 'FA Authorization Consent Accepted At';
      });
      if (template) {
        template.valueDecimal = this.authorizationConsentModel.faAuthorizationConsentAcceptedAt;
      }
      this.changeStep(this.currentStep + 1);
    }
  }

}
