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
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { MemberService } from '../../services/member.service';
import { FeatureFlagService } from '../../services/feature-flag.service';
import { DocumentService } from '../../services/document.service';
import { NotificationService } from '../../services/notification.service';
import { UtilityService } from '../../services/utility.service';
import { FormService } from '../../services/form.service';
import { EventService } from '../../services/event.service';

import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ValidatorService } from '../../services/validator.service';
import { ENVIRONMENT } from '../../../environments/environment';
import { Observable } from 'rxjs';
import CONFIGURATION from '../../../configurations/configuration';

enum InvestorOnBoardSteps {
  personal = 1,
  documentUpload = 2,
  completed = 3
}
@Component({
  selector: 'app-sign-up-form-investor-sg',
  templateUrl: './sign-up-sg.html'
})
export class SignupFormInvestorSGComponent implements OnInit {
  countryCode: string;
  currentStep: number;
  formModel: any;
  imageBaseUrl: string;
  memberId: string;
  masterData: any;
  signUpInvestorPersonalForm: FormGroup;
  steps: Array<any>;
  swiperConfiguration: SwiperConfigInterface;
  testimonialContent: Array<any>;
  testimonialContentFlag: boolean;
  showPermanentResident: boolean;
  CONFIGURATION: any;
  disableFloorUnit: boolean;
  isInvestorOnboardingCompleted: boolean;
  lastStepIndex: number;
  featureFlagObservable: Observable<any>;
  getAddressFromOneMap: boolean;
  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _formBuilder: FormBuilder,
    private _featureFlagService: FeatureFlagService,
    private _memberService: MemberService,
    private _documentService: DocumentService,
    private _notificationService: NotificationService,
    private _router: Router,
    private _translateService: TranslateService,
    private _validatorService: ValidatorService,
    private _utilityService: UtilityService,
    private _formService: FormService,
    private _eventService: EventService,
    private _domSanitizer: DomSanitizer,
  ) {
    this.CONFIGURATION = CONFIGURATION;
    this.countryCode = CONFIGURATION.country_code;
    this.currentStep = 1;
    this.formModel = {
      completion: 0,
      existing: null,
      signUpInvestorDocument: {
        configuration: this._baseParameterService.getDocumentUploadingConfigWithUploadImage(),
        error: '',
        documents: new Array<any>(),
        needPassport: false,
        placeholder: {
          upload: '',
          uploaded: ''
        },
        success: ''
      },
      signUpInvestorPersonal: {
        accepted: true,
        birthDateValid: true,
        citizenshipPermanentResident: null,
        dateRestrictions: {
          investorMinimumAge: 0,
          passportExpiry: 0
        },
        error: '',
        errors: {
          birthDate: '',
          minimumBirthDate: '',
          addressNotFound: '',
          postalCode: ''
        },
        genderId: '',
        passportValid: true,
        passportExpiryDateValid: true,
        residentialCountryId: '',
        stateId: '',
        success: '',
        validation: false
      }
    };
    this.imageBaseUrl = CONFIGURATION.image_base_url;
    this.masterData = {
      countries: new Array<any>(),
      genders: new Array<any>(),
      personalIdentityTypes: new Array<any>(),
      states: new Array<any>()
    };
    this.testimonialContent = new Array<any>();
    this.testimonialContentFlag = false;
    this.showPermanentResident = false;
    this.memberId = '';
    this.lastStepIndex = 0;
    this.getAddressFromOneMap = false;

    this.signUpInvestorPersonalForm = this._formBuilder.group({
      address1: new FormControl(null, [Validators.required]),
      address2: new FormControl(null, []),
      birthDate: new FormControl(null, [Validators.required]),
      citizenshipCountryId: new FormControl(null, [Validators.required]),
      district: new FormControl(null, []),
      genderId: new FormControl(null, [Validators.required]),
      icNumber: new FormControl(null, []),
      passportExpiryDate: new FormControl(null, []),
      passportNumber: new FormControl(null, []),
      residentialCountryId: new FormControl(null, [Validators.required]),
      stateId: new FormControl(null, []),
      unitNumber: new FormControl(null, [Validators.required]),
      floorNumber: new FormControl(null, [Validators.required]),
      postalCode: new FormControl(null, [Validators.required])
    });
    this.swiperConfiguration = _baseParameterService.sign_up_swipper_config;
    this.disableFloorUnit = false;
    this.steps = this._baseParameterService.getInvestorOnboardingStep();
    this.isInvestorOnboardingCompleted = false;
  }

  ngOnInit() {
    const { sgOneMapAutoPopulate } = this._featureFlagService.getFeatureFlagKeys();
    this.featureFlagObservable = this._featureFlagService.getFeatureFlagObservable();
    this.featureFlagObservable.subscribe((flags) => {
      this.getAddressFromOneMap = flags[sgOneMapAutoPopulate];
    });
    this.lastStepIndex = Math.max.apply(Math, this.steps.map(function (o) { return o.index; }));
    this.initialize();
    this._translateService
      .get('form.onboarding-investor.image-swipper')
      .subscribe(
        testimonial => {
          this.testimonialContent = testimonial;
          this.testimonialContentFlag = true;
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
        case InvestorOnBoardSteps.personal:
          if (this.formModel.existing) {
            this.prefillSignUpInvestorPersonalForm();
          } else {
            this._memberService.getMemberDetail().subscribe(
              response => {
                this.formModel.existing = response;
                this.prefillSignUpInvestorPersonalForm();
              }, error => {
                this._notificationService.error(error);
              });
          }
          break;
        case InvestorOnBoardSteps.documentUpload:
          this.prefillSignUpInvestorDocumentForm();
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
          this.masterData.countries = masterData.countries;
          this.masterData.countries = this.masterData.countries.filter((element) => {
            return element.code !== CONFIGURATION.country_code;
          });
          this.masterData.countries.unshift({
            code: CONFIGURATION.country_code,
            name: CONFIGURATION.country_name
          });
          this.masterData.personalIdentityTypes = masterData.personalIdentityTypes;
          this.masterData.personalIdentityTypes = this.masterData.personalIdentityTypes.filter((element) => {
            return element.code !== '';
          });
        },
        error => {
          this._notificationService.error();
          this.kickOut();
        }
      );

    this._translateService
      .get('form.onboarding-investor.personal')
      .subscribe(
        personal => {
          this.formModel.signUpInvestorPersonal.error = personal.error;
          this.formModel.signUpInvestorPersonal.errors.birthDate = personal.errors['birth-date'];
          this.formModel.signUpInvestorPersonal.errors.minimumBirthDate = personal.errors['minimum-birth-date'];
          this.formModel.signUpInvestorPersonal.errors.passportExpiryDate = personal.errors['passport-expiry-date'];
          this.formModel.signUpInvestorPersonal.success = personal.success;
          this.formModel.signUpInvestorPersonal.errors.postalCode = personal.errors['postal-code'];
          this.formModel.signUpInvestorPersonal.errors.addressNotFound = personal.errors['address-not-found'];
        }
      );

    this._translateService
      .get('master.genders')
      .subscribe(
        genders => {
          this.masterData.genders = genders;
        });


    this._translateService
      .get('form.onboarding-investor.steps')
      .subscribe(
        steps => {
          let step;
          this._memberService.getMemberDetail().subscribe(
            response => {
              this.formModel.existing = response;
              if (this.formModel.existing.lastSignUpStepWeb === this.steps.find(x => x.index === this.lastStepIndex).lastSignUpStepWeb) {
                this.isInvestorOnboardingCompleted = true;
              }

              if (!this.formModel.existing.unitNumber && !this.formModel.existing.unitFloor) {
                this.onSignUpInvestorDontHaveFloorUnit(true);
              }

              // INITIALIZE PASSPORT UPLOAD REQUIREMENT
              this.formModel.signUpInvestorDocument.needPassport = (this.formModel.existing.citizenshipCountryId !== CONFIGURATION.country_code);
              this._translateService
                .get('form.onboarding-investor.document')
                .subscribe(
                  document => {
                    this.formModel.signUpInvestorDocument.error = document.error;
                    this.formModel.signUpInvestorDocument.placeholder = document.placeholder;
                    this.formModel.signUpInvestorDocument.success = document.success;
                    this.formModel.signUpInvestorDocument.documents = Object.values(document.documents).map(documentValue => {
                      return {
                        display: this.displayDocument(documentValue['type']),
                        label: documentValue['label'],
                        message: documentValue['label'],
                        description: documentValue['description'] || '',
                        type: documentValue['type'],
                        uploaded: false,
                        sort: 0
                      };
                    });
                    const documentSortList = this._baseParameterService.getDocumentUploadingSortList();

                    for (let key in documentSortList) {
                      if (this.formModel.signUpInvestorDocument.documents.find(value => value.type === documentSortList[key].type)) {
                        this.formModel.signUpInvestorDocument.documents.find(value => value.type === documentSortList[key].type).sort = documentSortList[key].sort;
                      }
                    }

                    this.formModel.signUpInvestorDocument.documents.sort((a, b) => {
                      if (a.sort < b.sort) return -1;
                      else if (a.sort > b.sort) return 1;
                      else return 0;
                    });
                  });


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

    this._memberService.getCountryDetail(this.countryCode).subscribe(
      data => {
        this.formModel.signUpInvestorPersonal.dateRestrictions.investorMinimumAge = data.investor_minimum_age;
      },
      error => {
        this._notificationService.error();
      });

    this.formModel.signUpInvestorPersonal.dateRestrictions.passportExpiry
      = CONFIGURATION.dateRestrictions.passportExpiry;
  }

  displayDocument(docType: string) {
    let citizenshipCountryId = this.signUpInvestorPersonalForm.value.citizenshipCountryId || this.formModel.existing.citizenshipCountryId;
    let citizenshipPermanentResident = this.formModel.signUpInvestorPersonal.citizenshipPermanentResident || this.formModel.existing.citizenshipPermanentResident;
    if (docType.includes('NRIC')) {
      if (citizenshipCountryId === this.countryCode ||
        (citizenshipPermanentResident === true && citizenshipCountryId !== this.countryCode)) {
        return true;
      }
      else {
        return false;
      }
    }
    else if (docType === 'PORA' || docType === 'PASSPORT') {
      if (!citizenshipPermanentResident && citizenshipCountryId !== this.countryCode) {
        return true;
      }
      else {
        return false;
      }
    }
  }


  kickOut(): void {
    this._authService.logOut();
    this._router.navigate(['/log-in']);
  }

  onBirthDateChange(showNotification: boolean): void {
    this.formModel.signUpInvestorPersonal.birthDateValid = (
      this.signUpInvestorPersonalForm.value.birthDate !== null &&
      this.signUpInvestorPersonalForm.value.birthDate !== ''
    );
    if (this.formModel.signUpInvestorPersonal.birthDateValid) {
      const today = new Date();
      const comparator = new Date(this.signUpInvestorPersonalForm.value.birthDate);
      const timeDiff = today.getTime() - comparator.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (diffDays <= 0) {
        this.formModel.signUpInvestorPersonal.birthDateValid = false;
        if (showNotification) {
          this._notificationService.error(this.formModel.signUpInvestorPersonal.errors.birthDate);
        }
      } else if (diffDays < 365.25 * this.formModel.signUpInvestorPersonal.dateRestrictions.investorMinimumAge) {
        this.formModel.signUpInvestorPersonal.birthDateValid = false;
        if (showNotification) {
          this._notificationService.error(this.formModel.signUpInvestorPersonal.errors.minimumBirthDate);
        }
      }
    }
  }

  onFileUploadError(args: any, documentLabel: string): void {
    let message = documentLabel + ': ' + args[1];
    this._notificationService.error(message, 5000);
  }

  onFileUploadSending(args: any, documentType: string): void {
    args[2].append('doc_type', documentType);
    args[2].append('investor_id', this.memberId);
    args[2].append('country_id', CONFIGURATION.country_code);
  }

  onFileUploadSuccess(args: any, documentType: string): void {
    let document = this.formModel
      .signUpInvestorDocument
      .documents
      .find(document => {
        return document.type === documentType
      });
    if (document) {
      let message = `${document.label} uploaded.`;
      this._notificationService.success(message, 5000);
      document.uploaded = true;
      document.message = this._domSanitizer.sanitize(SecurityContext.HTML,
        ` ${document.label}
          <br>
          <div
            class="btn upload-button white-text font-size-16 Gilroy-SemiBold success">
            ${this.formModel.signUpInvestorDocument.placeholder.uploaded} <i class="fa fa-check margin-left-10" aria-hidden="true"></i>
          </div>
        `);
    }
  }

  onIdentityChangeValidator(): void {
    if ((this.formModel.signUpInvestorPersonal.citizenshipPermanentResident &&
      this.signUpInvestorPersonalForm.value.citizenshipCountryId !== this.countryCode) ||
      this.signUpInvestorPersonalForm.value.citizenshipCountryId === this.countryCode
    ) {
      this.signUpInvestorPersonalForm.controls.icNumber.setValidators([Validators.required,
      this._validatorService.validateSingaporeNRIC]);
      this.signUpInvestorPersonalForm.controls.passportNumber.setValidators([]);
      this.signUpInvestorPersonalForm.controls.passportExpiryDate.setValidators([]);
    } else {
      this.signUpInvestorPersonalForm.controls.passportNumber.setValidators([Validators.required]);
      this.signUpInvestorPersonalForm.controls.passportExpiryDate.setValidators([Validators.required]);
      this.signUpInvestorPersonalForm.controls.icNumber.setValidators([]);
    }
  }

  onCitizenshipCountryChange(flag: any = ''): void {
    let countryId = '';
    this.showPermanentResident = false;
    countryId = this.formModel.existing.citizenshipCountryId;
    if (flag !== '') {
      countryId = flag;
    }

    if (countryId !== this.countryCode) {
      this.formModel.signUpInvestorPersonal.citizenshipPermanentResident = false;
      this.showPermanentResident = true;
    }
    this.onIdentityChangeValidator();
  }

  onPassportExpiryDateChange(showNotification: boolean): void {
    // REINITIALIZE PASSPORT UPLOAD REQUIREMENT
    this.formModel.signUpInvestorDocument.needPassport = (this.signUpInvestorPersonalForm.value.citizenshipCountryId !== CONFIGURATION.country_code);
    this.reconstructDocuments();

    this.formModel.signUpInvestorPersonal.passportExpiryDateValid = true;
    if (this.formModel.signUpInvestorPersonal.citizenshipPermanentResident ||
      this.signUpInvestorPersonalForm.value.citizenshipCountryId === this.countryCode) {
      this.signUpInvestorPersonalForm.patchValue({
        passportNumber: null,
        passportExpiryDate: null
      });
    } else {
      this.signUpInvestorPersonalForm.patchValue({
        icNumber: null
      });

      this.formModel.signUpInvestorPersonal.passportExpiryDateValid = (
        this.signUpInvestorPersonalForm.value.passportExpiryDate !== null &&
        this.signUpInvestorPersonalForm.value.passportExpiryDate !== ""
      );
      if (this.formModel.signUpInvestorPersonal.passportExpiryDateValid) {
        var today = new Date();
        var comparator = new Date(this.signUpInvestorPersonalForm.value.passportExpiryDate);
        var timeDiff = comparator.getTime() - today.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (diffDays / 30.0 < this.formModel.signUpInvestorPersonal.dateRestrictions.passportExpiry) {
          this.formModel.signUpInvestorPersonal.passportExpiryDateValid = false;
          if (showNotification) {
            this._notificationService.error(this.formModel.signUpInvestorPersonal.errors.passportExpiryDate);
          }
        }
      }
    }
  }

  onSignUpInvestorDocumentFormSubmit(): void {
    let signUpInvestorDocumentValid = true;
    this.formModel
      .signUpInvestorDocument
      .documents
      .forEach(document => {
        if (document.display && !document.uploaded) {
          signUpInvestorDocumentValid = false;
        }
      });

    if (signUpInvestorDocumentValid) {
      const lastSignUpStepWeb = this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb;
      const body = {
        lastSignUpStepWeb: lastSignUpStepWeb
      };
      this._memberService.updateMember(body).subscribe(
        response => {
          if (response.status === 'success') {
            this.isInvestorOnboardingCompleted = true;
            this._authService.setLastSignUStepWeb(lastSignUpStepWeb);
            this._eventService.sendInvSignupEvent('INV-doc-upload');
          } else {
            this._notificationService.error(response.message);
          }
        },
        error => {
          this._notificationService.error();
        });
    } else {
      window.scrollTo(0, 0);
      this._notificationService.error(this.formModel.signUpInvestorDocument.error);
    }
  }


  onSignUpInvestorPersonalFormAccept(event: any): void {
    this.formModel.signUpInvestorPersonal.accepted = event.checked;
  }

  onSignUpInvestorPermanentResidentCheck(event: any): void {
    this.formModel.signUpInvestorPersonal.citizenshipPermanentResident = event.checked;
    this.onIdentityChangeValidator();
  }


  onSignUpInvestorPersonalFormSubmit(): void {
    this.formModel.signUpInvestorPersonal.validation = true;

    // Birth Date Validation
    this.onBirthDateChange(true);
    let signUpInvestorPersonalValid = this.formModel.signUpInvestorPersonal.birthDateValid;

    // Passport Expiry Date Validation
    this.onPassportExpiryDateChange(true);
    signUpInvestorPersonalValid = signUpInvestorPersonalValid && this.formModel.signUpInvestorPersonal.passportExpiryDateValid;

    signUpInvestorPersonalValid = signUpInvestorPersonalValid && this.signUpInvestorPersonalForm.valid;
    this._formService.throwErrorForRequiredFields(this.signUpInvestorPersonalForm);

    if (signUpInvestorPersonalValid) {
      let icTypeId = null;
      if (this.signUpInvestorPersonalForm.value.citizenshipCountryId === this.countryCode || this.formModel.signUpInvestorPersonal.citizenshipPermanentResident) {
        icTypeId = this._baseParameterService.getICType().id;
      } else {
        // FOR OTHER
        icTypeId = this._baseParameterService.getOtherIdCardId();
      }
      let unitNumber = null;
      if (this.signUpInvestorPersonalForm.value.unitNumber && this.signUpInvestorPersonalForm.value.floorNumber) {
        unitNumber = '#' + this.signUpInvestorPersonalForm.value.floorNumber + '-' + this.signUpInvestorPersonalForm.value.unitNumber;
      }
      const body = {
        address1: this.signUpInvestorPersonalForm.value.address1,
        address2: this.signUpInvestorPersonalForm.value.address2,
        birthDate: this._utilityService.stripTimeZoneFromDate(this.signUpInvestorPersonalForm.value.birthDate),
        countryId: CONFIGURATION.country_code,
        citizenshipCountryId: this.signUpInvestorPersonalForm.value.citizenshipCountryId,
        citizenshipPermanentResident: this.formModel.signUpInvestorPersonal.citizenshipPermanentResident,
        district: this.signUpInvestorPersonalForm.value.district,
        genderId: this.signUpInvestorPersonalForm.value.genderId,
        icNumber: this.signUpInvestorPersonalForm.value.icNumber,
        icTypeId: icTypeId,
        passportExpiryDate: this._utilityService.stripTimeZoneFromDate(this.signUpInvestorPersonalForm.value.passportExpiryDate),
        passportNumber: this.signUpInvestorPersonalForm.value.passportNumber,
        residentialCountryId: this.signUpInvestorPersonalForm.value.residentialCountryId,
        stateId: this.signUpInvestorPersonalForm.value.stateId,
        unitNumber: unitNumber,
        zipCode: this.signUpInvestorPersonalForm.value.postalCode,
        lastSignUpStepWeb: this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb
      };

      this._memberService.updateMember(body).subscribe(
        response => {
          if (response.status === 'success') {
            let nextStep = this.steps.find(step => {
              return step.index === this.currentStep + 1;
            });
            if (nextStep) {
              this._eventService.sendInvSignupEvent('INV-personal-details');
              if (nextStep.index > this.formModel.completion) {
                if (response.status === 'success') {
                  this.changeStep(nextStep.index);
                  this.formModel.completion = nextStep.key;
                  this.formModel.signUpInvestorPersonal.accepted = true;
                  this.formModel.existing = null;
                  this.formModel.signUpInvestorPersonal.validation = false;
                  this.signUpInvestorPersonalForm.reset();
                } else {
                  this._notificationService.error(response.message);
                }
              } else {
                this.changeStep(nextStep.index);
                this.formModel.signUpInvestorPersonal.accepted = true;
                this.formModel.existing = null;
                this.formModel.signUpInvestorPersonal.validation = false;
                this.signUpInvestorPersonalForm.reset();
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

  onResidentialCountryChange(countryCode: string, stateId: number = null): void {
    if (countryCode) {
      this.signUpInvestorPersonalForm.patchValue({
        stateId: null,
        district: null
      });

      this._memberService
        .getLookUpStates(countryCode)
        .subscribe(
          response => {
            let states = response.data;
            this.masterData.states = states;

            if (stateId) {
              this.formModel.signUpInvestorPersonal.stateId = stateId;
              this.signUpInvestorPersonalForm.patchValue({
                stateId: stateId
              });
            }
          },
          error => {
            console.error("onResidentialCountryChange", error)
          }
        )
    }
  }

  onResidentialStateChange(stateId: string, district: string = null): void {
    if (stateId) {
      this.signUpInvestorPersonalForm.patchValue({
        district: district
      });
    }
  }

  prefillSignUpInvestorDocumentForm(): void {
    this.reconstructDocuments();
    this.formModel
      .signUpInvestorDocument
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
                    ${this.formModel.signUpInvestorDocument.placeholder.uploaded}
                    <i class="fa fa-check margin-left-10" aria-hidden="true"></i>
                  </div>
                `);
            } else {
              document.message =
                this._domSanitizer.sanitize(SecurityContext.HTML,
                  `<span class="upload-label">${document.label}</span>
                  <br>
                  <span class="upload-btn-description">
                    ${this.formModel.signUpInvestorDocument.placeholder.dragDrop}
                  </span>
                  <a class="link">${this.formModel.signUpInvestorDocument.placeholder.browseFiles}</a>
                `);
            }
          }, error => {
            console.error(error);
          }
        );
      });
  }

  prefillSignUpInvestorPersonalForm(): void {
    this.onCitizenshipCountryChange();
    let unitNumber = null;
    let floorNumber = null;
    if (this.formModel.existing.unitNumber) {
      const existingUnitNumber = (this.formModel.existing.unitNumber).split('-');
      if (existingUnitNumber.length > 1) {
        floorNumber = existingUnitNumber[0].replace('#', '');
        unitNumber = existingUnitNumber[1];
      }
    }
    this.signUpInvestorPersonalForm.patchValue({
      address1: this.formModel.existing.address1,
      address2: this.formModel.existing.address2,
      citizenshipCountryId: this.formModel.existing.citizenshipCountryId,
      genderId: this.formModel.existing.genderId,
      icNumber: this.formModel.existing.icNumber,
      floorNumber: floorNumber,
      unitNumber: unitNumber,
      passportNumber: this.formModel.existing.passportNumber,
      residentialCountryId: this.formModel.existing.residentialCountryId,
      postalCode: this.formModel.existing.zipCode
    });

    this.formModel.signUpInvestorPersonal.citizenshipPermanentResident = this.formModel.existing.citizenshipPermanentResident;

    this.formModel.signUpInvestorPersonal.residentialCountryId = this.formModel.existing.residentialCountryId;
    this.formModel.signUpInvestorPersonal.citizenshipCountryId = this.formModel.existing.citizenshipCountryId;
    this.onIdentityChangeValidator();
    this.formModel.signUpInvestorPersonal.genderId = this.formModel.existing.genderId;

    this.onResidentialCountryChange(this.formModel.existing.residentialCountryId, this.formModel.existing.stateId);
    this.onResidentialStateChange(this.formModel.existing.stateId, this.formModel.existing.district);
    if (this.formModel.existing.birthDate) {
      this.signUpInvestorPersonalForm.patchValue({
        birthDate: new Date(this.formModel.existing.birthDate),
      });
    }
    if (this.formModel.existing.passportExpiryDate) {
      this.signUpInvestorPersonalForm.patchValue({
        passportExpiryDate: new Date(this.formModel.existing.passportExpiryDate),
      });
    }
  }

  reconstructDocuments(): void {
    this.formModel
      .signUpInvestorDocument
      .documents
      .forEach(document => {
        document.display = (
          this.displayDocument(document.type)
        );
      });
  }

  onSignUpInvestorDontHaveFloorUnit(event: any): void {
    this.disableFloorUnit = event;
    if (event) {
      this.signUpInvestorPersonalForm.patchValue({
        unitNumber: null,
        floorNumber: null
      });
      this.signUpInvestorPersonalForm.setControl(`unitNumber`, new FormControl(null, []));
      this.signUpInvestorPersonalForm.setControl(`floorNumber`, new FormControl(null, []));
    } else {
      this.signUpInvestorPersonalForm.setControl(`unitNumber`, new FormControl(null, [Validators.required]));
      this.signUpInvestorPersonalForm.setControl(`floorNumber`, new FormControl(null, [Validators.required]));
    }
    this.signUpInvestorPersonalForm.controls.unitNumber.updateValueAndValidity();
    this.signUpInvestorPersonalForm.controls.floorNumber.updateValueAndValidity();
  }

  getAddress() {
    if (this.signUpInvestorPersonalForm.value.postalCode) {
      this.signUpInvestorPersonalForm.patchValue({
        address1: null,
        address2: null
      });
      this._memberService
        .getAddressFromOneMap(this.signUpInvestorPersonalForm.value.postalCode)
        .subscribe(
          response => {
            if (response.found) {
              const address = response.results[0];
              this.signUpInvestorPersonalForm.patchValue({
                address1: response.results[0]['BLK_NO'] + ' ' + response.results[0]['ROAD_NAME'],
                address2: response.results[0]['BUILDING']
              });
            } else {
              this._notificationService.error(this.formModel.signUpInvestorPersonal.errors.addressNotFound);
            }
          },
          error => {
            this._notificationService.error(this.formModel.signUpInvestorPersonal.errors.addressNotFound);
          }
        );
    } else {
      this._notificationService.error(this.formModel.signUpInvestorPersonal.errors.postalCode);
    }
  }

  goToSubscriptionAgreement() {
    this._router.navigate(['/admin-investor/subscription-agreement']);
  }
}
