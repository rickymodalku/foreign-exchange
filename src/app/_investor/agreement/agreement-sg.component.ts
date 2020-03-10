
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {mergeMap, catchError} from 'rxjs/operators';
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
import { Router } from '@angular/router';
import {
  MemberBankAccount,
  SubscriptionAgreementTemplate
} from '../../models/member.class';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import { ValidatorService } from '../../services/validator.service';
import { ModalService } from 'app/services/modal.service';
import CONFIGURATION from '../../../configurations/configuration';
import { EventService } from '../../services/event.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { UtilityService } from '../../services/utility.service';
import { debounce } from 'lodash';

@Component({
  selector: 'agreement-sg',
  templateUrl: './agreement-sg.html'
})
export class AgreementSGComponent implements OnInit {
  bankForm: FormGroup;
  characteristicListData: Array<any>;
  configuration: any;
  currentStep: number;
  formModel: any;
  investmentProfileAggressiveListData: Array<any>;
  investmentProfileBalancedListData: Array<any>;
  investmentProfileConservativeListData: Array<any>;
  imageBaseUrl: any;
  genericQuestionnaireCheckBox: boolean;
  masterData: any;
  investmentProfileType: Array<any>;
  clickedInvestmentProfileType: string;
  selectedInvestmentProfileType: string;
  selectedInvestmentProfile: number;
  sourceOfWealthForm: FormGroup;
  steps: Array<any>;
  subscriptionAgreementTemplates: Array<SubscriptionAgreementTemplate>;
  suitabilityAssessmentModal: boolean;
  swiperConfiguration: SwiperConfigInterface;
  testimonialContent: Array<any>;
  testimonialContentFlag: boolean;
  showInvestmentProfiles: boolean;
  expandInvestmentProfile: string;
  platformAgreementHtml: string;
  platformAgreementScrollFlag: boolean;
  riskDisclosureScrollFlag: boolean;
  riskDisclosureAcceptedAt: any;
  @ViewChild('platformAgreementContainer', { static: false }) private platformAgreementContainer: ElementRef;
  @ViewChild('riskDisclosureContainer', { static: true }) private riskDisclosureContainer: ElementRef;
  debounceOnScrollEvent: any;
  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _formBuilder: FormBuilder,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _router: Router,
    private _translateService: TranslateService,
    private _validatorService: ValidatorService,
    private _modalService: ModalService,
    private _eventService: EventService,
    private _utilityService: UtilityService,
  ) {
    this.currentStep = 1;
    this.formModel = {
      bank: {
        bankOtherWithdrawalValid: true,
        bankOtherDepositValid: true,
        depositExisting: null,
        error: '',
        showBankOtherDeposit: false,
        showBankOtherWithdrawal: false,
        sameAsRemittance: false,
        success: '',
        validation: false,
        withdrawalExisting: null,
        depositBankId: '',
        withdrawalBankId: ''
      },
      sourceOfWealth: {
        display: {
          asset: false,
          gift: false,
          inheritance: false,
          other: false
        },
        error: '',
        errors: null,
        toggleDisplay: {
          business: false,
          employment: false,
          past: false
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
        employmentAnnualIncome: '',
      }
    };
    this.genericQuestionnaireCheckBox = true;
    this.showInvestmentProfiles = true;
    this.masterData = {
      accreditedStatuses: new Array<any>(),
      assetValueRanges: new Array<any>(),
      banks: new Array<any>(),
      bankAccountTypes: new Array<any>(),
      businessIncomeRanges: new Array<any>(),
      currencies: new Array<any>(),
      countries: new Array<any>(),
      employmentIncomeRanges: new Array<any>(),
      employmentPeriods: new Array<any>(),
      employmentStatuses: new Array<any>(),
      jobCategories: new Array<any>(),
      jobTitles: new Array<any>(),
    };
    this.bankForm = this._formBuilder.group({
      depositId: new FormControl(null, [Validators.pattern(this._validatorService.numberPattern)]),
      depositBankId: new FormControl(null, [Validators.required]),
      depositBankOther: new FormControl(null, []),
      depositBankAccountTypeId: new FormControl(null, [Validators.required]),
      depositBankBranch: new FormControl(null, [Validators.required]),
      depositBankAddress: new FormControl(null, []),
      depositBankSwiftCode: new FormControl(null, []),
      depositBankCurrency: new FormControl(null, [Validators.required]),
      depositBankNumber: new FormControl(null, [Validators.required]),
      depositBankName: new FormControl(null, [Validators.required]),
      withdrawalId: new FormControl(null, [Validators.pattern(this._validatorService.numberPattern)]),
      withdrawalBankId: new FormControl(null, [Validators.required]),
      withdrawalBankOther: new FormControl(null, []),
      withdrawalBankAccountTypeId: new FormControl(null, [Validators.required]),
      withdrawalBankBranch: new FormControl(null, [Validators.required]),
      withdrawalBankAddress: new FormControl(null, []),
      withdrawalBankSwiftCode: new FormControl(null, []),
      withdrawalBankCurrency: new FormControl(null, [Validators.required]),
      withdrawalBankNumber: new FormControl(null, [Validators.required]),
      withdrawalBankName: new FormControl(null, [Validators.required])
    });
    this.sourceOfWealthForm = this._formBuilder.group({
      assetDescription: new FormControl(null, []),
      assetValue: new FormControl(null, []),
      employmentCompanyNameFull: new FormControl(null, []),
      employmentCountryOfOperations: new FormControl(null, []),
      employmentStatus: new FormControl(null, [Validators.required]),
      employmentJobCategory: new FormControl(null, []),
      employmentTitle: new FormControl(null, []),
      employmentPeriod: new FormControl(null, []),
      employmentAnnualIncome: new FormControl(null, []),
      businessJobCategory: new FormControl(null, []),
      businessAnnualRevenue: new FormControl(null, []),
      businessAnnualProfit: new FormControl(null, []),
      businessCountryOfOperations: new FormControl(null, []),
      giftGiver: new FormControl(null, []),
      giftReason: new FormControl(null, []),
      giftAmount: new FormControl(null, []),
      inheritanceLineage: new FormControl(null, []),
      inheritanceAmount: new FormControl(null, []),
      otherDescription: new FormControl(null, []),
      otherValue: new FormControl(null, []),
      taxResidency: new FormControl(null, [])
    });
    this.investmentProfileType = new Array<any>();
    this.swiperConfiguration = _baseParameterService.sign_up_swipper_config;
    this.steps = new Array<any>();
    this.suitabilityAssessmentModal = false;
    this.subscriptionAgreementTemplates = new Array<SubscriptionAgreementTemplate>();
    this.configuration = CONFIGURATION;
    this.characteristicListData = new Array();
    this.investmentProfileConservativeListData = new Array();
    this.investmentProfileAggressiveListData = new Array();
    this.investmentProfileBalancedListData = new Array();
    this.selectedInvestmentProfileType = '';
    this.testimonialContent = new Array<any>();
    this.testimonialContentFlag = false;
    this.imageBaseUrl = CONFIGURATION.image_base_url;
    this.expandInvestmentProfile = '';
    this.platformAgreementHtml = '';
    this.platformAgreementScrollFlag = false;
    this.riskDisclosureScrollFlag = false;
    this.debounceOnScrollEvent = debounce(
      (container) => this.onScroll(container),
      100);
  }

  ngOnInit() {
    this._translateService
      .get('investor-agreement.assessment.general-questionaire.characteristic.content')
      .subscribe(
        characteristicListData => {
          for (let key in characteristicListData) {
            this.characteristicListData.push({
              value: characteristicListData[key]['value'],
            });
          }
        });

    this._translateService
      .get('investor-agreement.assessment.investment-profile.content.0.content')
      .subscribe(
        investmentProfileConservativeListData => {
          for (let key in investmentProfileConservativeListData) {
            this.investmentProfileConservativeListData.push({
              value: investmentProfileConservativeListData[key]['value'],
            });
          }
        });

    this._translateService
      .get('investor-agreement.assessment.investment-profile.content.1.content')
      .subscribe(
        investmentProfileBalancedListData => {
          for (let key in investmentProfileBalancedListData) {
            this.investmentProfileBalancedListData.push({
              value: investmentProfileBalancedListData[key]['value'],
            });
          }
        });

    this._translateService
      .get('investor-agreement.assessment.investment-profile.content.2.content')
      .subscribe(
        investmentProfileAggressiveListData => {
          for (let key in investmentProfileAggressiveListData) {
            this.investmentProfileAggressiveListData.push({
              value: investmentProfileAggressiveListData[key]['value'],
            });
          }
        });

    this._memberService
      .getMemberMasterData(this._authService.getMemberTypeCode())
      .subscribe(
        response => {
          let masterData = response.data;
          this.masterData.bankAccountTypes = masterData.bankAccountTypes.filter(bankAccountType => {
            return bankAccountType.countryId === CONFIGURATION.country_code;
          });
        },
        error => {
          this._notificationService.error();
        }
      );
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
    this._translateService
      .get('investor-agreement.step')
      .subscribe(
        steps => {
          let i = 0;
          for (let data of steps) {
            this.steps.push({
              index: i = i + 1,
              key: data.key,
              label: data.label
            });
          }
          this.changeStep(this.currentStep, true);
          if (this._authService.getActivationStepCode() === CONFIGURATION.activation_step_code['suitability_assessment_test']) {
            this.changeStep(this.currentStep + 1);
          }
        }
      );


    this._translateService
      .get('investor-agreement.assessment.investment-type')
      .subscribe(
        investmentType => {
          for (const key in investmentType) {
            this.investmentProfileType.push({
              key: investmentType[key].key,
              value: investmentType[key].value
            });
          }
        }
      );

    this._translateService
      .get('master')
      .subscribe(
        masterData => {
          this.masterData.accreditedStatuses = masterData['accredited-statuses'];
          this.masterData.employmentPeriods = masterData['employment-periods'];
          this.masterData.jobCategories = masterData['job-categories'];
          this.masterData.jobTitles = masterData['job-levels'];
        }
      );

    this._memberService
      .getIncomeRange(CONFIGURATION.country_code)
      .subscribe(incomeRanges => {
        for (const incomeRange of incomeRanges.data) {
          switch (incomeRange['source_of_wealth_type']) {
            case 'ASSET':
              this.masterData.assetValueRanges.push({
                'type': incomeRange['income_range_type'],
                'name': incomeRange['name']
              });
              break;
            case 'BUSINESS':
              this.masterData.businessIncomeRanges.push({
                'type': incomeRange['income_range_type'],
                'name': incomeRange['name']
              });
              break;
            case 'EMPLOYMENT':
              this.masterData.employmentIncomeRanges.push({
                'type': incomeRange['income_range_type'],
                'name': incomeRange['name']
              });
              break;
            default:
              break;
          }
        }
      });

    this._translateService
      .get('form.onboarding-investor.image-swipper')
      .subscribe(
        testimonial => {
          this.testimonialContent = testimonial;
          this.testimonialContentFlag = true;
        });
    this.masterData.employmentStatuses = this._baseParameterService.getEmploymentStatuses();
  }

  changeStep(stepIndex: number, firstLoad: boolean = false): void {
    let step = this.steps.find(step => {
      return step.index === stepIndex;
    });
    if (step) {
      window.scrollTo(0, 0);
      this.currentStep = step.index;
      switch (step.key) {
        case 1:
          this.initializeBank(firstLoad);
          break;
        case 2:
          this.initializeSourceOfWealth();
          break;
        case 3:
          this._memberService
            .getPlatformAgreement(CONFIGURATION.country_code)
            .subscribe(
              platformAgreement => {
                this.platformAgreementHtml = platformAgreement.data.content;
              },
              error => {
                this._notificationService.error(error);
              });
          break;
      }
    }
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
    let control = this.sourceOfWealthForm.get(formControlName).value;
    return control !== null && control !== '' && control.length > 0;
  }

  initializeBank(firstLoad: boolean) {
    this._memberService
      .getMemberDetail()
      .subscribe(
        member => {
          if (member.firstName) {
            this.bankForm.patchValue({
              depositBankName: member.firstName,
              withdrawalBankName: member.firstName
            });
          }
          this.formModel.bank.depositExisting = member.memberBankAccounts.find(memberBankAccount => {
            return memberBankAccount.isDefault;
          });
          // if the user does not have a default account and if there is already an exisiting bank
          // account then we set it as default, this is for user who came back to complete the flow
          if (!this.formModel.bank.depositExisting && member.memberBankAccounts.length > 0) {
            this.formModel.bank.depositExisting = member.memberBankAccounts[0];
          }
          this.formModel.bank.withdrawalExisting = member.memberBankAccounts.find(memberBankAccount => {
            return !memberBankAccount.isDefault;
          });
          if (this.formModel.bank.depositExisting && this.formModel.bank.withdrawalExisting) {
            if (firstLoad) {
              this.changeStep(this.currentStep + 1);
            } else {
              this.patchDepositDetails();
              this.patchWithdrawalDetails();
            }
          } else if (this.formModel.bank.depositExisting) {
            this.patchDepositDetails();
          } else if (this.formModel.bank.withdrawalExisting) {
            this.patchWithdrawalDetails();
          }
          if (this.masterData.banks.length === 0 && this.masterData.currencies.length === 0) {
            this._memberService
              .getLookUpMasterData()
              .subscribe(
                response => {
                  let masterData = response.data;
                  this.masterData.banks = masterData.banks;
                  this.masterData.countries = this._utilityService.shiftElementToTheTopOfArray(masterData.countries);
                  this.masterData.currencies = masterData.currencies;
                  let currency = this.masterData.currencies.find((element) => {
                    return element.code === CONFIGURATION.currency_code;
                  });
                  this.masterData.currencies = this.masterData.currencies.filter((element) => {
                    return element.code !== CONFIGURATION.currency_code;
                  });
                  this.masterData.currencies.unshift(currency);
                  if (this.formModel.bank.depositExisting !== undefined) {
                    if (this.formModel.bank.depositExisting.bankOther !== '') {
                      this.formModel.bank.showBankOtherDeposit = true;
                    }
                  }
                  if (this.formModel.bank.withdrawalExisting !== undefined) {
                    if (this.formModel.bank.withdrawalExisting.bankOther !== '') {
                      this.formModel.bank.showBankOtherWithdrawal = true;
                    }
                  }

                  for (const x of this.masterData.banks) {
                    if (x.id === this._baseParameterService.other_bank_id[CONFIGURATION.country_code]) {
                      this.masterData.banks.push(this.masterData.banks.splice(this.masterData.banks.indexOf(x), 1)[0]);
                    }
                  }

                },
                error => {
                  this._notificationService.error();
                }
              );
          }
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  patchDepositDetails() {
    this.bankForm.patchValue({
      depositId: this.formModel.bank.depositExisting.id,
      depositBankId: this.formModel.bank.depositExisting.bankId,
      depositBankOther: this.formModel.bank.depositExisting.bankOther,
      depositBankAccountTypeId: this.formModel.bank.depositExisting.bankAccountTypeId,
      depositBankBranch: this.formModel.bank.depositExisting.branch,
      depositBankAddress: this.formModel.bank.depositExisting.address,
      depositBankSwiftCode: this.formModel.bank.depositExisting.swiftCode,
      depositBankCurrency: this.formModel.bank.depositExisting.currency,
      depositBankName: this.formModel.bank.depositExisting.name,
      depositBankNumber: this.formModel.bank.depositExisting.number,
    });
  }

  patchWithdrawalDetails() {
    this.bankForm.patchValue({
      withdrawalId: this.formModel.bank.withdrawalExisting.id,
      withdrawalBankId: this.formModel.bank.withdrawalExisting.bankId,
      withdrawalBankOther: this.formModel.bank.withdrawalExisting.bankOther,
      withdrawalBankAccountTypeId: this.formModel.bank.withdrawalExisting.bankAccountTypeId,
      withdrawalBankBranch: this.formModel.bank.withdrawalExisting.branch,
      withdrawalBankAddress: this.formModel.bank.withdrawalExisting.address,
      withdrawalBankSwiftCode: this.formModel.bank.withdrawalExisting.swiftCode,
      withdrawalBankCurrency: this.formModel.bank.withdrawalExisting.currency,
      withdrawalBankNumber: this.formModel.bank.withdrawalExisting.number,
      withdrawalBankName: this.formModel.bank.withdrawalExisting.name
    });
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
                if (member.citizenshipCountryId === 'SG') {
                  this.sourceOfWealthForm.patchValue({
                    taxResidency: true
                  });
                }
                let template = this.subscriptionAgreementTemplates.find(element => {
                  return element.label === 'Fullname';
                });
                if (template) {
                  template.valueString = member.firstName;
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

                template = this.subscriptionAgreementTemplates.find(element => {
                  return element.label === 'Date of Birth';
                });
                if (template) {
                  template.valueString = member.birthDate.toString();
                }

                template = this.subscriptionAgreementTemplates.find(element => {
                  return element.label === 'Phone Number';
                });
                if (template) {
                  template.valueString = member.phoneNumber;
                }

                template = this.subscriptionAgreementTemplates.find(element => {
                  return element.label === 'Mobile Phone Number';
                });
                if (template) {
                  template.valueString = member.mobilePhoneNumber;
                }

                template = this.subscriptionAgreementTemplates.find(element => {
                  return element.label === 'Citizenship Nationality';
                });
                if (template) {
                  template.valueString = this.masterData.countries.find(element => {
                    return element.code === member.citizenshipCountryId;
                  }).name;
                }

                template = this.subscriptionAgreementTemplates.find(element => {
                  return element.label === 'Residential Address';
                });
                if (template) {
                  template.valueString = [member.address1, member.address2, member.zipCode, member.unitNumber].
                    filter(function (val) { return val && val.length > 0; }).join(' ');
                }

                template = this.subscriptionAgreementTemplates.find(element => {
                  return element.label === 'Business Address';
                });
                if (template) {
                  template.valueString = member.companyAddress1;
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

  onBankIdChange(value: string, accountType: string = null): void {
    const existingBank = this.masterData.banks.find(bank => {
      return bank.id === value;
    });
    if (accountType === 'deposit') {
      this.formModel.bank.showBankOtherDeposit = existingBank && existingBank.name === 'Other';
      this.bankForm.patchValue({
        depositBankOther: null
      });
    } else {
      this.formModel.bank.showBankOtherWithdrawal = existingBank && existingBank.name === 'Other';
      this.bankForm.patchValue({
        withdrawalBankOther: null
      });
    }
  }

  onBankFormSubmit(): void {
    this.formModel.bank.validation = true;
    this.formModel.bank.bankOtherDepositValid = !this.formModel.bank.showBankOtherDeposit ||
      (this.formModel.bank.showBankOtherDeposit
        && this.bankForm.value.depositBankOther &&
        this.bankForm.value.depositBankOther.length > 0);

    this.formModel.bank.bankOtherWithdrawalValid = !this.formModel.bank.showBankOtherWithdrawal ||
      (this.formModel.bank.showBankOtherWithdrawal
        && this.bankForm.value.withdrawalBankOther &&
        this.bankForm.value.withdrawalBankOther.length > 0);

    if (this.formModel.bank.bankOtherDepositValid &&
      this.formModel.bank.bankOtherWithdrawalValid &&
      this.bankForm.valid) {
      if (this.formModel.bank.depositExisting) {
        let list = new Array<MemberBankAccount>();
        list.push(<MemberBankAccount>({
          address: this.bankForm.value.depositBankAddress,
          bankAccountTypeId: this.bankForm.value.depositBankAccountTypeId,
          bankId: this.bankForm.value.depositBankId,
          bankOther: this.formModel.bank.showBankOtherDeposit ? this.bankForm.value.depositBankOther : '',
          branch: this.bankForm.value.depositBankBranch,
          currency: this.bankForm.value.depositBankCurrency,
          id: this.bankForm.value.depositId,
          isDefault: true,
          isValid: true,
          memberId: this._authService.getMemberId(),
          name: this.bankForm.value.depositBankName,
          number: this.bankForm.value.depositBankNumber,
          pic: this._authService.getUserName() +
            (!this._authService.isAdministrator() ? ' (' + this._authService.getSubaccountUserName() + ')' : ''),
          swiftCode: this.bankForm.value.depositBankSwiftCode
        }));
        this._memberService
          .updateBankAccounts(
            list
          )
          .subscribe(
            response => {
              let list = new Array<MemberBankAccount>();
              // If the deposit is not same as withdrawal then we submit this response
              if (!this.formModel.bank.sameAsRemittance) {
                list.push(<MemberBankAccount>({
                  address: this.bankForm.value.withdrawalBankaddress,
                  bankAccountTypeId: this.bankForm.value.withdrawalBankAccountTypeId,
                  bankId: this.bankForm.value.withdrawalBankId,
                  bankOther: this.formModel.bank.showBankOtherWithdrawal ? this.bankForm.value.withdrawalBankOther : '',
                  branch: this.bankForm.value.withdrawalBankBranch,
                  currency: this.bankForm.value.withdrawalBankCurrency,
                  id: this.bankForm.value.withdrawalId,
                  isDefault: false,
                  isValid: true,
                  memberId: this._authService.getMemberId(),
                  name: this.bankForm.value.withdrawalBankName,
                  number: this.bankForm.value.withdrawalBankNumber,
                  pic: this._authService.getUserName() +
                    (!this._authService.isAdministrator() ? ' (' + this._authService.getSubaccountUserName() + ')' : ''),
                  swiftCode: this.bankForm.value.withdrawalBankSwiftCode
                }));
                this._memberService
                  .updateBankAccounts(
                    list
                  ).subscribe(
                    response => {
                      this.formModel.bank.validation = false;
                      this.changeStep(this.currentStep + 1);
                    },
                    error => {
                      this._notificationService.error(error.message);
                    }
                  );
              } else {
                this.formModel.bank.validation = false;
                this.changeStep(this.currentStep + 1);
              }
            },
            error => {
              this._notificationService.error(error.message);
            }
          );
      } else {
        this._memberService
          .addBankAccount(<MemberBankAccount>({
            address: this.bankForm.value.depositBankAddress,
            bankAccountTypeId: this.bankForm.value.depositBankAccountTypeId,
            bankId: this.bankForm.value.depositBankId,
            bankOther: this.formModel.bank.showBankOtherDeposit ? this.bankForm.value.depositBankOther : '',
            branch: this.bankForm.value.depositBankBranch,
            currency: this.bankForm.value.depositBankCurrency,
            id: this.bankForm.value.depositId,
            isDefault: true,
            isValid: true,
            name: this.bankForm.value.depositBankName,
            number: this.bankForm.value.depositBankNumber,
            pic: this._authService.getUserName() +
              (!this._authService.isAdministrator() ? ' (' + this._authService.getSubaccountUserName() + ')' : ''),
            swiftCode: this.bankForm.value.depositBankSwiftCode
          }))
          .subscribe(
            response => {
              this._memberService
                .addBankAccount(<MemberBankAccount>({
                  address: this.bankForm.value.withdrawalBankAddress,
                  bankAccountTypeId: this.bankForm.value.withdrawalBankAccountTypeId,
                  bankId: this.bankForm.value.withdrawalBankId,
                  bankOther: this.formModel.bank.showBankOtherWithdrawal ? this.bankForm.value.withdrawalBankOther : '',
                  branch: this.bankForm.value.withdrawalBankBranch,
                  currency: this.bankForm.value.withdrawalBankCurrency,
                  id: this.bankForm.value.withdrawalId,
                  isDefault: false,
                  isValid: true,
                  name: this.bankForm.value.withdrawalBankName,
                  number: this.bankForm.value.withdrawalBankNumber,
                  pic: this._authService.getUserName() +
                    (!this._authService.isAdministrator() ? ' (' + this._authService.getSubaccountUserName() + ')' : ''),
                  swiftCode: this.bankForm.value.withdrawalBankSwiftCode
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
    let employmentStatus = this.masterData.employmentStatuses.find(element => {
      return parseInt(element.id) === parseInt(value);
    });
    if (employmentStatus) {
      for (let key in this.formModel.sourceOfWealth.toggleDisplay) {
        this.formModel.sourceOfWealth.toggleDisplay[key] = key === employmentStatus.target;
        this.formModel.sourceOfWealth.valid[key] = true;
      }
      this.sourceOfWealthForm.patchValue({
        employmentCompanyNameFull: null,
        employmentCountryOfOperations: null,
        employmentJobCategory: null,
        employmentTitle: null,
        employmentPeriod: null,
        employmentAnnualIncome: null,
        businessJobCategory: null,
        businessAnnualRevenue: null,
        businessAnnualProfit: null,
        businessCountryOfOperations: null,
      });
    }
  }

  onSourceOfWealthChange(target: string, value: boolean): void {
    this.formModel.sourceOfWealth.display[target] = value;
    this.sourceOfWealthForm.patchValue({
      inheritanceLineage: null,
      inheritanceAmount: null,
      giftGiver: null,
      giftReason: null,
      giftAmount: null,
      assetDescription: null,
      assetValue: null,
      otherDescription: null,
      otherValue: null
    });
  }

  onGeneralQuestionnaireSelectionChange(event) {
    this.showInvestmentProfiles = event.value;
  }

  onCopyDepositBankDetail(checked: boolean) {
    this.formModel.bank.showBankOtherWithdrawal = this.bankForm.value.depositBankOther ? true : false;
    if (checked) {
      this.bankForm.patchValue({
        withdrawalId: this.bankForm.value.depositId,
        withdrawalBankId: this.bankForm.value.depositBankId,
        withdrawalBankOther: this.bankForm.value.depositBankOther,
        withdrawalBankAccountTypeId: this.bankForm.value.depositBankAccountTypeId,
        withdrawalBankBranch: this.bankForm.value.depositBankBranch,
        withdrawalBankAddress: this.bankForm.value.depositBankAddress,
        withdrawalBankSwiftCode: this.bankForm.value.depositBankSwiftCode,
        withdrawalBankCurrency: this.bankForm.value.depositBankCurrency,
        withdrawalBankName: this.bankForm.value.depositBankName,
        withdrawalBankNumber: this.bankForm.value.depositBankNumber
      });
    } else {
      this.bankForm.patchValue({
        withdrawalId: '',
        withdrawalBankId: '',
        withdrawalBankOther: '',
        withdrawalBankAccountTypeId: '',
        withdrawalBankBranch: '',
        withdrawalBankAddress: '',
        withdrawalBankSwiftCode: '',
        withdrawalBankCurrency: '',
        withdrawalBankName: '',
        withdrawalBankNumber: ''
      });
    }
  }

  onSuitabilityAssessmentDescriptionPopup(type: string) {
    this.selectedInvestmentProfileType = type;
    this.openModal('suitabilityAssessmentModal');
  }
  onSuitabilityAssessmentSubmit(type: string) {
    this.selectedInvestmentProfile = this.investmentProfileType.find(element => {
      return element.value === type;
    });
  }

  onAssessmentSubmit() {
    if (this.genericQuestionnaireCheckBox != null) {
      if (this.genericQuestionnaireCheckBox === false) {
        this.openModal('genericQuestionaireModal');
      } else if (!this.selectedInvestmentProfile) {
        this._notificationService.info('Please select your investment profile');
      } else if (this.selectedInvestmentProfile['value'] === 'conservative') {
        this.openModal('genericQuestionaireModal');
      } else if (this.selectedInvestmentProfile['value'] === 'balanced' || this.selectedInvestmentProfile['value'] === 'aggressive') {
        this._memberService
          .saveGenericQuestionnaire({
            accepted: this.genericQuestionnaireCheckBox,
            pic: this._authService.getUserName()
          }).pipe(
          mergeMap(response => {
            return this._memberService
              .updateMemberActivationStep({
                activationStepId: null,
                activationStepCode: CONFIGURATION.activation_step_code.generic_questionnaire,
                pic: this._authService.getUserName()
              }).pipe(catchError(error => {
                return observableThrowError(new Error(error));
              }));
          }),
          mergeMap(response => {
            this.clickedInvestmentProfileType = null;
            return this._memberService.saveSuitabilityAssessment({
              type: this.selectedInvestmentProfile['key'],
              pic: this._authService.getUserName()
            }).pipe(catchError(error => {
              return observableThrowError(new Error(error));
            }));
          }),
          mergeMap(response => {
            return this._memberService
              .updateMemberActivationStep({
                activationStepId: null,
                activationStepCode: CONFIGURATION.activation_step_code.suitability_assessment_test,
                pic: this._authService.getUserName()
              }).pipe(catchError(error => {
                return observableThrowError(new Error(error));
              }));
          }),).subscribe(response => {
            window.scrollTo(0, 0);
            this.changeStep(this.currentStep + 1);
            this._eventService.sendInvActivationEvent('INV-assessment');
            this._authService.setActivationStepCode(CONFIGURATION.activation_step_code.suitability_assessment_test);
          }, error => {
            console.error('ERROR', error);
            this._notificationService.error(error.message);
          });
      }
    } else {
      this._notificationService.info('Please select your choice.');
    }
  }

  onSourceOfWealthFormSubmit(): void {
    this.formModel.sourceOfWealth.validation = true;
    if (this.sourceOfWealthForm.valid) {
      let anySelected = false;
      for (let key in this.formModel.sourceOfWealth.display) {
        if (this.formModel.sourceOfWealth.display[key]) {
          anySelected = true;
        }
      }
      for (let key in this.formModel.sourceOfWealth.toggleDisplay) {
        if (this.formModel.sourceOfWealth.toggleDisplay[key]) {
          anySelected = true;
        }
      }
      if (anySelected) {
        for (let key in this.formModel.sourceOfWealth.display) {
          if (this.formModel.sourceOfWealth.display[key]) {
            switch (key) {
              case 'asset':
                this.formModel.sourceOfWealth.valid.asset = this.checkSourceOfWealthCompletion('assetDescription') && this.checkSourceOfWealthCompletion('assetValue');
                break;
              case 'gift':
                this.formModel.sourceOfWealth.valid.gift = this.checkSourceOfWealthCompletion('giftGiver') && this.checkSourceOfWealthCompletion('giftReason') && this.checkSourceOfWealthCompletion('giftAmount');
                break;
              case 'inheritance':
                this.formModel.sourceOfWealth.valid.inheritance = this.checkSourceOfWealthCompletion('inheritanceLineage') && this.checkSourceOfWealthCompletion('inheritanceAmount');
                break;
              case 'other':
                this.formModel.sourceOfWealth.valid.other = this.checkSourceOfWealthCompletion('otherDescription') && this.checkSourceOfWealthCompletion('otherValue');
                break;
            }
          }
        }
        for (let key in this.formModel.sourceOfWealth.toggleDisplay) {
          if (this.formModel.sourceOfWealth.toggleDisplay[key]) {
            switch (key) {
              case 'business':
                this.formModel.sourceOfWealth.valid.business = this.checkSourceOfWealthCompletion('businessJobCategory') && this.checkSourceOfWealthCompletion('businessAnnualRevenue') && this.checkSourceOfWealthCompletion('businessAnnualProfit') && this.checkSourceOfWealthCompletion('businessCountryOfOperations');
                break;
              case 'employment':
                this.formModel.sourceOfWealth.valid.employment = this.checkSourceOfWealthCompletion('employmentJobCategory') && this.checkSourceOfWealthCompletion('employmentTitle') && this.checkSourceOfWealthCompletion('employmentPeriod') && this.checkSourceOfWealthCompletion('employmentAnnualIncome') && this.checkSourceOfWealthCompletion('employmentCountryOfOperations');
                break;
              case 'past':
                this.formModel.sourceOfWealth.valid.past = this.checkSourceOfWealthCompletion('employmentJobCategory') && this.checkSourceOfWealthCompletion('employmentTitle') && this.checkSourceOfWealthCompletion('employmentPeriod') && this.checkSourceOfWealthCompletion('employmentAnnualIncome') && this.checkSourceOfWealthCompletion('employmentCompanyNameFull') && this.checkSourceOfWealthCompletion('employmentCountryOfOperations');
                break;
            }
          }
        }
        let completeInformation = true;
        for (let key in this.formModel.sourceOfWealth.valid) {
          if (!this.formModel.sourceOfWealth.valid[key]) {
            completeInformation = false;
          }
        }
        if (completeInformation) {
          this.openModal('fsRiskDisclosureModal');
          this.formModel.sourceOfWealth.validation = false;
          this.changeStep(this.currentStep + 1);
          this._eventService.sendInvActivationEvent('INV-sow');
        }
      } else {
        this._notificationService.error(this.formModel.sourceOfWealth.errors['none-selected']);
      }
    }
  }

  onPlatformAgreementClick() {
    for (const template of this.subscriptionAgreementTemplates) {
      switch (template.label) {
        case 'Remittance Beneficiary Bank Account Name':
          template.valueString = this.bankForm.get('depositBankName').value;
          break;
        case 'Remittance Beneficiary Bank Account Number':
          template.valueString = this.bankForm.get('depositBankNumber').value;
          break;
        case 'Remittance Name of Beneficiary Bank':
          template.valueString = this.bankForm.get('depositBankId').value;
          break;
        case 'Remittance Name of Beneficiary Bank Other':
          template.valueString = this.bankForm.get('depositBankOther').value;
          break;
        case 'Remittance Name of Beneficiary Bank Branch':
          template.valueString = this.bankForm.get('depositBankBranch').value;
          break;
        case 'Remittance SWIFT of Beneficiary Bank':
          template.valueString = this.bankForm.get('depositBankSwiftCode').value;
          break;
        case 'Remittance Account Currency':
          template.valueString = this.bankForm.get('depositBankCurrency').value;
          break;
        case 'Designated Beneficiary Bank Account Name':
          template.valueString = this.bankForm.get('withdrawalBankName').value;
          break;
        case 'Designated Beneficiary Bank Account Number':
          template.valueString = this.bankForm.get('withdrawalBankNumber').value;
          break;
        case 'Designated Name of Beneficiary Bank':
          template.valueString = this.bankForm.get('withdrawalBankId').value;
          break;
        case 'Designated Name of Beneficiary Bank Other':
          template.valueString = this.bankForm.get('withdrawalBankOther').value;
          break;
        case 'Designated Name of Beneficiary Bank Branch':
          template.valueString = this.bankForm.get('withdrawalBankBranch').value;
          break;
        case 'Designated SWIFT of Beneficiary Bank':
          template.valueString = this.bankForm.get('withdrawalBankSwiftCode').value;
          break;
        case 'Designated Account Currency':
          template.valueString = this.bankForm.get('withdrawalBankCurrency').value;
          break;
        case 'Same As Remittance':
          template.valueBoolean = this.formModel.bank.sameAsRemittance;
          break;

        // Tax Residency
        case 'Tax Residency':
          template.valueBoolean = this.sourceOfWealthForm.get('taxResidency').value;
          break;

        // Employment
        case 'From Employment':
          template.valueBoolean = this.formModel.sourceOfWealth.toggleDisplay.employment
            || this.formModel.sourceOfWealth.toggleDisplay.past;
          break;
        case 'Employment Company Name':
          template.valueString = this.sourceOfWealthForm.get('employmentCompanyNameFull').value;
          break;
        case 'Employment Country of Operation':
          template.valueString = this.sourceOfWealthForm.get('employmentCountryOfOperations').value;
          break;
        case 'Employment Title':
          template.valueString = this.sourceOfWealthForm.get('employmentTitle').value;
          break;
        case 'Employment Period':
          template.valueString = this.sourceOfWealthForm.get('employmentPeriod').value;
          break;
        case 'Employment Annual Income Range':
          template.valueString = this.sourceOfWealthForm.get('employmentAnnualIncome').value;
          break;
        case 'Employment Job Category':
          template.valueString = this.sourceOfWealthForm.get('employmentJobCategory').value;
          break;

        // Business
        case 'From Business':
          template.valueBoolean = this.formModel.sourceOfWealth.toggleDisplay.business;
          break;
        case 'Business Annual Revenue Range':
          template.valueString = this.sourceOfWealthForm.get('businessAnnualRevenue').value;
          break;
        case 'Business Annual Profit':
          template.valueString = this.sourceOfWealthForm.get('businessAnnualProfit').value;
          break;
        case 'Business Country of Operation':
          template.valueString = this.sourceOfWealthForm.get('businessCountryOfOperations').value;
          break;
        case 'Business Job Category':
          template.valueString = this.sourceOfWealthForm.get('businessJobCategory').value;
          break;

        // Inheritance
        case 'From Inheritance':
          template.valueBoolean = this.formModel.sourceOfWealth.display.inheritance;
          break;
        case 'Inheritance Lineage':
          template.valueString = this.sourceOfWealthForm.get('inheritanceLineage').value;
          break;
        case 'Inheritance Amount':
          template.valueString = this.sourceOfWealthForm.get('inheritanceAmount').value;
          break;

        // Gift
        case 'From Gift':
          template.valueBoolean = this.formModel.sourceOfWealth.display.gift;
          break;
        case 'Gift Giver':
          template.valueString = this.sourceOfWealthForm.get('giftGiver').value;
          break;
        case 'Gift Reason':
          template.valueString = this.sourceOfWealthForm.get('giftReason').value;
          break;
        case 'Gift Amount':
          template.valueString = this.sourceOfWealthForm.get('giftAmount').value;
          break;

        // Asset
        case 'From Asset':
          template.valueBoolean = this.formModel.sourceOfWealth.display.asset;
          break;
        case 'Asset Description':
          template.valueString = this.sourceOfWealthForm.get('assetDescription').value;
          break;
        case 'Asset Value Range':
          template.valueString = this.sourceOfWealthForm.get('assetValue').value;
          break;

        // Other
        case 'From Others':
          template.valueBoolean = this.formModel.sourceOfWealth.display.other;
          break;
        case 'Others Description':
          template.valueString = this.sourceOfWealthForm.get('otherDescription').value;
          break;
        case 'Others Value':
          template.valueString = this.sourceOfWealthForm.get('otherValue').value;
          break;

        case 'Accredited Status':
          template.valueString = this.sourceOfWealthForm.get('accreditedStatus').value;
          break;
        case 'Employment Status':
          template.valueString = this.sourceOfWealthForm.get('employmentStatus').value;
          break;

        // Risk Disclosure
        case 'Risk Disclosure Agreement':
          template.valueBoolean = true;
          break;
        case 'Terms and Conditions Footer 3':
          template.valueDecimal = this.riskDisclosureAcceptedAt;
          break;
      }
    }
    this._memberService
      .createMemberSubscriptionAgreement(this.subscriptionAgreementTemplates)
      .subscribe(
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
          this._notificationService.error(error.message);
        }
      );
  }

  onRiskDisclosureAgreementAgree() {
    this._eventService.sendInvActivationEvent('INV-risk-disclosure');
    this.riskDisclosureAcceptedAt = new Date().getTime() / 1000;
    this.closeModal('fsRiskDisclosureModal');
  }

  onTaxResidencyChange(value: boolean): void {
    this.sourceOfWealthForm.patchValue({
      taxResidency: value
    });
  }

  onScrollDebounce(container: string): void {
    this.debounceOnScrollEvent(container);
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
}
