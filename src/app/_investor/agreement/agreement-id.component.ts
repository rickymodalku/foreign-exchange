
import { debounceTime } from 'rxjs/operators';
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
import { TranslateService } from '@ngx-translate/core';
import {
  MemberBankAccount,
  SubscriptionAgreementTemplate
} from '../../models/member.class';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import { ValidatorService } from '../../services/validator.service';
import CONFIGURATION from '../../../configurations/configuration';
import { EventService } from '../../services/event.service';
import {
  SwiperComponent,
  SwiperConfigInterface
} from 'ngx-swiper-wrapper';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs';
import { ModalService } from 'app/services/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'agreement-id',
  templateUrl: './agreement-id.html'
})

export class AgreementIDComponent implements OnInit {
  currentStep: number;
  currentDate: Date;
  formModel: any;
  masterData: any;
  imageBaseUrl: any;
  investorIndividualDetail: FormGroup;
  investorCompanyDetail: FormGroup;
  bankForm: FormGroup;
  sourceOfWealthForm: FormGroup;
  steps: Array<any>;
  selectedBank: any;
  subscriptionAgreementTemplates: Array<SubscriptionAgreementTemplate>;
  swiperConfiguration: SwiperConfigInterface;
  testimonialContent: Array<any>;
  testimonialContentFlag: boolean;
  configuration: any;
  companyAddressSubject: Subject<string> = new Subject();
  companyAddressNameList: any;
  companyAddressListFlag: boolean;
  countryCode: string;
  isReverification: boolean;

  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _memberService: MemberService,
    private _modalService: ModalService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _validatorService: ValidatorService,
    private _eventService: EventService
  ) {
    this.currentStep = 1;
    this.formModel = {
      sourceOfWealthFlag: {
        inheritance: false,
        gift: false,
        asset: false,
        other: false
      },
      isInsitutional: false,
      investorIndividualDetail: {
        citizenship: '',
        error: '',
        existing: null,
        success: '',
        validation: false
      },
      investorCompanyDetail: {
        error: '',
        existing: null,
        success: '',
        validation: false
      },
      bank: {
        bankOtherValid: true,
        error: '',
        existing: null,
        showBankOther: false,
        success: '',
        validation: false
      },
      termCondition: {
        fullName: '',
        ErrorNotification: '',
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
        zipCodeError: '',
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
        employmentStatus: ''
      }
    };
    this.masterData = {
      banks: new Array<any>(),
      bankAccountTypes: new Array<any>(),
      countries: new Array<any>(),
      currencies: new Array<any>(),
      employmentPeriods: new Array<any>(),
      employmentStatuses: new Array<any>(),
      jobCategories: new Array<any>(),
      jobTitles: new Array<any>(),
      wealthAmounts: new Array<any>(),
      religions: new Array<any>(),
      degrees: new Array<any>(),
      maritalStatuses: new Array<any>(),
      monthlyIncome: new Array<any>()
    };

    this.countryCode = CONFIGURATION.country_code;
    this.investorCompanyDetail = this._formBuilder.group({
      companyName: new FormControl(null, [Validators.required]),
      companyBirthDate: new FormControl(null, [Validators.required]),
      companyBirthPlace: new FormControl(null, [Validators.required]),
      companyPhoneNumber: new FormControl(null, [Validators.required]),
      companyEmail: new FormControl(null, [Validators.required, Validators.email]),
      companyAddress: new FormControl(null, [Validators.required]),
      companyAddress2: new FormControl(null, []),
      companydirectoridNumber: new FormControl(null, [Validators.required])
    });

    this.investorIndividualDetail = this._formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      birthDate: new FormControl(null, [Validators.required]),
      citizenship: new FormControl(null, [Validators.required]),
      phoneNumber: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      address1: new FormControl(null, [Validators.required]),
      address2: new FormControl(null, []),
      idCardNumber: new FormControl(null, [Validators.required])
    });

    this.bankForm = this._formBuilder.group({
      id: new FormControl(null, [Validators.pattern(this._validatorService.numberPattern)]),
      bankId: new FormControl(null, [Validators.required]),
      bankName: new FormControl(null, []),
      bankOther: new FormControl(null, []),
      bankAccountTypeId: new FormControl(null, [Validators.required]),
      branch: new FormControl(null, [Validators.required]),
      address: new FormControl(null, []),
      swiftCode: new FormControl(null, []),
      currency: new FormControl(null, [Validators.required]),
      number: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required])
    });
    this.sourceOfWealthForm = this._formBuilder.group({
      assetDescription: new FormControl(null, []),
      assetValue: new FormControl(null, []),
      employmentStatus: new FormControl(null, [Validators.required]),
      employmentJobCategory: new FormControl(null, []),
      employmentTitle: new FormControl(null, []),
      employmentPeriod: new FormControl(null, []),
      employmentAnnualIncome: new FormControl(null, []),
      businessJobCategory: new FormControl(null, []),
      businessAnnualRevenue: new FormControl(null, []),
      businessAnnualProfit: new FormControl(null, []),
      companyAddress: new FormControl(null, []),
      companyCountryId: new FormControl(null, []),
      companyAreaCode: new FormControl(null, []),
      companyZipCode: new FormControl(null, []),
      companyAreaName: new FormControl(null, []),
      giftGiver: new FormControl(null, []),
      giftReason: new FormControl(null, []),
      giftAmount: new FormControl(null, []),
      inheritanceAmount: new FormControl(null, []),
      inheritanceLineage: new FormControl(null, []),
      otherDescription: new FormControl(null, []),
      otherValue: new FormControl(null, []),
      taxResidency: new FormControl(null, [])
    });
    this.swiperConfiguration = _baseParameterService.sign_up_swipper_config;
    this.steps = new Array<any>();
    this.subscriptionAgreementTemplates = new Array<SubscriptionAgreementTemplate>();
    this.testimonialContent = new Array<any>();
    this.testimonialContentFlag = false;
    this.configuration = CONFIGURATION;
    this.imageBaseUrl = CONFIGURATION.image_base_url;

    this.companyAddressSubject.pipe(debounceTime(750)).subscribe(searchTextValue => {
      if (searchTextValue) {
        this.getAddressLocation(searchTextValue);
      }
    });
  }

  companyAddressKeyUpEvent(text: string) {
    this.companyAddressSubject.next(text);
  }

  closeModal(modalId: string) {
    this._modalService.close(modalId);
  }

  ngOnInit() {
    this.isReverification = this._authService.getMemberStatusCode() === CONFIGURATION.member_status.reverification;
    this._memberService
      .getLookUpMasterData()
      .subscribe(
        response => {
          let masterData = response.data;
          if (this.isReverification) {
            this._modalService.open('informationPopUp');
          }

          this.masterData.countries = masterData.countries;
          this.masterData.countries = this.masterData.countries.filter((element) => {
            return element.code !== CONFIGURATION.country_code;
          });
          this.masterData.countries.unshift({
            code: CONFIGURATION.country_code,
            name: CONFIGURATION.country_name
          });
          this.masterData.genders = masterData.genders;
        },
        error => {
          this._notificationService.error();
        }
      );

    this._translateService
      .get('investor-dashboard.rdn-information.form.error-no-zip-code-found')
      .subscribe(
        error => {
          this.formModel.sourceOfWealth.zipCodeError = error;
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
          if (this.isReverification) {
            this.changeStep(this.currentStep + 1);
            this.initializePersonalDetail(false);
          } else {
            this.changeStep(this.currentStep);
          }
        }
      );

    this._memberService
      .getReligion(CONFIGURATION.country_code)
      .subscribe(
        response => {
          this.masterData.religions = response.data;
        },
        error => {
          this._notificationService.error(error);
        }
      );

    this._memberService
      .getDegree(CONFIGURATION.country_code)
      .subscribe(
        response => {
          this.masterData.degrees = response.data;
        },
        error => {
          this._notificationService.error(error);
        }
      );

    this._translateService
      .get('master')
      .subscribe(
        masterData => {
          this.masterData.employmentPeriods = masterData['employment-periods'];
          this.masterData.employmentStatuses = masterData['employment-statuses'];
          this.masterData.jobCategories = masterData['job-categories'];
          this.masterData.jobTitles = masterData['job-levels'];
          this.masterData.wealthAmounts = masterData['annual-revenues'];
          this.masterData.monthlyIncome = masterData['monthly-revenues'];
          this.masterData.bankAccountTypes = masterData['bank-account-types'];
          this.masterData.maritalStatuses = masterData['marital-status'];
        });
    this._translateService
      .get('form.onboarding-investor.image-swipper')
      .subscribe(
        testimonial => {
          this.testimonialContent = testimonial;
          this.testimonialContentFlag = true;
        });
  }

  changeStep(stepIndex: number, firstLoad: boolean = false): void {
    let step = this.steps.find(step => {
      return step.index === stepIndex;
    });
    window.scrollTo(0, 0);
    this.currentStep = step.index;

    if (step) {
      window.scrollTo(0, 0);
      this.currentStep = step.index;
      switch (step.key) {
        case 0:
          this.initializePersonalDetail(firstLoad);
          break;
        case 1:
          this.initializeBank();
          break;
        case 2:
          this.initializeSourceOfWealth();
          break;
        case 3:
          this.initializeTermCondition();
          break;
      }
    }
  }

  downloadLatestBlankSA(): void {
    this._memberService.getLatestBlankSA(this.countryCode).subscribe(
      response => {
        const blob = new Blob([response._body], { type: 'application/pdf' });
        const fileName = 'Subscription_Agreement.pdf';
        saveAs(blob, fileName);
      },
      error => {
        this._notificationService.error();
      }
    );
  }

  checkSourceOfWealthCompletion(formControlName: string): boolean {
    let control = this.sourceOfWealthForm.get(formControlName).value;
    return control !== null && control !== '' && control.length > 0;
  }

  initializeTermCondition(): void {
    this.currentDate = new Date();
    this._memberService
      .getMemberDetail()
      .subscribe(
        member => {
          this.formModel.termCondition.fullName = member.firstName;
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  initializePersonalDetail(firstLoad: boolean): void {
    this._memberService
      .getSubscriptionAgreementTemplates()
      .subscribe(
        subscriptionAgreementTemplates => {
          this.subscriptionAgreementTemplates = subscriptionAgreementTemplates;
          this._memberService
            .getMemberDetail()
            .subscribe(
              member => {
                this.formModel.investorIndividualDetail.existing = member;
                if (this.formModel.investorIndividualDetail.existing) {
                  if (firstLoad) {
                    this.changeStep(this.currentStep + 1);
                  } else {
                    this.investorIndividualDetail.patchValue({
                      name: this.formModel.investorIndividualDetail.existing.firstName,
                      phoneNumber: this.formModel.investorIndividualDetail.existing.mobilePhoneNumber,
                      email: this.formModel.investorIndividualDetail.existing.userName,
                      idCardNumber: this.formModel.investorIndividualDetail.existing.icNumber,
                      address1: this.formModel.investorIndividualDetail.existing.address1,
                      address2: this.formModel.investorIndividualDetail.existing.address2,
                      citizenship: this.formModel.investorIndividualDetail.existing.citizenshipCountryId,
                    });
                    this.formModel.investorIndividualDetail.citizenship = this.formModel.investorIndividualDetail.existing.citizenshipCountryId;
                    if (this.formModel.investorIndividualDetail.existing.birthDate) {
                      this.investorIndividualDetail.patchValue({
                        birthDate: new Date(this.formModel.investorIndividualDetail.existing.birthDate),
                      });
                    }
                  }
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

  initializeBank(): void {
    this._memberService
      .getMemberDetail()
      .subscribe(
        member => {
          if (member.firstName) {
            this.bankForm.patchValue({
              name: member.firstName
            });
          }

          this.formModel.bank.existing = member.memberBankAccounts.find(memberBankAccount => {
            return memberBankAccount.isDefault;
          });

          if (this.formModel.bank.existing) {
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
          this.masterData.banks = [];
          this._memberService
            .getLookUpMasterData()
            .subscribe(
              response => {
                const masterData = response.data;
                Object.keys(masterData.banks).forEach(key => {
                  this.masterData.banks.push({
                    label: masterData.banks[key].name,
                    value: { id: masterData.banks[key].id }
                  });
                });

                this.masterData.currencies = masterData.currencies;

                if (this.formModel.bank.existing) {
                  this.bankForm.patchValue({
                    bankName: this.masterData.banks.find((element) => {
                      return element.value.id === this.formModel.bank.existing.bankId;
                    }).label
                  });

                  this.selectedBank = this.masterData.banks.find((element) => {
                    return element.value.id === this.formModel.bank.existing.bankId;
                  }).label;
                }

                let currency = this.masterData.currencies.find((element) => {
                  return element.code === CONFIGURATION.currency_code;
                });
                this.masterData.currencies = this.masterData.currencies.filter((element) => {
                  return element.code !== CONFIGURATION.currency_code;
                });

                for (const x of this.masterData.banks) {
                  if (x.value.id === this._baseParameterService.other_bank_id[CONFIGURATION.country_code]) {
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
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  initializeSourceOfWealth(): void {
    this._memberService
      .getMemberDetail()
      .subscribe(
        member => {
          if (member.areaId != null) {
            this._memberService.getAreaName(this.countryCode, member.areaId).
              subscribe(
                addressList => {
                  const residentialAddressDetail = addressList.data[0];
                  const investorPersonalTemplateMapping = {
                    investorICNumber: {
                      templateLabel: 'IC/Passport Number',
                      value: member.icNumber,
                      valueType: 'string'
                    },
                    investorFullName: {
                      templateLabel: 'Fullname',
                      value: member.fullName,
                      valueType: 'string'
                    },
                    investorGender: {
                      templateLabel: 'Gender',
                      value: this.masterData.genders.find(o => o.id === member.genderId).name,
                      valueType: 'string'
                    },
                    investorEmail: {
                      templateLabel: 'Email',
                      value: member.userName,
                      valueType: 'string'
                    },
                    investorBirthOfDate: {
                      templateLabel: 'Date of Birth',
                      value: member.birthDate,
                      valueType: 'string'
                    },
                    investorCitizenShip: {
                      templateLabel: 'Citizenship Nationality',
                      value: this.masterData.countries.find(o => o.code === member.citizenshipCountryId).name,
                      valueType: 'string'
                    },
                    investorMobilePhoneNumber: {
                      templateLabel: 'Mobile Phone Number',
                      value: member.mobilePhoneNumber,
                      valueType: 'string'
                    },
                    investorResidentialAddress: {
                      templateLabel: 'Residential Address',
                      value: member.address1,
                      valueType: 'string'
                    },
                    investorMaritalStatus: {
                      templateLabel: 'Marital Status',
                      value: this.masterData.maritalStatuses.find(o => o.id === member.maritalStatusId).name,
                      valueType: 'string'
                    },
                    investorSpouseName: {
                      templateLabel: 'Spouse\'s Fullname',
                      value: this.masterData.spouseFullName,
                      valueType: 'string'
                    },
                    investorMotherMaidenName: {
                      templateLabel: 'Mother\'s Maiden Name',
                      value: member.motherMaidenName,
                      valueType: 'string'
                    },
                    investorBirthPlace: {
                      templateLabel: 'Place of Birth',
                      value: member.birthPlace,
                      valueType: 'string'
                    },
                    investorTaxCardNumber: {
                      templateLabel: 'Tax Card Number',
                      value: member.taxCardNumber,
                      valueType: 'string'
                    },
                    investorReligion: {
                      templateLabel: 'Religion',
                      value: this.masterData.religions.find(o => o.code === member.religionCode).name,
                      valueType: 'string'
                    },
                    investorDegree: {
                      templateLabel: 'Degree',
                      value: this.masterData.degrees.find(o => o.code === member.degreeCode).name,
                      valueType: 'string'
                    },
                    investorResidentialCountry: {
                      templateLabel: 'Residential Country',
                      value: this.masterData.countries.find(o => o.code === member.countryId).name,
                      valueType: 'string'
                    },
                    investorResidentialAreaName: {
                      templateLabel: 'Residential Area',
                      value: residentialAddressDetail.area_name,
                      valueType: 'string'
                    },
                    investorResidentialCityName: {
                      templateLabel: 'Residential City',
                      value: residentialAddressDetail.city_name,
                      valueType: 'string'
                    },
                    investorResidentialDistrictName: {
                      templateLabel: 'Residential District',
                      value: residentialAddressDetail.district_name,
                      valueType: 'string'
                    },
                    investorResidentialProvinceName: {
                      templateLabel: 'Residential Province',
                      value: residentialAddressDetail.province_name,
                      valueType: 'string'
                    },
                    investorResidentialZipCode: {
                      templateLabel: 'Residential Zip Code',
                      value: member.zipCode,
                      valueType: 'string'
                    },
                    investorResidentialAreaCode: {
                      templateLabel: 'Residential Area Code',
                      value: member.areaCode,
                      valueType: 'string'
                    },
                  };

                  Object.keys(investorPersonalTemplateMapping).forEach(key => {
                    const patchedInvestorFormValue = this.patchInvestorFormValue(
                      this.subscriptionAgreementTemplates,
                      investorPersonalTemplateMapping[key].templateLabel,
                      investorPersonalTemplateMapping[key].value,
                      investorPersonalTemplateMapping[key].valueType);
                    this.subscriptionAgreementTemplates = Object.assign(this.subscriptionAgreementTemplates, patchedInvestorFormValue);
                  });
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

  onBankIdChange(value: string): void {
    let existingBank;
    if (value) {
      existingBank = this.masterData.banks.find(bank => {
        return bank.value.id === value;
      });

      this.selectedBank = this.masterData.banks.find(bank => {
        return bank.value.id === value;
      }).value;

      this.bankForm.patchValue({
        bankName: this.masterData.banks.find((element) => {
          return element.value.id === value;
        }).label
      });

    }
    this.formModel.bank.showBankOther = existingBank && existingBank.label === 'Other';
  }

  patchInvestorFormValue(subscriptionAgreementTemplates: object, label: string, value: any, valueType: string): object {
    const patchedSubscriptAgreementTemplate = Object.create(subscriptionAgreementTemplates);
    let patchInvestorFormValue = patchedSubscriptAgreementTemplate.find(element => {
      return element.label === label;
    });
    if (patchInvestorFormValue) {
      if (valueType === 'string') {
        patchInvestorFormValue.valueString = value;
      }
      if (valueType === 'boolean') {
        patchInvestorFormValue.valueBoolean = value;
      }
    }
    return patchInvestorFormValue;
  };


  onInvestorFormSubmit(): void {
    const isInstitutionalMapping = {
      isInstitutional: {
        templateLabel: 'Is Institutional',
        value: this.formModel.isInsitutional,
        valueType: 'boolean'
      }
    };

    Object.keys(isInstitutionalMapping).forEach(key => {
      const patchedInvestorFormValue = this.patchInvestorFormValue(
        this.subscriptionAgreementTemplates,
        isInstitutionalMapping[key].templateLabel,
        isInstitutionalMapping[key].value,
        isInstitutionalMapping[key].valueType);
      this.subscriptionAgreementTemplates = Object.assign(this.subscriptionAgreementTemplates, patchedInvestorFormValue);
    })

    if (this.formModel.isInsitutional) {
      this.formModel.investorCompanyDetail.validation = true;
      if (this.investorCompanyDetail.valid) {
        const investorCompanyDetailTemplateMapping = {
          investorBirthOfDate: {
            templateLabel: 'Date of Birth',
            value: this.investorCompanyDetail.get('companyBirthDate').value,
            valueType: 'string'
          },
          investorCitizenShip: {
            templateLabel: 'Citizenship Nationality',
            value: this.investorCompanyDetail.get('companyBirthPlace').value,
            valueType: 'string'
          },
          investorMobilePhoneNumber: {
            templateLabel: 'Mobile Phone Number',
            value: this.investorCompanyDetail.get('companyPhoneNumber').value,
            valueType: 'string'
          },
          investorEmail: {
            templateLabel: 'Email',
            value: this.investorCompanyDetail.get('companyEmail').value,
            valueType: 'string'
          },
          investorResidentialAddress: {
            templateLabel: 'Residential Address',
            value: this.investorCompanyDetail.get('companyAddress').value,
            valueType: 'string'
          },
          investorICPassportNumber: {
            templateLabel: 'IC/ Passport Number',
            value: this.investorCompanyDetail.get('companydirectoridNumber').value,
            valueType: 'string'
          },
        };

        Object.keys(investorCompanyDetailTemplateMapping).forEach(key => {
          const patchedInvestorFormValue = this.patchInvestorFormValue(
            this.subscriptionAgreementTemplates,
            investorCompanyDetailTemplateMapping[key].templateLabel,
            investorCompanyDetailTemplateMapping[key].value,
            investorCompanyDetailTemplateMapping[key].valueType);
          this.subscriptionAgreementTemplates = Object.assign(this.subscriptionAgreementTemplates, patchedInvestorFormValue);
        })

        this._eventService.sendInvActivationEvent('INV-investor-data');
        this.changeStep(this.currentStep + 1);
      }
    } else {
      this.formModel.investorIndividualDetail.validation = true;
      if (this.investorIndividualDetail.valid) {
        const investorFormTemplateMapping = {
          investorBirthOfDate: {
            templateLabel: 'Date of Birth',
            value: this.investorIndividualDetail.get('birthDate').value,
            valueType: 'string'
          },
          investorCitizenShip: {
            templateLabel: 'Citizenship Nationality',
            value: this.investorIndividualDetail.get('citizenship').value,
            valueType: 'string'
          },
          investorMobilePhoneNumber: {
            templateLabel: 'Mobile Phone Number',
            value: this.investorIndividualDetail.get('phoneNumber').value,
            valueType: 'string'
          },
          investorEmail: {
            templateLabel: 'Email',
            value: this.investorIndividualDetail.get('email').value,
            valueType: 'string'
          },
          investorResidentialAddress: {
            templateLabel: 'Residential Address',
            value: this.investorIndividualDetail.get('address1').value,
            valueType: 'string'
          },
          investorICPassportNumber: {
            templateLabel: 'IC/ Passport Number',
            value: this.investorIndividualDetail.get('idCardNumber').value,
            valueType: 'string'
          },
        };

        Object.keys(investorFormTemplateMapping).forEach(key => {
          const patchedInvestorFormValue = this.patchInvestorFormValue(
            this.subscriptionAgreementTemplates,
            investorFormTemplateMapping[key].templateLabel,
            investorFormTemplateMapping[key].value,
            investorFormTemplateMapping[key].valueType);
          this.subscriptionAgreementTemplates = Object.assign(this.subscriptionAgreementTemplates, patchedInvestorFormValue);
        })

        this.changeStep(this.currentStep + 1);
        this._eventService.sendInvActivationEvent('INV-investor-data');

      }
    }
  }


  onInstitutionalChange(): void {
    this.investorCompanyDetail.patchValue({
      companyName: '',
      companyBirthDate: '',
      companyBirthPlace: '',
      companyPhoneNumber: '',
      companyEmail: '',
      companyAddress: '',
      companyAddress2: ''
    });

    this.investorIndividualDetail.patchValue({
      address2: '',
    });

  }


  onTermConditionSubmit(): void {
    const termConditionTemplateMapping = {
      termCondition1: {
        templateLabel: 'Terms and Conditions 1',
        value: true,
        valueType: 'boolean'
      },
      termCondition2: {
        templateLabel: 'Terms and Conditions 2',
        value: true,
        valueType: 'boolean'
      },
      termCondition3: {
        templateLabel: 'Terms and Conditions 3',
        value: true,
        valueType: 'boolean'
      },
      termCondition4: {
        templateLabel: 'Terms and Conditions 4',
        value: true,
        valueType: 'boolean'
      },
      termCondition5: {
        templateLabel: 'Terms and Conditions 5',
        value: true,
        valueType: 'boolean'
      },
      termCondition6: {
        templateLabel: 'Terms and Conditions 6',
        value: true,
        valueType: 'boolean'
      },
      termConditionFooter: {
        templateLabel: 'Terms and Conditions Footer 2',
        value: String(this.currentDate),
        valueType: 'string'
      }
    };

    Object.keys(termConditionTemplateMapping).forEach(key => {
      const patchedInvestorFormValue = this.patchInvestorFormValue(
        this.subscriptionAgreementTemplates,
        termConditionTemplateMapping[key].templateLabel,
        termConditionTemplateMapping[key].value,
        termConditionTemplateMapping[key].valueType);
      this.subscriptionAgreementTemplates = Object.assign(this.subscriptionAgreementTemplates, patchedInvestorFormValue);
    })

    this._memberService
      .createMemberSubscriptionAgreement(this.subscriptionAgreementTemplates)
      .subscribe(
        response => {
          this._memberService.updateMemberActivationStepV2({
            'activation_step_code': CONFIGURATION.activation_step_code.fill_information
          }).subscribe(
            response => {
              this._eventService.sendInvActivationEvent('INV-tnc');
              this._memberService.getMemberDetail()
              .subscribe(
                memberDetail => {
                  this._authService.setActivationStepCode(memberDetail.activationStep.code);
                },
                error => {
                  this._notificationService.error(error);
                }
              );
              this.formModel.sourceOfWealth.validation = false;
              this.changeStep(this.currentStep + 1);
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
          bankId: this.bankForm.value.bankId.id,
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
            bankId: this.bankForm.value.bankId.id,
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

      const bankDetailTemplateMapping = {
        bankAccountName: {
          templateLabel: 'Remittance Beneficiary Bank Account Name',
          value: this.bankForm.get('name').value,
          valueType: 'string'
        },
        bankAccountNumber: {
          templateLabel: 'Remittance Beneficiary Bank Account Number',
          value: this.bankForm.get('number').value,
          valueType: 'string'
        },
        bankBeneficiaryName: {
          templateLabel: 'Remittance Name of Beneficiary Bank',
          value: this.bankForm.get('bankName').value,
          valueType: 'string'
        },
        bankBeneficiaryOtherName: {
          templateLabel: 'Remittance Name of Beneficiary Bank Other',
          value: this.bankForm.get('bankOther').value,
          valueType: 'string'
        },
        bankBeneficiaryBranchName: {
          templateLabel: 'Remittance Name of Beneficiary Bank Branch',
          value: this.bankForm.get('branch').value,
          valueType: 'string'
        },
        bankBeneficiaryBankAddress: {
          templateLabel: 'Remittance Name of Beneficiary Bank Address',
          value: this.bankForm.get('address').value,
          valueType: 'string'
        },
        bankBeneficiarySWIFT: {
          templateLabel: 'Remittance SWIFT of Beneficiary Bank',
          value: this.bankForm.get('swiftCode').value,
          valueType: 'string'
        },
        bankBeneficiaryCurrency: {
          templateLabel: 'Remittance Account Currency',
          value: this.bankForm.get('currency').value,
          valueType: 'string'
        },
      };

      Object.keys(bankDetailTemplateMapping).forEach(key => {
        const patchedInvestorFormValue = this.patchInvestorFormValue(
          this.subscriptionAgreementTemplates,
          bankDetailTemplateMapping[key].templateLabel,
          bankDetailTemplateMapping[key].value,
          bankDetailTemplateMapping[key].valueType);
        this.subscriptionAgreementTemplates = Object.assign(this.subscriptionAgreementTemplates, patchedInvestorFormValue);
      })

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
        employmentJobCategory: null,
        employmentTitle: null,
        employmentPeriod: null,
        employmentAnnualIncome: null,
        businessJobCategory: null,
        businessAnnualRevenue: null,
        businessAnnualProfit: null
      });
    }
  }

  onSourceOfWealthChange(target: string, value: boolean): void {
    this.formModel.sourceOfWealth.display[target] = value;
    this.sourceOfWealthForm.patchValue({
      inheritanceAmount: null,
      inheritanceLineage: null,
      giftGiver: null,
      giftReason: null,
      giftAmount: null,
      assetDescription: null,
      assetValue: null,
      otherDescription: null,
      otherValue: null
    });
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
                this.formModel.sourceOfWealth.valid.business = this.checkSourceOfWealthCompletion('businessJobCategory') &&
                  this.checkSourceOfWealthCompletion('businessAnnualRevenue') &&
                  this.checkSourceOfWealthCompletion('businessAnnualProfit') &&
                  this.checkSourceOfWealthCompletion('companyAddress') &&
                  this.checkSourceOfWealthCompletion('companyCountryId') &&
                  this.checkSourceOfWealthCompletion('companyZipCode') &&
                  this.checkSourceOfWealthCompletion('companyAreaName');
                break;
              case 'employment':
                this.formModel.sourceOfWealth.valid.employment = this.checkSourceOfWealthCompletion('employmentJobCategory') &&
                  this.checkSourceOfWealthCompletion('employmentTitle') &&
                  this.checkSourceOfWealthCompletion('employmentPeriod') &&
                  this.checkSourceOfWealthCompletion('employmentAnnualIncome') &&
                  this.checkSourceOfWealthCompletion('companyAddress') &&
                  this.checkSourceOfWealthCompletion('companyCountryId') &&
                  this.checkSourceOfWealthCompletion('companyZipCode') &&
                  this.checkSourceOfWealthCompletion('companyAreaName');
                break;
              case 'past':
                this.formModel.sourceOfWealth.valid.past = this.checkSourceOfWealthCompletion('businessJobCategory') &&
                  this.checkSourceOfWealthCompletion('businessAnnualRevenue') &&
                  this.checkSourceOfWealthCompletion('businessAnnualProfit');
                break;
            }
          }
        }

        let completeInformation = true;
        for (let key in this.formModel.sourceOfWealth.valid) {
          if (!this.formModel.sourceOfWealth.valid[key]) {
            completeInformation = false;
            //this._notificationService.error(this.formModel.sourceOfWealth.errors[key]);
          }
        }
        if (completeInformation) {
          const sourceOfWealthTemplateMapping = {
            // Tax Residency
            taxResidency: {
              templateLabel: 'Tax Residency',
              value: this.sourceOfWealthForm.get('taxResidency').value,
              valueType: 'boolean'
            },
            // Employment
            fromEmployment: {
              templateLabel: 'From Employment',
              value: this.formModel.sourceOfWealth.toggleDisplay.employment || this.formModel.sourceOfWealth.toggleDisplay.past,
              valueType: 'boolean'
            },
            employmentJobCategory: {
              templateLabel: 'Employment Job Category',
              value: this.sourceOfWealthForm.get('employmentJobCategory').value,
              valueType: 'string'
            },
            employmentTitle: {
              templateLabel: 'Employment Title',
              value: this.sourceOfWealthForm.get('employmentTitle').value,
              valueType: 'string'
            },
            employmentPeriod: {
              templateLabel: 'Employment Period',
              value: this.sourceOfWealthForm.get('employmentPeriod').value,
              valueType: 'string'
            },
            employmentAnnualIncome: {
              templateLabel: 'Employment Annual Income',
              value: this.sourceOfWealthForm.get('employmentAnnualIncome').value,
              valueType: 'string'
            },
            // Business
            fromBusiness: {
              templateLabel: 'From Business',
              value: this.formModel.sourceOfWealth.toggleDisplay.business,
              valueType: 'boolean'
            },
            businessJobCategory: {
              templateLabel: 'Business Job Category',
              value: this.sourceOfWealthForm.get('businessJobCategory').value,
              valueType: 'string'
            },
            businessAnnualRevenue: {
              templateLabel: 'Business Annual Revenue',
              value: this.sourceOfWealthForm.get('businessAnnualRevenue').value,
              valueType: 'string'
            },
            businessAnnualProfit: {
              templateLabel: 'Business Annual Profit',
              value: this.sourceOfWealthForm.get('businessAnnualProfit').value,
              valueType: 'string'
            },
            // Inheritance
            fromInheritance: {
              templateLabel: 'From Inheritance',
              value: this.formModel.sourceOfWealth.display.inheritance,
              valueType: 'boolean'
            },
            inheritanceLineage: {
              templateLabel: 'Inheritance Lineage',
              value: this.sourceOfWealthForm.get('inheritanceLineage').value,
              valueType: 'string'
            },
            inheritanceAmount: {
              templateLabel: 'Inheritance Amount',
              value: this.sourceOfWealthForm.get('inheritanceAmount').value,
              valueType: 'string'
            },
            //Gift
            fromGift: {
              templateLabel: 'From Gift',
              value: this.formModel.sourceOfWealth.display.gift,
              valueType: 'boolean'
            },
            giftGiver: {
              templateLabel: 'Gift Giver',
              value: this.sourceOfWealthForm.get('giftGiver').value,
              valueType: 'string'
            },
            giftReason: {
              templateLabel: 'Gift Reason',
              value: this.sourceOfWealthForm.get('giftReason').value,
              valueType: 'string'
            },
            giftAmount: {
              templateLabel: 'Gift Amount',
              value: this.sourceOfWealthForm.get('giftAmount').value,
              valueType: 'string'
            },
            //Asset
            fromAsset: {
              templateLabel: 'From Asset',
              value: this.formModel.sourceOfWealth.display.asset,
              valueType: 'boolean'
            },
            assetDescription: {
              templateLabel: 'Asset Description',
              value: this.sourceOfWealthForm.get('assetDescription').value,
              valueType: 'string'
            },
            assetValue: {
              templateLabel: 'Asset Value',
              value: this.sourceOfWealthForm.get('assetValue').value,
              valueType: 'string'
            },
            //Others
            fromOthers: {
              templateLabel: 'From Others',
              value: this.formModel.sourceOfWealth.display.other,
              valueType: 'boolean'
            },
            otherDescription: {
              templateLabel: 'Others Description',
              value: this.sourceOfWealthForm.get('otherDescription').value,
              valueType: 'string'
            },
            otherValue: {
              templateLabel: 'Others Value',
              value: this.sourceOfWealthForm.get('otherValue').value,
              valueType: 'string'
            },
            employmentStatus: {
              templateLabel: 'Employment Status',
              value: this.sourceOfWealthForm.get('employmentStatus').value,
              valueType: 'string'
            },
          };

          if (this.formModel.sourceOfWealth.toggleDisplay.business || this.formModel.sourceOfWealth.toggleDisplay.employment) {
            const companyAreaName = this.sourceOfWealthForm.get('companyAreaName').value;
            const residentialAddressDetail = this.companyAddressNameList.find(o => o.area_id === companyAreaName);
            let sourceOfWealthBusinessAddressTemplateMapping;
            if (this.formModel.sourceOfWealth.toggleDisplay.business) {
              sourceOfWealthBusinessAddressTemplateMapping = {
                businessAddress: {
                  templateLabel: 'Business Address 1',
                  value: this.sourceOfWealthForm.get('companyAddress').value,
                  valueType: 'string'
                },
                businessCountry: {
                  templateLabel: 'Business Country of Operation',
                  value: this.masterData.countries.find(o => o.code === this.sourceOfWealthForm.get('companyCountryId').value).name,
                  valueType: 'string'
                },
                businessProvince: {
                  templateLabel: 'Business Province',
                  value: residentialAddressDetail.province_name,
                  valueType: 'string'
                },
                businessCity: {
                  templateLabel: 'Business City',
                  value: residentialAddressDetail.city_name,
                  valueType: 'string'
                },
                businessDistrict: {
                  templateLabel: 'Business District',
                  value: residentialAddressDetail.district_name,
                  valueType: 'string'
                },
                businessArea: {
                  templateLabel: 'Business Area',
                  value: residentialAddressDetail.area_name,
                  valueType: 'string'
                },
                businessAreaCode: {
                  templateLabel: 'Business Area Code',
                  value: this.sourceOfWealthForm.get('companyAreaCode').value,
                  valueType: 'string'
                },
                businessZipCode: {
                  templateLabel: 'Business Zip Code',
                  value: this.sourceOfWealthForm.get('companyZipCode').value,
                  valueType: 'string'
                },
              };
            } else if (this.formModel.sourceOfWealth.toggleDisplay.employment) {
              sourceOfWealthBusinessAddressTemplateMapping = {
                employmentAddress: {
                  templateLabel: 'Employment Address 1',
                  value: this.sourceOfWealthForm.get('companyAddress').value,
                  valueType: 'string'
                },
                employmentCountry: {
                  templateLabel: 'Employment Country of Operation',
                  value: this.masterData.countries.find(o => o.code === this.sourceOfWealthForm.get('companyCountryId').value).name,
                  valueType: 'string'
                },
                employmentProvince: {
                  templateLabel: 'Employment Province',
                  value: residentialAddressDetail.province_name,
                  valueType: 'string'
                },
                employmentCity: {
                  templateLabel: 'Employment City',
                  value: residentialAddressDetail.city_name,
                  valueType: 'string'
                },
                employmentDistrict: {
                  templateLabel: 'Employment District',
                  value: residentialAddressDetail.district_name,
                  valueType: 'string'
                },
                employmentArea: {
                  templateLabel: 'Employment Area',
                  value: residentialAddressDetail.area_name,
                  valueType: 'string'
                },
                employmentAreaCode: {
                  templateLabel: 'Employment Area Code',
                  value: this.sourceOfWealthForm.get('companyAreaCode').value,
                  valueType: 'string'
                },
                employmentZipCode: {
                  templateLabel: 'Employment Zip Code',
                  value: this.sourceOfWealthForm.get('companyZipCode').value,
                  valueType: 'string'
                },
              };
            }

            Object.keys(sourceOfWealthBusinessAddressTemplateMapping).forEach(key => {
              const patchedInvestorFormValue = this.patchInvestorFormValue(
                this.subscriptionAgreementTemplates,
                sourceOfWealthBusinessAddressTemplateMapping[key].templateLabel,
                sourceOfWealthBusinessAddressTemplateMapping[key].value,
                sourceOfWealthBusinessAddressTemplateMapping[key].valueType);
              this.subscriptionAgreementTemplates = Object.assign(this.subscriptionAgreementTemplates, patchedInvestorFormValue);
            });
          }

          Object.keys(sourceOfWealthTemplateMapping).forEach(key => {
            const patchedInvestorFormValue = this.patchInvestorFormValue(
              this.subscriptionAgreementTemplates,
              sourceOfWealthTemplateMapping[key].templateLabel,
              sourceOfWealthTemplateMapping[key].value,
              sourceOfWealthTemplateMapping[key].valueType);
            this.subscriptionAgreementTemplates = Object.assign(this.subscriptionAgreementTemplates, patchedInvestorFormValue);
          });
          this.changeStep(this.currentStep + 1);
          this._eventService.sendInvActivationEvent('INV-sow');
        } else {
          this._notificationService.error(this.formModel.sourceOfWealth.errors['none-selected']);
        }
      }
    }
  }

  onTaxResidencyChange(value: boolean): void {
    this.sourceOfWealthForm.patchValue({
      taxResidency: value
    });
  }

  getAddressLocation(key: string) {
    this._memberService
      .getAddressLocation(this.countryCode, key)
      .subscribe(
        response => {
          this.companyAddressNameList = [];
          this.companyAddressListFlag = true;
          this.companyAddressNameList = response.data;
          if (response.data.length === 0) {
            this._notificationService.error(this.formModel.sourceOfWealth.zipCodeError);
            return;
          }
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  onAgreementComplete() {
    if (this.isReverification) {
      this._router.navigate(['/admin-investor/overview']);
    } else {
      this._router.navigate(['/admin-investor/deposit']);
    }
  }

}
