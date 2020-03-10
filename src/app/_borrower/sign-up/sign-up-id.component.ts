
import { debounceTime } from 'rxjs/operators';
import {
  Component,
  OnInit,
  SecurityContext
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { MemberService } from '../../services/member.service';
import { DocumentService } from '../../services/document.service';
import { NotificationService } from '../../services/notification.service';
import { ValidatorService } from '../../services/validator.service';
import { FormService } from '../../services/form.service';
import { EventService } from '../../services/event.service';
import { Subject } from 'rxjs';
import { TwoFaPhoneNumberConfig } from '../../components/two-fa/two-fa-common/two-fa-interface';
import { UtilityService } from '../../services/utility.service';
import CONFIGURATION from '../../../configurations/configuration';

enum BorrowerOnBoardSteps {
  personal = 1,
  organization = 2,
  documentUpload = 3
}
@Component({
  selector: 'app-sign-up-form-borrower-id',
  templateUrl: './sign-up-id.html'
})
export class SignupFormBorrowerIDComponent implements OnInit {
  countryCode: string;
  countryCurrencyCode: string;
  countryName: string;
  currentStep: number;
  formModel: any;
  masterData: any;
  memberId: string;
  phonePrefix: string;
  signUpBorrowerPersonalForm: FormGroup;
  signUpBorrowerBusinessForm: FormGroup;
  steps: Array<any>;
  twoFaOptions: any;
  CONFIGURATION: any;
  addressSubject: Subject<string> = new Subject();
  addressList: any;
  selectedAreaId: string;
  phoneNumberConfig: TwoFaPhoneNumberConfig;
  spousePhoneNumberConfig: TwoFaPhoneNumberConfig;
  borrowerMemberTypeCode: string;
  lastStepIndex: number;
  isInvestorOnboardingCompleted: boolean;
  userName: string;

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
    this.countryCurrencyCode = CONFIGURATION.currency_code;
    this.countryName = CONFIGURATION.country_name;
    this.currentStep = 1;
    this.formModel = {
      completion: 0,
      existing: null,
      signUpBorrowerPersonal: {
        displayCompanyOwnership: true,
        maritalStatus: '',
        error: '',
        success: '',
        validation: false,
        mobilePhoneNumberValidation: false,
        spouseMobilePhoneNumberValidation: false
      },
      signUpBorrowerDocument: {
        configuration: this._baseParameterService.getDocumentUploadingConfigWithUploadImage(),
        error: '',
        isPersonal: '',
        isMarried: '',
        documents: new Array<any>(),
        placeholder: {
          upload: '',
          uploaded: ''
        },
        success: ''
      },
      signUpBorrowerBusiness: {
        companyIndustry: '',
        error: '',
        entityType: '',
        IdentityType: '',
        success: '',
        state: '',
        zipCodeNotFound: '',
        validation: false
      }
    };
    this.masterData = {
      companyAnnualRevenues: new Array<any>(),
      companyAppointments: new Array<any>(),
      companyCapitals: new Array<any>(),
      companyCrimeStatuses: new Array<any>(),
      companyEntityTypes: new Array<any>(),
      countries: new Array<any>(),
      genders: new Array<any>(),
      industries: new Array<any>(),
      maritalStatus: new Array<any>(),
      states: new Array<any>()
    };
    this.memberId = '';
    this.phonePrefix = CONFIGURATION.phone_prefix;
    this.signUpBorrowerPersonalForm = this._formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      mobilePhoneNumber: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      maritalStatusId: new FormControl(null, [Validators.required, Validators.pattern(this._validatorService.numberPattern)]),
      spouseFullName: new FormControl(null, [Validators.required]),
      spouseMobilePhoneNumber: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
    this.signUpBorrowerBusinessForm = this._formBuilder.group({
      companyName: new FormControl(null, [Validators.required]),
      companyAddress1: new FormControl(null, [Validators.required]),
      companyCountryId: new FormControl(this.countryCode, []),
      companyCityId: new FormControl(null, [Validators.required]),
      companyAreaId: new FormControl(null, [Validators.required]),
      companyStateId: new FormControl(null, [Validators.required]),
      companyDistrict: new FormControl(null, [Validators.required]),
      companyArea: new FormControl(null, [Validators.required]),
      companyAreaCode: new FormControl(null, []),
      companyZipCode: new FormControl(null, [Validators.required]),
      companyIndustryId: new FormControl(null, [Validators.required, Validators.pattern(this._validatorService.numberPattern)]),
      companyEntityTypeId: new FormControl(null, [Validators.required, Validators.pattern(this._validatorService.numberPattern)]),
      taxCardTypeId: new FormControl(null, [Validators.pattern(this._validatorService.numberPattern)]),
      taxCardNumber: new FormControl(null, [Validators.required]),
      companyRegistrationNumber: new FormControl(null, [Validators.required]),
      companyBirthDate: new FormControl(null, [Validators.required]),
      companyAnnualRevenue: new FormControl(null, [Validators.required, this._validatorService.validatePositiveDecimal])
    });
    this.steps = this._baseParameterService.getBorrowerOnboardingStep();
    this.twoFaOptions = {};
    this.addressSubject.pipe(debounceTime(750)).subscribe(searchTextValue => {
      if (searchTextValue) {
        this.getAddressLocation(searchTextValue.trim());
      }
    });
    this.addressList = [];
    this.phoneNumberConfig = {
      mode: 'ANY',
      allowDropDown: true,
      onlyCountries: [(this.countryCode.toLowerCase())],
      mobilePhoneNumber: '',
      autoPlaceholder: 'polite'
    };
    this.spousePhoneNumberConfig = {
      mode: 'ANY',
      allowDropDown: true,
      onlyCountries: [(this.countryCode.toLowerCase())],
      mobilePhoneNumber: '',
      autoPlaceholder: 'polite'
    };
    this.borrowerMemberTypeCode = CONFIGURATION.member_type_code.borrower;
    this.lastStepIndex = 0;
    this.userName = this._authService.getUserName();
  }

  ngOnInit() {
    this.lastStepIndex = Math.max.apply(Math, this.steps.map(function (o) { return o.index; }));
    this.initialize();
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

  getMobilePhoneValidation(validation: string) {
    this.formModel.signUpBorrowerPersonal.mobilePhoneNumberValidation = validation;
  }

  getSpouseMobilePhoneValidation(validation: string) {
    this.formModel.signUpBorrowerPersonal.spouseMobilePhoneNumberValidation = validation;
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
        case BorrowerOnBoardSteps.personal:
          if (this.formModel.existing) {
            this.prefillSignUpBorrowerPersonalForm();
          } else {
            this._memberService.getMemberDetail().subscribe(
              response => {
                this.formModel.existing = response;
                this.prefillSignUpBorrowerPersonalForm();
              },
              error => {
                this._notificationService.error();
                this.kickOut();
              }
            );
          }
          break;
        case BorrowerOnBoardSteps.organization:
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
        case BorrowerOnBoardSteps.documentUpload:
          this._memberService.getMemberDetail().subscribe(
            response => {
              this.formModel.existing = response;
              const companyEntityType = this.masterData.companyEntityTypes.find(element => {
                return element.id === this.formModel.existing.companyEntityTypeId;
              });
              if (companyEntityType) {
                this.formModel.signUpBorrowerDocument.isPersonal = companyEntityType.code === 'IND';
              }

              const maritalStatus = this.masterData.maritalStatus.find(element => {
                return element.id === this.formModel.existing.maritalStatusId;
              });
              if (maritalStatus) {
                this.formModel.signUpBorrowerDocument.isMarried = maritalStatus.code === 'MRD';
              }
              this.checkNeededDocument();
              this.prefillSignUpBorrowerDocumentForm();
            },
            error => {
              this._notificationService.error();
              this.kickOut();
            }
          );
          break;
      }
    }
  }

  checkNeededDocument() {
    this.formModel.signUpBorrowerDocument.documents = [];
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
                display: false,
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

          if (this.formModel.signUpBorrowerDocument.isPersonal && !this.formModel.signUpBorrowerDocument.isMarried) {
            this.formModel.signUpBorrowerDocument.documents.find(i => i.type === 'NPWP').display = true;
            this.formModel.signUpBorrowerDocument.documents.find(i => i.type === 'KTP').display = true;
            this.formModel.signUpBorrowerDocument.documents.find(i => i.type === 'KK').display = true;
          } else if (this.formModel.signUpBorrowerDocument.isPersonal && this.formModel.signUpBorrowerDocument.isMarried) {
            this.formModel.signUpBorrowerDocument.documents.find(i => i.type === 'NPWP').display = true;
            this.formModel.signUpBorrowerDocument.documents.find(i => i.type === 'KTP').display = true;
            this.formModel.signUpBorrowerDocument.documents.find(i => i.type === 'KK').display = true;
            this.formModel.signUpBorrowerDocument.documents.find(i => i.type === 'KTP_PASANGAN').display = true;
          } else if (!this.formModel.signUpBorrowerDocument.isPersonal) {
            this.formModel.signUpBorrowerDocument.documents.find(i => i.type === 'NPWP_PERUSAHAAN').display = true;
            this.formModel.signUpBorrowerDocument.documents.find(i => i.type === 'KTP').display = true;
          }
        }
      );

  }

  initialize(): void {
    this._memberService
      .getLookUpMasterData()
      .subscribe(
        response => {
          const masterData = response.data;
          this.masterData.countries = masterData.countries;
          this.masterData.countries = this.masterData.countries.filter((element) => {
            return element.code !== CONFIGURATION.country_code;
          });
          this.masterData.countries.unshift({
            code: CONFIGURATION.country_code,
            name: CONFIGURATION.country_name
          });
          this.masterData.genders = masterData.genders;
          this.formModel.signUpBorrowerBusiness.IdentityType = masterData.personalIdentityTypes.find(element => {
            return element.code === 'NPWP';
          });
        },
        error => {
          this._notificationService.error();
          this.kickOut();
        }
      );

    this._memberService
      .getLookUpStates(CONFIGURATION.country_code)
      .subscribe(
        response => {
          const states = response.data;
          this.masterData.states = states;
        },
        error => {
          this._notificationService.error();
          this.kickOut();
        });

    this._translateService
      .get('master.states')
      .subscribe(
        response => {
          this.masterData.states = [];
          for (let data of response) {
            if (data['country']['code'] === CONFIGURATION.country_code) {
              this.masterData.states.push({
                id: data['id'],
                name: data['name']
              });
            }
          }
        });


    this._translateService
      .get('form.onboarding-borrower.personal')
      .subscribe(
        personal => {
          this.formModel.signUpBorrowerPersonal.error = personal.error;
          this.formModel.signUpBorrowerPersonal.success = personal.success;
        }
      );

    this._translateService
      .get('form.onboarding-borrower.business')
      .subscribe(
        business => {
          this.formModel.signUpBorrowerBusiness.error = business.error;
          this.formModel.signUpBorrowerBusiness.success = business.success;
        }
      );

    this._translateService
      .get('form.onboarding-borrower.business.zip-code-error')
      .subscribe(
        errorMessage => {
          this.formModel.signUpBorrowerBusiness.zipCodeNotFound = errorMessage;
        }
      );

    this._translateService
      .get('form.onboarding-borrower.steps')
      .subscribe(
        steps => {
          for (let key in steps) {
          }

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
          this.masterData.maritalStatus = masterData['marital-status'];
          this.masterData.genders = masterData['genders'];
        });

    this.signUpBorrowerPersonalForm.patchValue({
      name: this._authService.getUserName(),
    });
  }

  kickOut(): void {
    this._authService.logOut();
    this._router.navigate(['/log-in']);
  }

  onMaritalStatusChange() {
    this.signUpBorrowerPersonalForm.patchValue({
      spouseFullName: '',
      spouseMobilePhoneNumber: ''
    });
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
            ${this.formModel.signUpBorrowerDocument.placeholder.uploaded}
            <i class="fa fa-check margin-left-10" aria-hidden="true"></i>
          </div>
        `);
    }
  }

  onSignUpBorrowerPersonalFormSubmit(): void {
    this.formModel.signUpBorrowerPersonal.validation = true;
    if (this.formModel.signUpBorrowerPersonal.maritalStatus !== '5') {
      this.signUpBorrowerPersonalForm.patchValue({
        spouseFullName: '-',
        spouseMobilePhoneNumber: '000000'
      });
    }
    const body = {
      firstName: this.signUpBorrowerPersonalForm.value.name,
      mobilePhoneNumber: this.signUpBorrowerPersonalForm.value.mobilePhoneNumber,
      phoneNumber: this.signUpBorrowerPersonalForm.value.phoneNumber,
      maritalStatusId: this.signUpBorrowerPersonalForm.value.maritalStatusId,
      spouseFullName: this.signUpBorrowerPersonalForm.value.spouseFullName,
      spouseMobilePhoneNumber: this.signUpBorrowerPersonalForm.value.spouseMobilePhoneNumber,
      lastSignUpStepWeb: this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb
    };
    if (this.signUpBorrowerPersonalForm.valid) {
      this._memberService.updateMember(body).subscribe(
        response => {
          if (response.status === 'success') {
            let nextStep = this.steps.find(step => {
              return step.index === this.currentStep + 1;
            });
            if (nextStep) {
              if (nextStep.key > this.formModel.completion) {
                this._authService.setLastSignUStepWeb(this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb);
                this._eventService.sendBrwSignupEvent("BRW-personal");
                this.changeStep(nextStep.index);
                this.formModel.completion = nextStep.key;
                this.formModel.existing = null;
                this.formModel.signUpBorrowerPersonal.validation = false;
                this.signUpBorrowerPersonalForm.reset();
              } else {
                this._eventService.sendBrwSignupEvent("BRW-personal");
                this.changeStep(nextStep.index);
                this.formModel.existing = null;
                this.formModel.signUpBorrowerPersonal.validation = false;
                this.signUpBorrowerPersonalForm.reset();
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
      this._formService.throwErrorForRequiredFields(this.signUpBorrowerPersonalForm);
      window.scrollTo(0, 0);
    }
  }

  onSignUpBorrowerDocumentFormSubmit(): void {
    let signUpBorrowerDocumentValid = false;
    let KTPUploaded = false;
    let KTPPasanganUploaded = false;
    let KKUploaded = false;
    let NPWPUploaded = false;
    let NPWPPerusahaanUploaded = false;
    this.formModel
      .signUpBorrowerDocument
      .documents
      .forEach(document => {
        if (this.formModel.signUpBorrowerDocument.isPersonal && !this.formModel.signUpBorrowerDocument.isMarried) {
          if (document.type === 'KK' && document.uploaded) {
            KKUploaded = true;
          }
          if (document.type === 'KTP' && document.uploaded) {
            KTPUploaded = true;
          }
          if (document.type === 'NPWP' && document.uploaded) {
            NPWPUploaded = true;
          }
          signUpBorrowerDocumentValid = KKUploaded && KTPUploaded && NPWPUploaded;
        } else if (this.formModel.signUpBorrowerDocument.isPersonal && this.formModel.signUpBorrowerDocument.isMarried) {
          if (document.type === 'KK' && document.uploaded) {
            KKUploaded = true;
          }
          if (document.type === 'KTP' && document.uploaded) {
            KTPUploaded = true;
          }
          if (document.type === 'NPWP' && document.uploaded) {
            NPWPUploaded = true;
          }
          if (document.type === 'KTP_PASANGAN' && document.uploaded) {
            KTPPasanganUploaded = true;
          }
          signUpBorrowerDocumentValid = KKUploaded && KTPUploaded && NPWPUploaded && KTPPasanganUploaded;
        } else if (!this.formModel.signUpBorrowerDocument.isPersonal) {
          if (document.type === 'KTP' && document.uploaded) {
            KTPUploaded = true;
          }
          if (document.type === 'NPWP_PERUSAHAAN' && document.uploaded) {
            NPWPPerusahaanUploaded = true;
          }
          signUpBorrowerDocumentValid = KTPUploaded && NPWPPerusahaanUploaded;
        }
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

  onSignUpBorrowerBusinessFormSubmit(): void {
    this._formService.throwErrorForRequiredFields(this.signUpBorrowerBusinessForm);
    this.formModel.signUpBorrowerBusiness.validation = true;
    if (this.formModel.signUpBorrowerBusiness.IdentityType) {
      this.signUpBorrowerBusinessForm.patchValue({
        taxCardTypeId: this.formModel.signUpBorrowerBusiness.IdentityType.id
      });
    }
    const body = {
      companyName: this.signUpBorrowerBusinessForm.value.companyName,
      companyAddress1: this.signUpBorrowerBusinessForm.value.companyAddress1,
      companyCountryId: CONFIGURATION.country_code,
      companyStateId: this.signUpBorrowerBusinessForm.value.companyStateId,
      companyDistrict: this.signUpBorrowerBusinessForm.value.companyDistrict,
      companyArea: this.signUpBorrowerBusinessForm.value.companyArea,
      companyAreaId: this.signUpBorrowerBusinessForm.value.companyAreaId,
      companyCityId: this.signUpBorrowerBusinessForm.value.companyCityId,
      companyAreaCode: this.signUpBorrowerBusinessForm.value.companyAreaCode,
      companyZipCode: this.signUpBorrowerBusinessForm.value.companyZipCode,
      companyIndustryId: this.signUpBorrowerBusinessForm.value.companyIndustryId,
      companyEntityTypeId: this.signUpBorrowerBusinessForm.value.companyEntityTypeId,
      taxCardTypeId: this.signUpBorrowerBusinessForm.value.taxCardTypeId,
      taxCardNumber: this.signUpBorrowerBusinessForm.value.taxCardNumber,
      companyRegistrationNumber: this.signUpBorrowerBusinessForm.value.companyRegistrationNumber,
      companyBirthDate: this._utilityService.stripTimeZoneFromDate(this.signUpBorrowerBusinessForm.value.companyBirthDate),
      companyAnnualRevenue: this._validatorService.removeDelimiter(this.signUpBorrowerBusinessForm.value.companyAnnualRevenue),
      lastSignUpStepWeb: this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb
    }
    if (this.signUpBorrowerBusinessForm.valid) {
      this._memberService.updateMember(body).subscribe(
        response => {
          if (response.status === 'success') {
            let nextStep = this.steps.find(step => {
              return step.index === this.currentStep + 1;
            });
            if (nextStep) {
              if (nextStep.key > this.formModel.completion) {
                this._authService.setLastSignUStepWeb(this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb);
                this._eventService.sendBrwSignupEvent("BRW-business");
                this.changeStep(nextStep.index);
                this.formModel.completion = nextStep.key;
                this.formModel.existing = null;
                this.formModel.signUpBorrowerBusiness.validation = false;
                this.signUpBorrowerBusinessForm.reset();

              } else {
                this._eventService.sendBrwSignupEvent("BRW-business");
                this.changeStep(nextStep.index);
                this.formModel.existing = null;
                this.formModel.signUpBorrowerBusiness.validation = false;
                this.signUpBorrowerBusinessForm.reset();
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

  onAreaDetailSave(id: any) {
    const areaDetail = this.addressList.find(o => o.area_id === id);
    if (areaDetail) {
      this.signUpBorrowerBusinessForm.patchValue({
        companyStateId: areaDetail.province_id,
        companyDistrict: areaDetail.district_name,
        companyArea: areaDetail.area_name,
        companyCityId: areaDetail.city_id
      });
    } else {
      this.signUpBorrowerBusinessForm.patchValue({
        companyAreaId: null,
        companyStateId: null,
        companyDistrict: null,
        companyArea: null,
        companyCityId: null
      });
    }
  }

  prefillSignUpBorrowerPersonalForm(): void {
    const mobilePhoneNumber = this.formModel.existing.mobilePhoneNumber && this.formModel.existing.mobilePhoneNumber.indexOf('+') === 0 ? this.formModel.existing.mobilePhoneNumber.substring(3, this.formModel.existing.mobilePhoneNumber.length) : this.formModel.existing.mobilePhoneNumber;
    const spouseMobilePhoneNumber = this.formModel.existing.spouseMobilePhoneNumber && this.formModel.existing.spouseMobilePhoneNumber.indexOf('+') === 0 ? this.formModel.existing.spouseMobilePhoneNumber.substring(3, this.formModel.existing.spouseMobilePhoneNumber.length) : this.formModel.existing.spouseMobilePhoneNumber;
    this.signUpBorrowerPersonalForm.patchValue({
      name: this.formModel.existing.firstName,
      mobilePhoneNumber: mobilePhoneNumber,
      maritalStatusId: this.formModel.existing.maritalStatusId,
      spouseFullName: this.formModel.existing.spouseFullName,
      spouseMobilePhoneNumber: spouseMobilePhoneNumber
    });
    this.formModel.signUpBorrowerPersonal.maritalStatus = this.formModel.existing.maritalStatusId;
    this.phoneNumberConfig.mobilePhoneNumber = mobilePhoneNumber;
    this.spousePhoneNumberConfig.mobilePhoneNumber = spouseMobilePhoneNumber;
  }

  prefillSignUpBorrowerBusinessForm(): void {
    this.formModel.signUpBorrowerBusiness.companyIndustry = this.formModel.existing.companyIndustryId;
    this.formModel.signUpBorrowerBusiness.entityType = this.formModel.existing.companyEntityTypeId;
    if (this.formModel.existing.companyZipCode) {
      this.getAddressLocation(this.formModel.existing.companyZipCode.trim());
    }
    this.signUpBorrowerBusinessForm.patchValue({
      companyName: this.formModel.existing.companyName,
      companyAddress1: this.formModel.existing.companyAddress1,
      companyCountryId: this.formModel.existing.companyCountryId,
      companyZipCode: this.formModel.existing.companyZipCode,
      companyIndustryId: this.formModel.existing.companyIndustryId,
      companyAreaCode: this.formModel.existing.companyAreaCode,
      companyAreaId: this.formModel.existing.companyAreaId,
      companyEntityTypeId: this.formModel.existing.companyEntityTypeId,
      taxCardTypeId: this.formModel.existing.taxCardTypeId,
      taxCardNumber: this.formModel.existing.taxCardNumber,
      companyRegistrationNumber: this.formModel.existing.companyRegistrationNumber,
      companyAnnualRevenue: this._validatorService.addDelimiter(parseFloat(this.formModel.existing.companyAnnualRevenue).toString(), true)
    });
    if (this.formModel.existing.companyBirthDate) {
      this.signUpBorrowerBusinessForm.patchValue({
        companyBirthDate: new Date(this.formModel.existing.companyBirthDate),
      });
    }
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

  onStateChange() {
    this.signUpBorrowerBusinessForm.patchValue({
      companyDistrict: ''
    });
  }

  addressKeyUpEvent(text: string) {
    this.addressSubject.next(text);
  }

  patchMobilePhoneNumber(phoneNumber: string) {
    this.signUpBorrowerPersonalForm.patchValue({
      mobilePhoneNumber: phoneNumber
    });
  }

  patchSpouseMobilePhoneNumber(phoneNumber: string) {
    this.signUpBorrowerPersonalForm.patchValue({
      spouseMobilePhoneNumber: phoneNumber
    });
  }

  getAddressLocation(key: string) {
    this._memberService
      .getAddressLocation(this.countryCode, key)
      .subscribe(
        response => {
          this.addressList = [];
          this.addressList = response.data;
          if (this.formModel.existing && this.formModel.existing.companyAreaId) {
            this.onAreaDetailSave(this.formModel.existing.companyAreaId);
          }
          if (this.addressList.length === 1) {
            this.selectedAreaId = this.addressList[0].area_id;
          }
          if (this.addressList.length === 0) {
            this.signUpBorrowerBusinessForm.patchValue({
              companyAreaId: null
            });
            this._notificationService.error(this.formModel.signUpBorrowerBusiness.zipCodeNotFound);
          }
        },
        error => {
          this._notificationService.error(error);
        }
      );
  }

  goToDashboard() {
    this._router.navigate(['/admin-borrower/overview']);
  }

}
