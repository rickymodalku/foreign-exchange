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
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { MemberService } from '../../services/member.service';
import { DocumentService } from '../../services/document.service';
import { NotificationService } from '../../services/notification.service';
import { UtilityService } from '../../services/utility.service';
import { ValidatorService } from '../../services/validator.service';
import { FormService } from '../../services/form.service';
import { EventService } from '../../services/event.service';
import CONFIGURATION from '../../../configurations/configuration';
import { Subject } from 'rxjs';
import { TwoFaPhoneNumberConfig } from '../../components/two-fa/two-fa-common/two-fa-interface';
import { debounceTime } from 'rxjs/operators';

const subject = new Subject<string>();
enum InvestorOnBoardSteps {
  personal = 1,
  business = 2,
  documentUpload = 3,
  completed = 4
}

@Component({
  selector: 'app-sign-up-form-investor-id',
  templateUrl: './sign-up-id.html'
})
export class SignupFormInvestorIDComponent implements OnInit {
  countryCode: string;
  currentStep: number;
  formModel: any;
  imageBaseUrl: string;
  masterData: any;
  memberId: string;
  signUpInvestorBusinessForm: FormGroup;
  signUpInvestorPersonalForm: FormGroup;
  steps: Array<any>;
  swiperConfiguration: SwiperConfigInterface;
  testimonialContent: Array<any>;
  testimonialContentFlag: boolean;
  twoFaOptions: any;
  CONFIGURATION: any;
  copyFromResidentialAddress: boolean;
  identityAddressSubject: Subject<string> = new Subject();
  residentialAddressSubject: Subject<string> = new Subject();
  emergencyAddressSubject: Subject<string> = new Subject();
  residentialAddressNameList: any;
  residentialAddressListFlag: boolean;
  identityAddressNameList: any;
  identityAddressListFlag: boolean;
  emergencyAreaNameList: Array<any>;
  emergencyAddressListFlag: boolean;
  selectAreaText: string;
  residentialAreaNamePlaceHolder: string;
  identityAreaNamePlaceHolder: string;
  emergencyAreaNamePlaceHolder: string;
  companyPhoneNumberConfig: TwoFaPhoneNumberConfig;
  emergencyMobilePhoneNumberConfig: TwoFaPhoneNumberConfig;
  investorMemberTypeCode: string;
  lastStepIndex: number;
  isInvestorOnboardingCompleted: boolean;
  userName: string;
  memberTypeCode: string;

  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _formBuilder: FormBuilder,
    private _memberService: MemberService,
    private _documentService: DocumentService,
    private _notificationService: NotificationService,
    private _router: Router,
    private _translateService: TranslateService,
    private _validatorService: ValidatorService,
    private _formService: FormService,
    private _utilityService: UtilityService,
    private _eventService: EventService,
    private _domSanitizer: DomSanitizer,
  ) {
    this.copyFromResidentialAddress = false;
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
        success: '',
        zipCodeError: ''
      },
      signUpInvestorBusiness: {
        memberEntityType: '',
        companyform: false,
        companyCountry: '',
        companyState: '',
        validation: false,
        companyPhoneNumberValidation: false
      },
      signUpInvestorPersonal: {
        birthDateValid: true,
        citizenshipValid: true,
        citizenshipCountryId: '',
        taxNumberValid: true,
        dateRestrictions: {
          investorMinimumAge: 0,
          passportExpiry: 0
        },
        gender: '',
        error: '',
        errors: {
          birthDate: '',
          minimumBirthDate: ''
        },
        npwpCheck: true,
        passportValid: true,
        passportExpiryDateValid: true,
        residentialCountryId: '',
        emergencyCountryId: '',
        citizenshipState: '',
        state: '',
        success: '',
        validation: false,
        emergencyMobilePhoneNumberValidation: false
      }
    };
    this.memberId = '';
    this.residentialAreaNamePlaceHolder = '';
    this.identityAreaNamePlaceHolder = '';
    this.emergencyAreaNamePlaceHolder = '';

    this.selectAreaText = '';
    this.masterData = {
      countries: new Array<any>(),
      genders: new Array<any>(),
      memberEntityTypes: new Array<any>(),
      religions: new Array<any>(),
      degrees: new Array<any>(),
      maritalStatuses: new Array<any>(),
      businessStates: new Array<any>()
    };
    this.imageBaseUrl = CONFIGURATION.image_base_url;
    this.signUpInvestorBusinessForm = this._formBuilder.group({
      memberEntityTypeId: new FormControl(null, Validators.pattern(this._validatorService.numberPattern)),
      companyName: new FormControl({ disabled: true }, [Validators.required]),
      companyRegistrationNumber: new FormControl(null, [Validators.required]),
      companyBirthDate: new FormControl(null, [Validators.required]),
      companyEmail: new FormControl(null, [Validators.required, Validators.email]),
      companyPhoneNumber: new FormControl(null, [Validators.required]),
      companyAddress1: new FormControl(null, [Validators.required]),
      companyCountryId: new FormControl(null, [Validators.required]),
      companyStateId: new FormControl(null, Validators.pattern(this._validatorService.numberPattern)),
      companyDistrict: new FormControl(null, []),
      companyZipCode: new FormControl(null, [Validators.required])
    });
    this.signUpInvestorPersonalForm = this._formBuilder.group({
      address1: new FormControl(null, [Validators.required]),
      areaId: new FormControl(null, []),
      area: new FormControl(null, []),
      birthPlace: new FormControl(null, [Validators.required]),
      birthDate: new FormControl(null, [Validators.required]),
      citizenshipCountryId: new FormControl(null, [Validators.required]),
      citizenshipAddress1: new FormControl(null, [Validators.required]),
      citizenshipZipCode: new FormControl(null, [Validators.required]),
      citizenshipAreaId: new FormControl(null, []),
      citizenshipArea: new FormControl(null, []),
      citizenshipAreaCode: new FormControl(null, []),
      emergencyFullname: new FormControl(null, [Validators.required]),
      emergencyMobilePhoneNumber: new FormControl(null, [Validators.required]),
      emergencyRelationship: new FormControl(null, [Validators.required]),
      emergencyCountryId: new FormControl(null, [Validators.required]),
      emergencyAddress1: new FormControl(null, [Validators.required]),
      emergencyZipCode: new FormControl(null, [Validators.required]),
      emergencyAreaId: new FormControl(null, []),
      emergencyArea: new FormControl(null, []),
      emergencyAreaCode: new FormControl(null, []),
      genderId: new FormControl(null, [Validators.required]),
      degreeCode: new FormControl(null, [Validators.required]),
      religionCode: new FormControl(null, [Validators.required]),
      motherMaidenName: new FormControl(null, [Validators.required]),
      maritalStatusId: new FormControl(null, [Validators.required]),
      icNumber: new FormControl(null, []),
      taxCardNumber: new FormControl(null, []),
      passportExpiryDate: new FormControl(null, []),
      passportNumber: new FormControl(null, []),
      residentialCountryId: new FormControl(null, [Validators.required]),
      areaCode: new FormControl(null, []),
      zipCode: new FormControl(null, [Validators.required])
    });
    this.steps = this._baseParameterService.getInvestorOnboardingStep();
    this.swiperConfiguration = _baseParameterService.sign_up_swipper_config;
    this.testimonialContent = new Array<any>();
    this.testimonialContentFlag = false;
    this.twoFaOptions = {};
    this.lastStepIndex = 0;
    this.userName = this._authService.getUserName();
    this.memberTypeCode = this._authService.getMemberTypeCode();

    this.identityAddressSubject.pipe(debounceTime(750)).subscribe(searchTextValue => {
      const addressType = 'identity';
      if (searchTextValue && this.formModel.signUpInvestorPersonal.citizenshipCountryId === this.countryCode) {
        this.getAddressLocation(searchTextValue, addressType);
      }
    });
    this.residentialAddressSubject.pipe(debounceTime(750)).subscribe(searchTextValue => {
      const addressType = 'residential';
      if (searchTextValue && this.formModel.signUpInvestorPersonal.residentialCountryId === this.countryCode) {
        this.getAddressLocation(searchTextValue, addressType);
      }
    });
    this.emergencyAddressSubject.pipe(debounceTime(750)).subscribe(searchTextValue => {
      const addressType = 'emergency';
      if (searchTextValue && this.formModel.signUpInvestorPersonal.emergencyCountryId === this.countryCode) {
        this.getAddressLocation(searchTextValue, addressType);
      }
    });
    this.companyPhoneNumberConfig = {
      mode: 'ANY',
      allowDropDown: true,
      mobilePhoneNumber: '',
      autoPlaceholder: 'polite'
    };
    this.emergencyMobilePhoneNumberConfig = {
      mode: 'ANY',
      allowDropDown: true,
      mobilePhoneNumber: '',
      autoPlaceholder: 'polite'
    };
    this.investorMemberTypeCode = CONFIGURATION.member_type_code.investor;
    this.isInvestorOnboardingCompleted = false;
  }

  ngOnInit() {
    this.lastStepIndex = Math.max.apply(Math, this.steps.map(function (o) { return o.index; }));
    this.userName = this._authService.getUserName();
    this.memberTypeCode = this._authService.getMemberTypeCode();
    this.initialize();
  }

  residentialAddressKeyUpEvent(text: string) {
    if (this.formModel.signUpInvestorPersonal.residentialCountryId === this.countryCode) {
      this.residentialAddressSubject.next(text);
    }
  }

  identityAddressKeyUpEvent(text: string) {
    if (this.formModel.signUpInvestorPersonal.citizenshipCountryId === this.countryCode) {
      this.identityAddressSubject.next(text);
    }
  }

  emergencyAddressKeyUpEvent(text: string) {
    if (this.formModel.signUpInvestorPersonal.emergencyCountryId === this.countryCode) {
      this.emergencyAddressSubject.next(text);
    }
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
        case InvestorOnBoardSteps.business:
          if (this.formModel.existing) {
            this.prefillSignUpInvestorBusinessForm();
          } else {
            this._memberService.getMemberDetail().subscribe(
              response => {
                this.formModel.existing = response;
                this.prefillSignUpInvestorBusinessForm();
              }, error => {
                this._notificationService.error(error);
              });
          }
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
        },
        error => {
          this._notificationService.error();
          this.kickOut();
        }
      );

    this._memberService
      .getMemberMasterData(this.memberTypeCode)
      .subscribe(
        response => {
          const masterData = response.data;
          for (const memberEntityType of masterData.memberEntityTypes) {
            this.masterData.memberEntityTypes.push(memberEntityType);
          }
          this.formModel.memberEntityType = this.masterData.memberEntityTypes.find(element => {
            return element.code === 'INS';
          });
        },
        error => {
          this._notificationService.error();
          this.kickOut();
        }
      );

    this._translateService
      .get('investor-dashboard.rdn-information.form.error-no-zip-code-found')
      .subscribe(
        error => {
          this.formModel.zipCodeError = error;
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
        }
      );

    this._translateService
      .get('form.onboarding-investor.personal.select-area')
      .subscribe(
        selectArea => {
          this.selectAreaText = selectArea;
        }
      );

    this._translateService
      .get('form.onboarding-investor.steps')
      .subscribe(
        steps => {
          let step;
          this._memberService.getMemberDetail().subscribe(
            response => {
              // this.formModel.completion = signUpDetail.completion;
              this.formModel.existing = response;

              if (this.formModel.existing.lastSignUpStepWeb === this.steps.find(x => x.index === this.lastStepIndex).lastSignUpStepWeb) {
                this.isInvestorOnboardingCompleted = true;
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
                    this.formModel.signUpInvestorDocument.documents = Object.values(document.documents)
                      .map(documentValue => {
                        return {
                          display: (
                            (documentValue['type'] === 'PASSPORT') ? this.formModel.signUpInvestorDocument.needPassport : !this.formModel.signUpInvestorDocument.needPassport
                          ),
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
                      if (this.formModel.signUpInvestorDocument.documents.find(value => value.type === documentSortList[key].type)) {
                        this.formModel.signUpInvestorDocument.documents.find(value => value.type === documentSortList[key].type).sort = documentSortList[key].sort;
                      }
                    }

                    this.formModel.signUpInvestorDocument.documents.sort((a, b) => {
                      if (a.sort < b.sort) return -1;
                      else if (a.sort > b.sort) return 1;
                      else return 0;
                    });
                    if (this.formModel.existing.taxCardNumber === '' ||
                      this.formModel.existing.taxCardNumber === null) {
                      const objIndex = this.formModel.signUpInvestorDocument.documents.findIndex((obj => obj.label === 'NPWP'));
                      this.formModel.signUpInvestorDocument.documents[objIndex].display = false;
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

              if (String(this.formModel.existing.emergencyZipCode).trim() && this.formModel.existing.emergencyZipCode != null) {
                this._memberService.getAddressLocation(this.countryCode, this.formModel.existing.emergencyZipCode).subscribe(
                  response => {
                    this.emergencyAreaNameList = response.data;
                  },
                  error => {
                    this._notificationService.error();
                  });
              }

              if (String(this.formModel.existing.areaId).trim() && this.formModel.existing.areaId != null) {
                this._memberService.getAddressLocation(this.countryCode, this.formModel.existing.zipCode).subscribe(
                  response => {
                    this.residentialAddressNameList = response.data;
                  },
                  error => {
                    this._notificationService.error();
                  });
              }

              if (String(this.formModel.existing.citizenshipZipCode).trim() && this.formModel.existing.citizenshipZipCode != null) {
                this._memberService.getAddressLocation(this.countryCode, this.formModel.existing.citizenshipZipCode).subscribe(
                  response => {
                    this.identityAddressNameList = response.data;
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
                const lastSignUpStepWeb = this.formModel.existing.lastSignUpStepWeb || 'INVESTOR_PERSONAL_INFORMATION';
                step = this.steps.find(step => {
                  return step.lastSignUpStepWeb === lastSignUpStepWeb;
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
          this.masterData.maritalStatuses = masterData['marital-status'];
          this.masterData.genders = masterData['genders'];
        });
  }

  kickOut(): void {
    this._authService.logOut();
    this._router.navigate(['/sign-up-investor']);
  }

  onBirthDateChange(showNotification: boolean): void {
    this.formModel.signUpInvestorPersonal.birthDateValid = (
      this.signUpInvestorPersonalForm.value.birthDate !== null &&
      this.signUpInvestorPersonalForm.value.birthDate !== ""
    );
    if (this.formModel.signUpInvestorPersonal.birthDateValid) {
      var today = new Date();
      var comparator = new Date(this.signUpInvestorPersonalForm.value.birthDate);
      var timeDiff = today.getTime() - comparator.getTime();
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

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

  onSignUpBusinessDisplayCompanyForm(event: any): void {
    this.formModel.signUpInvestorBusiness.companyform = event.checked;
    this.formModel.signUpInvestorBusiness.validation = false;
  }

  onFileUploadSuccess(args: any, documentType: string): void {
    let document = this.formModel
      .signUpInvestorDocument
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
            ${this.formModel.signUpInvestorDocument.placeholder.uploaded}
            <i class="fa fa-check margin-left-10" aria-hidden="true"></i>
          </div>
        `);
    }
  }

  onIdentityNumberChange(): void {
    this.formModel.signUpInvestorPersonal.citizenshipValid = !(
      (this.signUpInvestorPersonalForm.value.icNumber === null || this.signUpInvestorPersonalForm.value.icNumber === '') &&
      (this.signUpInvestorPersonalForm.value.passportNumber === null || this.signUpInvestorPersonalForm.value.passportNumber === '')
    );
  }

  onTaxNumberChange(): void {
    this.formModel.signUpInvestorPersonal.taxNumberValid =
      !(this.signUpInvestorPersonalForm.value.taxCardNumber === null || this.signUpInvestorPersonalForm.value.taxCardNumber === '');
  }

  onPassportExpiryDateChange(showNotification: boolean): void {
    // REINITIALIZE PASSPORT UPLOAD REQUIREMENT
    this.formModel.signUpInvestorDocument.needPassport = (this.signUpInvestorPersonalForm.value.citizenshipCountryId !== CONFIGURATION.country_code);
    this.reconstructDocuments();

    this.formModel.signUpInvestorPersonal.passportExpiryDateValid = true;
    if (this.signUpInvestorPersonalForm.value.citizenshipCountryId === CONFIGURATION.country_code) {
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

  onSignUpInvestorPersonalFormSubmit(): void {
    this.formModel.signUpInvestorPersonal.validation = true;
    this.formModel.signUpInvestorPersonal.taxNumberValid = true;
    let signUpInvestorPersonalValid = this.signUpInvestorPersonalForm.valid;

    if (this.formModel.signUpInvestorPersonal.residentialCountryId !== this.countryCode) {
      this.signUpInvestorPersonalForm.controls.area.setValidators([Validators.required]);
      this.signUpInvestorPersonalForm.controls.areaId.setValidators([]);
    } else {
      this.signUpInvestorPersonalForm.controls.areaId.setValidators([Validators.required]);
      this.signUpInvestorPersonalForm.controls.area.setValidators([]);
    }
    this.signUpInvestorPersonalForm.controls.areaId.updateValueAndValidity();
    this.signUpInvestorPersonalForm.controls.area.updateValueAndValidity();

    if (this.formModel.signUpInvestorPersonal.citizenshipCountryId !== this.countryCode) {
      this.signUpInvestorPersonalForm.controls.citizenshipArea.setValidators([Validators.required]);
      this.signUpInvestorPersonalForm.controls.citizenshipAreaId.setValidators([]);
    } else {
      this.signUpInvestorPersonalForm.controls.citizenshipAreaId.setValidators([Validators.required]);
      this.signUpInvestorPersonalForm.controls.citizenshipArea.setValidators([]);
    }
    this.signUpInvestorPersonalForm.controls.citizenshipAreaId.updateValueAndValidity();
    this.signUpInvestorPersonalForm.controls.citizenshipArea.updateValueAndValidity();

    if (this.formModel.signUpInvestorPersonal.emergencyCountryId !== this.countryCode) {
      this.signUpInvestorPersonalForm.controls.emergencyArea.setValidators([Validators.required]);
      this.signUpInvestorPersonalForm.controls.emergencyAreaId.setValidators([]);
    } else {
      this.signUpInvestorPersonalForm.controls.emergencyAreaId.setValidators([Validators.required]);
      this.signUpInvestorPersonalForm.controls.emergencyArea.setValidators([]);
    }
    this.signUpInvestorPersonalForm.controls.emergencyArea.updateValueAndValidity();
    this.signUpInvestorPersonalForm.controls.emergencyAreaId.updateValueAndValidity();


    // Birth Date Validation
    this.onBirthDateChange(true);
    signUpInvestorPersonalValid = signUpInvestorPersonalValid && this.formModel.signUpInvestorPersonal.birthDateValid;

    // Passport Expiry Date Validation
    this.onPassportExpiryDateChange(true);
    signUpInvestorPersonalValid = signUpInvestorPersonalValid && this.formModel.signUpInvestorPersonal.passportExpiryDateValid;

    // Citizenship ID Validation
    this.onIdentityNumberChange();
    signUpInvestorPersonalValid = signUpInvestorPersonalValid && this.formModel.signUpInvestorPersonal.citizenshipValid;
    this._formService.throwErrorForRequiredFields(this.signUpInvestorPersonalForm);

    if (this.formModel.signUpInvestorPersonal.npwpCheck) {
      if (this.signUpInvestorPersonalForm.value.taxCardNumber === null ||
        this.signUpInvestorPersonalForm.value.taxCardNumber === '') {
        this.formModel.signUpInvestorPersonal.taxNumberValid = false;
      }
    }

    signUpInvestorPersonalValid = signUpInvestorPersonalValid && this.formModel.signUpInvestorPersonal.taxNumberValid;
    if (signUpInvestorPersonalValid &&
      !this.formModel.signUpInvestorPersonal.emergencyMobilePhoneNumberValidation) {
      let icType;
      if (this.signUpInvestorPersonalForm.value.citizenshipCountryId === this.countryCode) {
        icType = this._baseParameterService.getICType().find(o => o.name === 'KTP');
      } else {
        icType = this._baseParameterService.getICType().find(o => o.name === 'Paspor');
      }
      const body = {
        address1: this.signUpInvestorPersonalForm.value.address1,
        address2: this.signUpInvestorPersonalForm.value.address2,
        birthPlace: this.signUpInvestorPersonalForm.value.birthPlace,
        birthDate: this._utilityService.stripTimeZoneFromDate(this.signUpInvestorPersonalForm.value.birthDate),
        countryId: CONFIGURATION.country_code,
        genderId: this.signUpInvestorPersonalForm.value.genderId,
        icNumber: this.signUpInvestorPersonalForm.value.icNumber,
        icTypeId: icType.id,
        taxCardNumber: this.signUpInvestorPersonalForm.value.taxCardNumber,
        passportExpiryDate: this._utilityService.stripTimeZoneFromDate(this.signUpInvestorPersonalForm.value.passportExpiryDate),
        passportNumber: this.signUpInvestorPersonalForm.value.passportNumber,
        residentialCountryId: this.signUpInvestorPersonalForm.value.residentialCountryId,
        zipCode: this.signUpInvestorPersonalForm.value.zipCode,
        areaId: this.signUpInvestorPersonalForm.value.areaId,
        area: this.signUpInvestorPersonalForm.value.area,
        areaCode: this.signUpInvestorPersonalForm.value.areaCode,
        citizenshipIsSame: this.copyFromResidentialAddress,
        citizenshipAddress1: this.signUpInvestorPersonalForm.value.citizenshipAddress1,
        citizenshipCountryId: this.signUpInvestorPersonalForm.value.citizenshipCountryId,
        citizenshipAreaId: this.signUpInvestorPersonalForm.value.citizenshipAreaId,
        citizenshipArea: this.signUpInvestorPersonalForm.value.citizenshipArea,
        citizenshipZipCode: this.signUpInvestorPersonalForm.value.citizenshipZipCode,
        citizenshipAreaCode: this.signUpInvestorPersonalForm.value.citizenshipAreaCode,
        religionCode: this.signUpInvestorPersonalForm.value.religionCode,
        degreeCode: this.signUpInvestorPersonalForm.value.degreeCode,
        motherMaidenName: this.signUpInvestorPersonalForm.value.motherMaidenName,
        maritalStatusId: this.signUpInvestorPersonalForm.value.maritalStatusId,
        emergencyRelationship: this.signUpInvestorPersonalForm.value.emergencyRelationship,
        emergencyFullname: this.signUpInvestorPersonalForm.value.emergencyFullname,
        emergencyMobilePhoneNumber: this.signUpInvestorPersonalForm.value.emergencyMobilePhoneNumber,
        emergencyAddress1: this.signUpInvestorPersonalForm.value.emergencyAddress1,
        emergencyAreaId: this.signUpInvestorPersonalForm.value.emergencyAreaId,
        emergencyArea: this.signUpInvestorPersonalForm.value.emergencyArea,
        emergencyAreaCode: this.signUpInvestorPersonalForm.value.emergencyAreaCode,
        emergencyZipCode: this.signUpInvestorPersonalForm.value.emergencyZipCode,
        emergencyCountryId: this.signUpInvestorPersonalForm.value.emergencyCountryId,
        lastSignUpStepWeb: this.steps.find(x => x.index === this.currentStep).lastSignUpStepWeb
      }
      this._memberService.updateMember(body).subscribe(
        response => {
          if (response.status === 'success') {
            this._eventService.sendInvSignupEvent('INV-personal-details');
            let nextStep = this.steps.find(step => {
              return step.index === this.currentStep + 1;
            });
            if (nextStep) {
              if (nextStep.key > this.formModel.completion) {
                this.changeStep(nextStep.index);
                this.formModel.completion = nextStep.key;
                this.formModel.signUpInvestorPersonal.accepted = true;
                this.formModel.existing = null;
                this.formModel.signUpInvestorPersonal.validation = false;
                this.signUpInvestorPersonalForm.reset();
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


  onSignUpInvestorBusinessFormSubmit(): void {
    if (this.formModel.signUpInvestorBusiness.companyform) {
      this.signUpInvestorBusinessForm.patchValue({
        memberEntityTypeId: this.formModel.memberEntityType.id
      });
      this.formModel.signUpInvestorBusiness.validation = true;
      const signUpInvestorBusinessValid = this.signUpInvestorBusinessForm.valid;
      if (signUpInvestorBusinessValid &&
        !this.formModel.signUpInvestorBusiness.companyPhoneNumberValidation) {
        const body = {
          memberEntityTypeId: this.signUpInvestorBusinessForm.value.memberEntityTypeId,
          companyName: this.signUpInvestorBusinessForm.value.companyName,
          companyRegistrationNumber: this.signUpInvestorBusinessForm.value.companyRegistrationNumber,
          companyBirthDate: this.signUpInvestorBusinessForm.value.companyBirthDate,
          companyEmail: this.signUpInvestorBusinessForm.value.companyEmail,
          companyPhoneNumber: this.signUpInvestorBusinessForm.value.companyPhoneNumber,
          companyAddress1: this.signUpInvestorBusinessForm.value.companyAddress1,
          companyCountryId: this.signUpInvestorBusinessForm.value.companyCountryId,
          companyStateId: this.signUpInvestorBusinessForm.value.companyStateId,
          companyDistrict: this.signUpInvestorBusinessForm.value.companyDistrict,
          companyZipCode: this.signUpInvestorBusinessForm.value.companyZipCode,
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
                  this.changeStep(nextStep.index);
                  this.formModel.completion = nextStep.key;
                  this.formModel.signUpInvestorBusiness.accepted = true;
                  this.formModel.existing = null;
                  this.formModel.signUpInvestorBusiness.validation = false;
                  this.signUpInvestorBusinessForm.reset();
                } else {
                  this.changeStep(nextStep.index);
                  this.formModel.signUpInvestorBusiness.accepted = true;
                  this.formModel.existing = null;
                  this.formModel.signUpInvestorBusiness.validation = false;
                  this.signUpInvestorBusinessForm.reset();
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
    } else {
      const nextStep = this.steps.find(step => {
        return step.index === this.currentStep + 1;
      });
      if (nextStep) {
        if (nextStep.key > this.formModel.completion) {
          this._eventService.sendInvSignupEvent('INV-business');
          this.changeStep(nextStep.index);
          this.formModel.completion = nextStep.key;
          this.formModel.signUpInvestorBusiness.accepted = true;
          this.formModel.existing = null;
          this.formModel.signUpInvestorBusiness.validation = false;
          this.signUpInvestorBusinessForm.reset();
        } else {
          this._eventService.sendInvSignupEvent('INV-business');
          this.changeStep(nextStep.index);
          this.formModel.signUpInvestorBusiness.accepted = true;
          this.formModel.existing = null;
          this.formModel.signUpInvestorBusiness.validation = false;
          this.signUpInvestorBusinessForm.reset();
        }
      } else {
        this._notificationService.error();
      }
    }
  }

  onBusinessCountryChange(countryCode: string, stateId: number = null): void {
    if (countryCode) {
      this.signUpInvestorBusinessForm.patchValue({
        companyStateId: null,
        companyDistrict: null
      });

      this._translateService
        .get('master.states')
        .subscribe(
          response => {
            this.masterData.businessStates = [];
            for (let key in response) {
              if (response[key]['country']['code'] === countryCode) {
                this.masterData.businessStates.push({
                  id: response[key]['id'],
                  name: response[key]['name']
                });
              }
            }

            if (stateId) {
              this.formModel.signUpInvestorBusiness.companyState = stateId;
              this.signUpInvestorPersonalForm.patchValue({
                companyStateId: stateId
              });
            }
          });
    }
  }

  onBusinessStateChange(stateId: string, district: string = null): void {
    if (stateId) {
      this.signUpInvestorBusinessForm.patchValue({
        companyDistrict: district
      });
    }
  }


  onSignUpPersonalTaxNumberDisplay(event: any) {
    const objIndex = this.formModel.signUpInvestorDocument.documents.findIndex((obj => obj.label === 'NPWP'));
    this.formModel.signUpInvestorDocument.documents[objIndex].display = true;
    if (!event.checked) {
      this.signUpInvestorPersonalForm.patchValue({
        taxCardNumber: ''
      });
      this.formModel.signUpInvestorDocument.documents[objIndex].display = false;
    }
  }

  prefillSignUpInvestorDocumentForm(): void {
    this._memberService.getMemberDetail().subscribe(
      response => {
        this.memberId = String(response.id);
      });
    if (this.formModel.signUpInvestorPersonal.npwpCheck === false) {
      const objIndex = this.formModel.signUpInvestorDocument.documents.findIndex((obj => obj.label === 'NPWP'));
      this.formModel.signUpInvestorDocument.documents[objIndex].display = false;
    }
    this.formModel
      .signUpInvestorDocument
      .documents
      .forEach(document => {
        this._documentService.getUploadedDocument(document.type)
          .subscribe(
            response => {
              document.uploaded = response.results.length > 0;
              if (document.uploaded) {
                document.message = this._domSanitizer.sanitize(SecurityContext.HTML,
                  `${document.label}
                  <br>
                  <div
                    class="btn upload-button white-text font-size-16 Gilroy-SemiBold success">
                      ${this.formModel.signUpInvestorDocument.placeholder.uploaded}
                      <i class="fa fa-check margin-left-10" aria-hidden="true"></i></font>
                  </div>
                `);
              } else {
                document.message = this._domSanitizer.sanitize(SecurityContext.HTML,
                  `<span class="upload-label">${document.label}</span>
                  <br>
                  <span class="upload-btn-description">
                    ${this.formModel.signUpInvestorDocument.placeholder.dragDrop}
                  </span>
                  <a class="link">${this.formModel.signUpInvestorDocument.placeholder.browseFiles}</a>
                `);
              }
            }, error => {
              this._notificationService.error(error.message);
            }
          );
      });
  }

  prefillSignUpInvestorPersonalForm(): void {
    this.signUpInvestorPersonalForm.patchValue({
      address1: this.formModel.existing.address1,
      address2: this.formModel.existing.address2,
      areaId: this.formModel.existing.areaId,
      area: this.formModel.existing.area,
      areaCode: this.formModel.existing.areaCode,
      genderId: this.formModel.existing.genderId,
      icNumber: this.formModel.existing.icNumber,
      birthPlace: this.formModel.existing.birthPlace,
      taxCardNumber: this.formModel.existing.taxCardNumber,
      passportNumber: this.formModel.existing.passportNumber,
      residentialCountryId: this.formModel.existing.residentialCountryId,
      zipCode: this.formModel.existing.zipCode,
      citizenshipIsSame: this.copyFromResidentialAddress,
      citizenshipAddress1: this.formModel.existing.citizenshipAddress1,
      citizenshipCountryId: this.formModel.existing.citizenshipCountryId,
      citizenshipAreaId: this.formModel.existing.citizenshipAreaId,
      citizenshipArea: this.formModel.existing.citizenshipArea,
      citizenshipZipCode: this.formModel.existing.citizenshipZipCode,
      citizenshipAreaCode: this.formModel.existing.citizenshipAreaCode,
      religionCode: this.formModel.existing.religionCode,
      degreeCode: this.formModel.existing.degreeCode,
      motherMaidenName: this.formModel.existing.motherMaidenName,
      maritalStatusId: this.formModel.existing.maritalStatusId,
      emergencyRelationship: this.formModel.existing.emergencyRelationship,
      emergencyFullname: this.formModel.existing.emergencyFullname,
      emergencyMobilePhoneNumber: this.formModel.existing.emergencyMobilePhoneNumber,
      emergencyAddress1: this.formModel.existing.emergencyAddress1,
      emergencyAreaId: this.formModel.existing.emergencyAreaId,
      emergencyZipCode: this.formModel.existing.emergencyZipCode,
      emergencyCountryId: this.formModel.existing.emergencyCountryId,
      emergencyCityId: this.formModel.existing.emergencyCityId,
      emergencyAreaCode: this.formModel.existing.emergencyAreaCode,
      emergencyArea: this.formModel.existing.emergencyArea,
    });

    this.formModel.signUpInvestorPersonal.gender = this.formModel.existing.genderId;
    this.formModel.signUpInvestorPersonal.citizenshipCountryId = this.formModel.existing.citizenshipCountryId;
    this.formModel.signUpInvestorPersonal.residentialCountryId = this.formModel.existing.residentialCountryId;
    this.formModel.signUpInvestorPersonal.emergencyCountryId = this.formModel.existing.emergencyCountryId;
    this.emergencyMobilePhoneNumberConfig.mobilePhoneNumber = this.formModel.existing.emergencyMobilePhoneNumber;

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
    if (this.formModel.existing.taxCardNumber === null || this.formModel.existing.taxCardNumber === '') {
      this.formModel.signUpInvestorPersonal.npwpCheck = false;
    }
  }

  prefillSignUpInvestorBusinessForm(): void {
    if (this.formModel.existing.companyName) {
      this.formModel.signUpInvestorBusiness.companyform = true;
    }
    this.formModel.signUpInvestorBusiness.companyCountry = this.formModel.existing.companyCountryId;
    this.formModel.signUpInvestorBusiness.companyState = this.formModel.existing.companyStateId;
    this.signUpInvestorBusinessForm.patchValue({
      memberEntityTypeId: this.formModel.existing.memberEntityTypeId,
      companyName: this.formModel.existing.companyName,
      companyRegistrationNumber: this.formModel.existing.companyRegistrationNumber,
      companyEmail: this.formModel.existing.companyEmail,
      companyPhoneNumber: this.formModel.existing.companyPhoneNumber,
      companyAddress1: this.formModel.existing.companyAddress1,
      companyCountryId: this.formModel.existing.companyCountryId,
      companyStateId: this.formModel.existing.companyStateId,
      companyDistrict: this.formModel.existing.companyDistrict,
      companyZipCode: this.formModel.existing.companyZipCode
    });
    this.onBusinessCountryChange(this.formModel.existing.companyCountryId, this.formModel.existing.companyStateId);
    this.onBusinessStateChange(this.formModel.existing.companyStateId, this.formModel.existing.companyDistrict);
    this.companyPhoneNumberConfig.mobilePhoneNumber = this.formModel.existing.companyPhoneNumber;
    if (this.formModel.existing.companyBirthDate) {
      this.signUpInvestorBusinessForm.patchValue({
        companyBirthDate: new Date(this.formModel.existing.companyBirthDate),
      });
    }
  }

  reconstructDocuments(): void {
    this.formModel
      .signUpInvestorDocument
      .documents
      .forEach(document => {
        document.display = (
          document.type === 'PASSPORT' ?
            this.formModel.signUpInvestorDocument.needPassport :
            !this.formModel.signUpInvestorDocument.needPassport
        );
      });
  }

  getAddressLocation(key: string, addressType: string) {
    this._memberService
      .getAddressLocation(this.countryCode, key)
      .subscribe(
        response => {
          if (addressType === 'residential') {
            this.residentialAreaNamePlaceHolder = '';
            this.residentialAddressNameList = [];
            this.residentialAddressListFlag = true;
            this.residentialAddressNameList = response.data;
            if (this.residentialAddressNameList.length === 1) {
              this.signUpInvestorPersonalForm.patchValue({
                areaId: this.residentialAddressNameList[0].area_id
              });
            }
            if (this.residentialAddressNameList.length > 1) {
              this.residentialAreaNamePlaceHolder = this.selectAreaText;
            }
          } else if (addressType === 'identity') {
            this.identityAreaNamePlaceHolder = '';
            this.identityAddressNameList = [];
            this.identityAddressListFlag = true;
            this.identityAddressNameList = response.data;
            if (this.identityAddressNameList.length === 1) {
              this.signUpInvestorPersonalForm.patchValue({
                citizenshipAreaId: this.identityAddressNameList[0].area_id
              });
            }
            if (this.identityAddressNameList.length > 1) {
              this.identityAreaNamePlaceHolder = this.selectAreaText;
            }
          } else if (addressType === 'emergency') {
            this.emergencyAreaNamePlaceHolder = '';
            this.emergencyAreaNameList = [];
            this.emergencyAddressListFlag = true;
            this.emergencyAreaNameList = response.data;
            if (this.emergencyAreaNameList.length === 1) {
              this.signUpInvestorPersonalForm.patchValue({
                emergencyAreaId: this.emergencyAreaNameList[0].area_id
              });
            }
            if (this.emergencyAreaNameList.length > 1) {
              this.emergencyAreaNamePlaceHolder = this.selectAreaText;
            }
          }
          if (response.data.length === 0) {
            this._notificationService.error(this.formModel.zipCodeError);
            return;
          }
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  onCopyFromResidentialAddress(flag: any) {
    const checked = flag.checked;
    if (checked) {
      this.signUpInvestorPersonalForm.patchValue({
        citizenshipCountryId: this.signUpInvestorPersonalForm.value.residentialCountryId,
        citizenshipAddress1: this.signUpInvestorPersonalForm.value.address1,
        citizenshipZipCode: this.signUpInvestorPersonalForm.value.zipCode,
        citizenshipAreaCode: this.signUpInvestorPersonalForm.value.areaCode,
        citizenshipAreaId: this.signUpInvestorPersonalForm.value.areaId,
        citizenshipArea: this.signUpInvestorPersonalForm.value.area,
      });
    } else {
      this.signUpInvestorPersonalForm.patchValue({
        citizenshipCountryId: '',
        citizenshipAddress1: '',
        citizenshipAreaCode: '',
        citizenshipZipCode: '',
        citizenshipAreaId: '',
        citizenshipArea: ''
      });
    }
  }

  getEmergencyMobilePhoneValidation(validation: string) {
    this.formModel.signUpInvestorPersonal.emergencyMobilePhoneNumberValidation = validation;
  }

  getCompanyPhoneValidation(validation: string) {
    this.formModel.signUpInvestorBusiness.companyPhoneNumberValidation = validation;
  }

  patchEmergencyMobilePhoneNumber(phoneNumber: string) {
    if (phoneNumber) {
      this.signUpInvestorPersonalForm.patchValue({
        emergencyMobilePhoneNumber: phoneNumber
      });
    }
  }

  patchCompanyMobilePhoneNumber(phoneNumber: string) {
    if (phoneNumber) {
      this.signUpInvestorBusinessForm.patchValue({
        companyPhoneNumber: phoneNumber
      });
    }
  }

  onResidentialCountryChange() {
    this.signUpInvestorPersonalForm.patchValue({
      area: null,
      areaId: null,
      zipCode: null
    });
  }

  onIdentityCountryChange() {
    this.signUpInvestorPersonalForm.patchValue({
      citizenshipAreaId: null,
      citizenshipArea: null,
      citizenshipZipCode: null
    });
  }

  onEmergencyCountryChange() {
    this.signUpInvestorPersonalForm.patchValue({
      emergencyAreaId: null,
      emergencyArea: null,
      emergencyZipCode: null
    });
  }

  goToSubscriptionAgreement() {
    this._router.navigate(['/admin-investor/subscription-agreement']);
  }
}
