import {
  Component,
  OnInit,
  SecurityContext
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
  Validators
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { MemberService } from '../../services/member.service';
import { DocumentService } from '../../services/document.service';
import { NotificationService } from '../../services/notification.service';
import { ValidatorService } from '../../services/validator.service';
import { FormService } from '../../services/form.service';
import { EventService } from '../../services/event.service';
import { ENVIRONMENT } from '../../../environments/environment';
import CONFIGURATION from '../../../configurations/configuration';
import { TwoFaPhoneNumberConfig } from '../../components/two-fa/two-fa-common/two-fa-interface';
import { UtilityService } from '../../services/utility.service';

enum BorrowerOnBoardSteps {
  organization = 1,
  financial = 2,
  applicant = 3,
  documentUpload = 4,
}
@Component({
  selector: 'app-sign-up-form-borrower-my',
  templateUrl: './sign-up-my.html'
})
export class SignupFormBorrowerMYComponent implements OnInit {
  countryCode: string;
  countryName: string;
  CONFIGURATION: any;
  currentStep: number;
  formModel: any;
  masterData: any;
  memberId: string;
  signUpBorrowerApplicantForm: FormGroup;
  signUpBorrowerFinancialForm: FormGroup;
  signUpBorrowerOrganizationForm: FormGroup;
  steps: Array<any>;
  twoFaOptions: any;
  featureToggles: any;
  businessPhoneNumberConfig: TwoFaPhoneNumberConfig;
  companyPhoneNumberConfig: TwoFaPhoneNumberConfig;
  borrowerMemberTypeCode: string;
  lastStepIndex: number;
  isInvestorOnboardingCompleted: boolean;

  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _formBuilder: FormBuilder,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _router: Router,
    private _translateService: TranslateService,
    private _validatorService: ValidatorService,
    private _documentService: DocumentService,
    private _formService: FormService,
    private _eventService: EventService,
    private _domSanitizer: DomSanitizer,
    private _utilityService: UtilityService,
  ) {
    this.CONFIGURATION = CONFIGURATION;
    this.countryCode = CONFIGURATION.country_code;
    this.countryName = CONFIGURATION.country_name;
    this.currentStep = 1;
    this.formModel = {
      currencyCode: CONFIGURATION.currency_code,
      completion: 0,
      existing: null,
      signUpBorrowerApplicant: {
        companyAppointment: '',
        displayCompanyOwnership: true,
        error: '',
        success: '',
        validation: false
      },
      signUpBorrowerDocument: {
        configuration: this._baseParameterService.getDocumentUploadingConfigWithUploadImage(),
        error: '',
        documents: new Array<any>(),
        placeholder: {
          upload: '',
          uploaded: ''
        },
        success: ''
      },
      signUpBorrowerFinancial: {
        companyAnnualRevenue: '',
        companyCapital: '',
        companyCrimeStatus: '',
        error: '',
        success: '',
        validation: false
      },
      signUpBorrowerOrganization: {
        companyEntityTypeId: '',
        companyIndustryId: '',
        companyCountryId: '',
        companyStateId: '',
        error: '',
        residentialCountryId: '',
        residentialstateId: '',
        success: '',
        validation: false,
        businessMobilePhoneNumber: false,
        companyMobilePhoneNumber: false
      }
    };
    this.masterData = {
      companyAnnualRevenues: new Array<any>(),
      companyAppointments: new Array<any>(),
      companyCapitals: new Array<any>(),
      companyCountries: new Array<any>(),
      companyCrimeStatuses: new Array<any>(),
      companyEntityTypes: new Array<any>(),
      companyStates: new Array<any>(),
      countries: new Array<any>(),
      genders: new Array<any>(),
      industries: new Array<any>(),
      states: new Array<any>()
    };
    this.memberId = '';
    this.signUpBorrowerApplicantForm = this._formBuilder.group({
      companyAppointment: new FormControl(null, [Validators.required]),
      icNumber: new FormControl(null, [Validators.required]),
      companyOwnership: new FormControl(null, [Validators.required, this._validatorService.validateRangedDecimal(0, 100)])
    });
    this.signUpBorrowerFinancialForm = this._formBuilder.group({
      companyAnnualRevenue: new FormControl(null, [Validators.required]),
      companyCapital: new FormControl(null, [Validators.required]),
      companyCurrentDebt: new FormControl(null, [Validators.required, Validators.pattern(this._validatorService.numberPattern)]),
      companyCurrentInstallment: new FormControl(null, [Validators.required]),
      companyCrimeStatus: new FormControl(null, [Validators.required])
    });
    this.signUpBorrowerOrganizationForm = this._formBuilder.group({
      address1: new FormControl(null, [Validators.required]),
      address2: new FormControl(null, []),
      citizenshipIsSame: new FormControl(null, []),
      companyAddress1: new FormControl(null, [Validators.required]),
      companyAddress2: new FormControl(null, []),
      companyCountryId: new FormControl(null, [Validators.required]),
      companyBirthDate: new FormControl(null, [Validators.required]),
      companyDistrict: new FormControl(null, []),
      companyEntityTypeId: new FormControl(null, [Validators.required]),
      companyIndustryId: new FormControl(null, [Validators.required]),
      companyName: new FormControl(null, [Validators.required]),
      companyPhoneNumber: new FormControl(null, [Validators.required]),
      companyRegistrationNumber: new FormControl(null, [Validators.required]),
      companyStateId: new FormControl(null, []),
      companyZipCode: new FormControl(null, [Validators.required]),
      district: new FormControl(null, []),
      phoneNumber: new FormControl(null, [Validators.required]),
      residentialCountryId: new FormControl(null, [Validators.required]),
      stateId: new FormControl(null, []),
      zipCode: new FormControl(null, [Validators.required])
    });
    this.steps = this._baseParameterService.getBorrowerOnboardingStep();
    this.twoFaOptions = {};
    this.businessPhoneNumberConfig = {
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
  }

  ngOnInit() {
    this.lastStepIndex = Math.max.apply(Math, this.steps.map(function (o) { return o.index; }));
    this.initialize();
  }

  autoFormatCompanyCurrentInstallment(): void {
    this.signUpBorrowerFinancialForm.patchValue({
      companyCurrentInstallment: this._validatorService.addDelimiter(this.signUpBorrowerFinancialForm.value.companyCurrentInstallment, true)
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
        case BorrowerOnBoardSteps.organization:
          if (this.formModel.existing) {
            this.prefillSignUpBorrowerOrganizationForm();
          } else {
            this._memberService.getMemberDetail().subscribe(
              response => {
                this.formModel.existing = response;
                this.prefillSignUpBorrowerOrganizationForm();
              },
              error => {
                this._notificationService.error();
                this.kickOut();
              }
            );
          }
          break;
        case BorrowerOnBoardSteps.financial:
          if (this.formModel.existing) {
            this.prefillSignUpBorrowerFinancialForm();
          } else {
            this._memberService.getMemberDetail().subscribe(
              response => {
                this.formModel.existing = response;
                this.prefillSignUpBorrowerFinancialForm();
              },
              error => {
                this._notificationService.error();
                this.kickOut();
              }
            );
          }
          break;
        case BorrowerOnBoardSteps.applicant:
          if (this.formModel.existing) {
            this.prefillSignUpBorrowerApplicantForm();
          } else {
            this._memberService.getMemberDetail().subscribe(
              response => {
                this.formModel.existing = response;
                this.prefillSignUpBorrowerApplicantForm();
              },
              error => {
                this._notificationService.error();
                this.kickOut();
              }
            );
          }
          break;
        case BorrowerOnBoardSteps.documentUpload:
          this.prefillSignUpBorrowerDocumentForm();
          break;
      }
    }
  }

  initialize(): void {
    this._memberService
      .getLookUpMasterData()
      .subscribe(
        response => {
          let masterData = response.data;
          this.masterData.companyCountries = masterData.countries;
          this.masterData.companyCountries = this.masterData.companyCountries.filter((element) => {
            return element.code !== CONFIGURATION.country_code;
          });
          this.masterData.companyCountries.unshift({
            code: CONFIGURATION.country_code,
            name: CONFIGURATION.country_name
          });
          this.masterData.countries = masterData.countries;
          this.masterData.countries = this.masterData.countries.filter((element) => {
            return element.code !== CONFIGURATION.country_code;
          });
          this.masterData.countries.unshift({
            code: CONFIGURATION.country_code,
            name: CONFIGURATION.country_name
          });
          this.onCountryChange(CONFIGURATION.country_code);
        },
        error => {
          this._notificationService.error();
          this.kickOut();
        }
      );

    this._translateService
      .get('form.onboarding-borrower.applicant')
      .subscribe(
        applicant => {
          this.formModel.signUpBorrowerApplicant.error = applicant.error;
          this.formModel.signUpBorrowerApplicant.success = applicant.success;
        }
      );

    this._translateService
      .get('form.onboarding-borrower.document')
      .subscribe(
        document => {
          this.formModel.signUpBorrowerDocument.error = document.error;
          this.formModel.signUpBorrowerDocument.placeholder = document.placeholder;
          this.formModel.signUpBorrowerDocument.success = document.success;
          this.formModel.signUpBorrowerDocument.documents = Object.values(document.documents)
            .map(documentValue => {
              return {
                display: true,
                label: documentValue['label'],
                message: documentValue['label'],
                description: documentValue['description'] || '',
                type: documentValue['type'],
                uploaded: false,
                sort: 0
              };
            });

          let documentSortList = this._baseParameterService.getDocumentUploadingSortList();

          for (let key in documentSortList) {
            if (this.formModel.signUpBorrowerDocument.documents.find(value => value.type === documentSortList[key].type)) {
              this.formModel.signUpBorrowerDocument.documents.find(value => value.type === documentSortList[key].type).sort = documentSortList[key].sort;
            }
          }

          this.formModel.signUpBorrowerDocument.documents.sort((a, b) => {
            if (a.sort < b.sort) return -1;
            else if (a.sort > b.sort) return 1;
            else return 0;
          });

        }
      );

    this._translateService
      .get('form.onboarding-borrower.financial')
      .subscribe(
        financial => {
          this.formModel.signUpBorrowerFinancial.error = financial.error;
          this.formModel.signUpBorrowerFinancial.success = financial.success;
        }
      );

    this._translateService
      .get('form.onboarding-borrower.organization')
      .subscribe(
        organization => {
          this.formModel.signUpBorrowerOrganization.error = organization.error;
          this.formModel.signUpBorrowerOrganization.success = organization.success;
        }
      );

    this._translateService
      .get('form.onboarding-borrower.steps')
      .subscribe(
        steps => {
          let step;
          this._memberService.getMemberDetail().subscribe(
            response => {
              this.formModel.existing = response;

              if (this.formModel.existing.lastSignUpStepWeb === this.steps.find(x => x.index === this.lastStepIndex).lastSignUpStepWeb) {
                this.isInvestorOnboardingCompleted = true;
              }
              if (this.formModel.existing.memberActivationStatus.code === 'ACT' && !this.formModel.existing.lastSignUpStepWeb) {
                const lastSignUpStepWeb = this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb;
                this.formModel.existing.lastSignUpStepWeb = lastSignUpStepWeb;
                const body = {
                  lastSignUpStepWeb: lastSignUpStepWeb
                };
                this._memberService.updateMember(body).subscribe(
                  response => {
                    if (response.status === 'success') {
                      this._authService.setLastSignUStepWeb(lastSignUpStepWeb);
                    } else {
                      this._notificationService.error(response.message);
                    }
                  },
                  error => {
                    this._notificationService.error();
                  });
              }

              if (this.formModel.existing.lastSignUpStepWeb === 'ACCOUNT_VERIFICATION') {
                step = this.steps.find(step => {
                  return step.index === 1;
                });
              } else {
                step = this.steps.find(step => {
                  return step.lastSignUpStepWeb === this.formModel.existing.lastSignUpStepWeb;
                });
              }

              if (step) {
                this.changeStep(step.index);
              } else {
                this.kickOut();
              }
            },

            error => {
              this._notificationService.error();
              this.kickOut();
            }
          );
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
          this.masterData.companyEntityTypes = masterData['company-entity-types'];
          this.masterData.industries = masterData['company-industries'];
          this.masterData.genders = masterData['genders'];
        });
  }

  kickOut(): void {
    this._authService.logOut();
    this._router.navigate(['/sign-up-borrower']);
  }

  onCitizenshipIsSameChange(event: any): void {
    if (event.checked) {
      this.businessPhoneNumberConfig = {
        mode: 'ANY',
        allowDropDown: true,
        onlyCountries: [(this.countryCode.toLowerCase())],
        mobilePhoneNumber: this.signUpBorrowerOrganizationForm.value.companyPhoneNumber,
        autoPlaceholder: 'polite'
      };
      this.signUpBorrowerOrganizationForm.patchValue({
        address1: this.signUpBorrowerOrganizationForm.value.companyAddress1,
        address2: this.signUpBorrowerOrganizationForm.value.companyAddress2,
        citizenshipIsSame: event.checked,
        phoneNumber: this.signUpBorrowerOrganizationForm.value.companyPhoneNumber,
        residentialCountryId: this.signUpBorrowerOrganizationForm.value.companyCountryId,
        stateId: this.signUpBorrowerOrganizationForm.value.companyStateId,
        zipCode: this.signUpBorrowerOrganizationForm.value.companyZipCode
      });
      this.formModel.signUpBorrowerOrganization.residentialCountryId = this.formModel.signUpBorrowerOrganization.companyCountryId;
      this.formModel.signUpBorrowerOrganization.residentialCouasdntryId = this.formModel.signUpBorrowerOrganization.companyCountryId;
      this.onCountryChange(this.signUpBorrowerOrganizationForm.value.companyCountryId, this.signUpBorrowerOrganizationForm.value.companyStateId);
      this.onStateChange(this.signUpBorrowerOrganizationForm.value.companyStateId, this.signUpBorrowerOrganizationForm.value.companyDistrict);

    } else {
      this.businessPhoneNumberConfig = {
        mode: 'ANY',
        allowDropDown: true,
        onlyCountries: [(this.countryCode.toLowerCase())],
        mobilePhoneNumber: '',
        autoPlaceholder: 'polite'
      };
      this.signUpBorrowerOrganizationForm.patchValue({
        address1: null,
        address2: null,
        citizenshipIsSame: event.checked,
        district: null,
        phoneNumber: null,
        residentialCountryId: null,
        stateId: null,
        zipCode: null
      });
      this.masterData.states = new Array<any>();
    }
  }

  onCompanyAppointmentChange(label: string): void {
    let companyAppointment = this.masterData
      .companyAppointments
      .find(companyAppointment => {
        return companyAppointment.label === label;
      });
    if (companyAppointment) {
      if (companyAppointment.share === 100) {
        this.formModel.signUpBorrowerApplicant.displayCompanyOwnership = false;
        this.signUpBorrowerApplicantForm.patchValue({
          companyOwnership: companyAppointment.share
        });
      } else {
        this.formModel.signUpBorrowerApplicant.displayCompanyOwnership = true;
        this.signUpBorrowerApplicantForm.patchValue({
          companyOwnership: null
        });
      }
    }
  }

  onCompanyCountryChange(countryCode: string, stateId: number = null): void {
    if (countryCode) {
      this.signUpBorrowerOrganizationForm.patchValue({
        companyStateId: null,
        companyDistrict: null
      });

      this._translateService
        .get('master.states')
        .subscribe(
          response => {
            this.masterData.companyStates = [];
            for (let key in response) {
              if (response[key]['country']['code'] === countryCode) {
                this.masterData.companyStates.push({
                  id: response[key]['id'],
                  name: response[key]['name']
                });
              }
            }

            if (stateId) {
              this.formModel.signUpBorrowerOrganization.companyStateId = stateId;
              this.signUpBorrowerOrganizationForm.patchValue({
                stateId: stateId
              });
            }
          });

    }
  }

  onCompanyStateChange(stateId: string, district: string = null): void {
    if (stateId) {
      this.formModel.signUpBorrowerOrganization.companyStateId = stateId;
      this.signUpBorrowerOrganizationForm.patchValue({
        companyDistrict: district
      });
    }
  }

  onCountryChange(countryCode: string, stateId: number = null): void {
    if (countryCode) {
      this.signUpBorrowerOrganizationForm.patchValue({
        stateId: null,
        district: null
      });

      this._translateService
        .get('master.states')
        .subscribe(
          response => {
            this.masterData.states = [];
            for (let key in response) {
              if (response[key]['country']['code'] === countryCode) {
                this.masterData.states.push({
                  id: response[key]['id'],
                  name: response[key]['name']
                });
              }
            }

            if (stateId) {
              this.formModel.signUpBorrowerOrganization.residentialstateId = stateId;
              this.signUpBorrowerOrganizationForm.patchValue({
                stateId: stateId
              });
            }
          });

    }
  }

  onFileUploadError(args: any, documentLabel: string): void {
    let message = documentLabel + ': ' + args[1];
    this._notificationService.error(message, 5000);
  }

  onFileUploadSending(args: any, documentType: string): void {
    args[2].append('doc_type', documentType);
    args[2].append('borrower_id', this.memberId);
    args[2].append('country_id', CONFIGURATION.country_code);
  }

  onFileUploadSuccess(args: any, documentType: string): void {
    let document = this.formModel
      .signUpBorrowerDocument
      .documents
      .find(document => {
        return document.type === documentType
      });
    if (document) {
      let message = document.label + ' uploaded.';
      this._notificationService.success(message, 5000);
      document.uploaded = true;
      document.message = this._domSanitizer.sanitize(SecurityContext.HTML,
        `${document.label}
          <br>
          <div
            class="btn upload-button white-text font-size-16 Gilroy-SemiBold success">
            ${this.formModel.signUpBorrowerDocument.placeholder.uploaded} <i class="fa fa-check margin-left-10" aria-hidden="true"></i>
          </div>
        `);
    }
  }

  onSignUpBorrowerApplicantFormSubmit(): void {
    this.formModel.signUpBorrowerApplicant.validation = true;
    this._formService.throwErrorForRequiredFields(this.signUpBorrowerApplicantForm);
    if (this.signUpBorrowerApplicantForm.valid) {
      const body = {
        companyAppointment: this.signUpBorrowerApplicantForm.value.companyAppointment,
        icNumber: this.signUpBorrowerApplicantForm.value.icNumber,
        companyOwnership: this.signUpBorrowerApplicantForm.value.companyOwnership,
        lastSignUpStepWeb: this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb
      };
      this._memberService.updateMember(body).subscribe(
        response => {
          if (response.status === 'success') {
            let nextStep = this.steps.find(step => {
              return step.index === this.currentStep + 1;
            });
            if (nextStep) {
              if (nextStep.key > this.formModel.completion) {
                this._authService.setLastSignUStepWeb(this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb);
                this._eventService.sendBrwSignupEvent("BRW-applicant");
                this.changeStep(nextStep.index);
                this.formModel.completion = nextStep.key;
                this.formModel.existing = null;
                this.formModel.signUpBorrowerApplicant.validation = false;
                this.signUpBorrowerApplicantForm.reset();
              } else {
                this._eventService.sendBrwSignupEvent("BRW-applicant");
                this.changeStep(nextStep.index);
                this.formModel.existing = null;
                this.formModel.signUpBorrowerApplicant.validation = false;
                this.signUpBorrowerApplicantForm.reset();
              }
            } else {
              this._notificationService.error();
            }
          } else {
            this._notificationService.error(response.message);
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

  onSignUpBorrowerDocumentFormSubmit(): void {
    let signUpBorrowerDocumentValid = false;
    let nricBackUploaded = false;
    let nricFrontUploaded = false;
    let passportUploaded = false;
    this.formModel
      .signUpBorrowerDocument
      .documents
      .forEach(document => {
        if (document.type === 'PASSPORT' && document.uploaded) {
          passportUploaded = true;
        }
        if (document.type === 'NRIC_BACK' && document.uploaded) {
          nricBackUploaded = true;
        }
        if (document.type === 'NRIC_FRONT' && document.uploaded) {
          nricFrontUploaded = true;
        }
        signUpBorrowerDocumentValid = (nricBackUploaded && nricFrontUploaded) || passportUploaded;
      });



    if (signUpBorrowerDocumentValid) {
      const body = {
        lastSignUpStepWeb: this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb
      };
      this._memberService.updateMember(body).subscribe(
        response => {
          if (response.status === 'success') {
            this.isInvestorOnboardingCompleted = true;
            this._authService.setLastSignUStepWeb(this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb);
            this._eventService.sendInvSignupEvent('BRW-doc-upload');
          } else {
            this._notificationService.error(response.message);
          }
        },
        error => {
          this._notificationService.error();
        });
    } else {
      window.scrollTo(0, 0);
      this._notificationService.error(this.formModel.signUpBorrowerDocument.error);
    }
  }

  onSignUpBorrowerFinancialFormSubmit(): void {
    this.formModel.signUpBorrowerFinancial.validation = true;
    this._formService.throwErrorForRequiredFields(this.signUpBorrowerFinancialForm);
    if (this.signUpBorrowerFinancialForm.valid) {
      const body = {
        companyAnnualRevenue: this.signUpBorrowerFinancialForm.value.companyAnnualRevenue,
        companyCapital: this.signUpBorrowerFinancialForm.value.companyCapital,
        companyCurrentDebt: this.signUpBorrowerFinancialForm.value.companyCurrentDebt,
        companyCurrentInstallment: this._validatorService.removeDelimiter(this.signUpBorrowerFinancialForm.value.companyCurrentInstallment),
        companyCrimeStatus: this.signUpBorrowerFinancialForm.value.companyCrimeStatus,
        lastSignUpStepWeb: this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb
      };
      this._memberService.updateMember(body).subscribe(
        response => {
          if (response.status === 'success') {
            let nextStep = this.steps.find(step => {
              return step.index === this.currentStep + 1;
            });
            if (nextStep) {
              if (nextStep.key > this.formModel.completion) {
                this._authService.setLastSignUStepWeb(this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb);
                this._eventService.sendBrwSignupEvent("BRW-financials");
                this.changeStep(nextStep.index);
                this.formModel.completion = nextStep.key;
                this.formModel.existing = null;
                this.formModel.signUpBorrowerFinancial.validation = false;
                this.signUpBorrowerFinancialForm.reset();

              } else {
                this._eventService.sendBrwSignupEvent("BRW-financials");
                this.changeStep(nextStep.index);
                this.formModel.existing = null;
                this.formModel.signUpBorrowerFinancial.validation = false;
                this.signUpBorrowerFinancialForm.reset();
              }
            } else {
              this._notificationService.error();
            }
          } else {
            this._notificationService.error(response.message);
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

  onSignUpBorrowerOrganizationFormSubmit(): void {
    this.formModel.signUpBorrowerOrganization.validation = true;
    this._formService.throwErrorForRequiredFields(this.signUpBorrowerOrganizationForm);
    if (this.signUpBorrowerOrganizationForm.valid &&
      !this.formModel.signUpBorrowerOrganization.businessMobilePhoneNumber &&
      !this.formModel.signUpBorrowerOrganization.companyMobilePhoneNumber) {
      const body = {
        address1: this.signUpBorrowerOrganizationForm.value.address1,
        address2: this.signUpBorrowerOrganizationForm.value.address2,
        citizenshipCountryId: CONFIGURATION.country_code,
        citizenshipIsSame: this.signUpBorrowerOrganizationForm.value.citizenshipIsSame,
        companyAddress1: this.signUpBorrowerOrganizationForm.value.companyAddress1,
        companyAddress2: this.signUpBorrowerOrganizationForm.value.companyAddress2,
        companyCountryId: this.signUpBorrowerOrganizationForm.value.companyCountryId,
        companyBirthDate: this.signUpBorrowerOrganizationForm.value.companyBirthDate,
        companyDistrict: this.signUpBorrowerOrganizationForm.value.companyDistrict,
        companyEntityTypeId: this.signUpBorrowerOrganizationForm.value.companyEntityTypeId,
        companyIndustryId: this.signUpBorrowerOrganizationForm.value.companyIndustryId,
        companyName: this.signUpBorrowerOrganizationForm.value.companyName,
        companyPhoneNumber: this.signUpBorrowerOrganizationForm.value.companyPhoneNumber,
        companyRegistrationNumber: this.signUpBorrowerOrganizationForm.value.companyRegistrationNumber,
        companyStateId: this.signUpBorrowerOrganizationForm.value.companyStateId,
        companyZipCode: this.signUpBorrowerOrganizationForm.value.companyZipCode,
        countryId: CONFIGURATION.country_code,
        district: this.signUpBorrowerOrganizationForm.value.district,
        phoneNumber: this.signUpBorrowerOrganizationForm.value.phoneNumber,
        residentialCountryId: this.signUpBorrowerOrganizationForm.value.residentialCountryId,
        stateId: this.signUpBorrowerOrganizationForm.value.stateId,
        zipCode: this.signUpBorrowerOrganizationForm.value.zipCode,
        lastSignUpStepWeb: this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb
      }
      this._memberService.updateMember(body).subscribe(
        response => {
          if (response.status === 'success') {
            let nextStep = this.steps.find(step => {
              return step.index === this.currentStep + 1;
            });
            if (nextStep) {
              if (nextStep.key > this.formModel.completion) {
                this._authService.setLastSignUStepWeb(this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb);
                this._eventService.sendBrwSignupEvent("BRW-organization");
                this.changeStep(nextStep.index);
                this.formModel.completion = nextStep.key;
                this.formModel.existing = null;
                this.formModel.signUpBorrowerOrganization.validation = false;
                this.signUpBorrowerOrganizationForm.reset();
              } else {
                this._eventService.sendBrwSignupEvent("BRW-organization");
                this.changeStep(nextStep.index);
                this.formModel.existing = null;
                this.formModel.signUpBorrowerOrganization.validation = false;
                this.signUpBorrowerOrganizationForm.reset();
              }
            } else {
              this._notificationService.error();
            }
          } else {
            this._notificationService.error(response.message);
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

  onStateChange(stateId: string, district: string = null): void {
    if (stateId) {
      this.signUpBorrowerOrganizationForm.patchValue({
        district: district
      });
    }
  }

  prefillSignUpBorrowerApplicantForm(): void {
    this.signUpBorrowerApplicantForm.patchValue({
      companyAppointment: this.formModel.existing.companyAppointment,
      icNumber: this.formModel.existing.icNumber,
      companyOwnership: this.formModel.existing.companyOwnership
    });
    this.formModel.signUpBorrowerApplicant.companyAppointment = this.formModel.existing.companyAppointment;
  }

  prefillSignUpBorrowerDocumentForm(): void {
    this.formModel
      .signUpBorrowerDocument
      .documents
      .forEach(document => {
        this._documentService.getUploadedDocument(document.type).subscribe(
          response => {
            document.uploaded = response.results.length > 0;
            if (document.uploaded) {
              document.message = this._domSanitizer.sanitize(SecurityContext.HTML,
                `${document.label}
                  <br>
                  <div
                    class="btn upload-button white-text font-size-16 Gilroy-SemiBold success">
                    ${this.formModel.signUpBorrowerDocument.placeholder.uploaded}
                    <i class="fa fa-check margin-left-10" aria-hidden="true"></i>
                  </div>
                `);
            } else {
              document.message = this._domSanitizer.sanitize(SecurityContext.HTML,
                `<span class="upload-label">${document.label}</span>
                  <br>
                  <span class="upload-btn-description">
                    ${this.formModel.signUpBorrowerDocument.placeholder.dragDrop}
                  </span>
                  <a class="link">${this.formModel.signUpBorrowerDocument.placeholder.browseFiles}</a>
                `);
            }
          }
        );
      });
  }

  prefillSignUpBorrowerFinancialForm(): void {
    this.signUpBorrowerFinancialForm.patchValue({
      companyAnnualRevenue: this.formModel.existing.companyAnnualRevenue,
      companyCapital: this.formModel.existing.companyCapital,
      companyCurrentDebt: parseFloat(this.formModel.existing.companyCurrentDebt),
      companyCurrentInstallment: this._validatorService.addDelimiter(parseFloat(this.formModel.existing.companyCurrentInstallment).toString(), true),
      companyCrimeStatus: this.formModel.existing.companyCrimeStatus
    });
    this.formModel.signUpBorrowerFinancial.companyAnnualRevenue = this.formModel.existing.companyAnnualRevenue;
    this.formModel.signUpBorrowerFinancial.companyCapital = this.formModel.existing.companyCapital;
    this.formModel.signUpBorrowerFinancial.companyCrimeStatus = this.formModel.existing.companyCrimeStatus;
  }

  prefillSignUpBorrowerOrganizationForm(): void {
    const companyPhoneNumber = this.formModel.existing.companyPhoneNumber && this.formModel.existing.companyPhoneNumber.indexOf('+') === 0 ? this.formModel.existing.companyPhoneNumber.substring(3, this.formModel.existing.companyPhoneNumber.length) : this.formModel.existing.companyPhoneNumber;
    const businessPhoneNumber = this.formModel.existing.phoneNumber && this.formModel.existing.phoneNumber.indexOf('+') === 0 ? this.formModel.existing.phoneNumber.substring(3, this.formModel.existing.phoneNumber.length) : this.formModel.existing.phoneNumber;
    this.signUpBorrowerOrganizationForm.patchValue({
      address1: this.formModel.existing.address1,
      address2: this.formModel.existing.address2,
      citizenshipIsSame: this.formModel.existing.citizenshipIsSame,
      companyAddress1: this.formModel.existing.companyAddress1,
      companyAddress2: this.formModel.existing.companyAddress2,
      companyCountryId: this.formModel.existing.companyCountryId,
      companyEntityTypeId: this.formModel.existing.companyEntityTypeId,
      companyIndustryId: this.formModel.existing.companyIndustryId,
      companyName: this.formModel.existing.companyName,
      companyPhoneNumber: companyPhoneNumber,
      companyRegistrationNumber: this.formModel.existing.companyRegistrationNumber,
      companyZipCode: this.formModel.existing.companyZipCode,
      phoneNumber: businessPhoneNumber,
      residentialCountryId: this.formModel.existing.residentialCountryId,
      zipCode: this.formModel.existing.zipCode
    });

    this.businessPhoneNumberConfig.mobilePhoneNumber = businessPhoneNumber;
    this.companyPhoneNumberConfig.mobilePhoneNumber = companyPhoneNumber;
    this.formModel.signUpBorrowerOrganization.companyEntityTypeId = this.formModel.existing.companyEntityTypeId;
    this.formModel.signUpBorrowerOrganization.companyIndustryId = this.formModel.existing.companyIndustryId;
    this.formModel.signUpBorrowerOrganization.residentialCountryId = this.formModel.existing.residentialCountryId;
    this.formModel.signUpBorrowerOrganization.residentialstateId = this.formModel.existing.residentialstateId;

    this.onCompanyCountryChange(this.formModel.existing.companyCountryId, this.formModel.existing.companyStateId);
    this.onCompanyStateChange(this.formModel.existing.companyStateId, this.formModel.existing.companyDistrict);
    this.onCountryChange(this.formModel.existing.residentialCountryId, this.formModel.existing.stateId);
    this.onStateChange(this.formModel.existing.stateId, this.formModel.existing.district);
    if (this.formModel.existing.companyBirthDate) {
      this.signUpBorrowerOrganizationForm.patchValue({
        companyBirthDate: new Date(this.formModel.existing.companyBirthDate),
      });
    }
  }

  patchBusinessMobilePhoneNumber(phoneNumber: string) {
    if (phoneNumber) {
      this.signUpBorrowerOrganizationForm.patchValue({
        phoneNumber: phoneNumber
      });
    }
  }

  patchCompanyMobilePhoneNumber(phoneNumber: string) {
    if (phoneNumber) {
      this.signUpBorrowerOrganizationForm.patchValue({
        companyPhoneNumber: phoneNumber
      });
    }
  }

  getBusinessMobilePhoneValidation(validation: boolean) {
    this.formModel.signUpBorrowerOrganization.businessMobilePhoneNumber = validation;
  }

  getCompanyMobilePhoneValidation(validation: boolean) {
    this.formModel.signUpBorrowerOrganization.companyMobilePhoneNumber = validation;
  }

  goToDashboard() {
    this._router.navigate(['/admin-borrower/overview']);
  }

}
