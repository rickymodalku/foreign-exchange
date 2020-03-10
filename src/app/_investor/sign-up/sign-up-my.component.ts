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
import { UtilityService } from '../../services/utility.service';
import { FormService } from '../../services/form.service';
import { EventService } from '../../services/event.service';
import { ENVIRONMENT } from '../../../environments/environment';
import CONFIGURATION from '../../../configurations/configuration';

enum InvestorOnBoardSteps {
  personal = 1,
  documentUpload = 2,
  completed = 3
}
@Component({
  selector: 'app-sign-up-form-investor-my',
  templateUrl: './sign-up-my.html'
})
export class SignupFormInvestorMYComponent implements OnInit {
  countryCode: string;
  currentStep: number;
  formModel: any;
  masterData: any;
  memberId: string;
  signUpInvestorPersonalForm: FormGroup;
  steps: Array<any>;
  twoFaOptions: any;
  CONFIGURATION: any;
  lastStepIndex: number;
  isInvestorOnboardingCompleted: boolean;
  investorMemberTypeCode: string;

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
        citizenshipCountryId: '',
        citizenshipValid: true,
        dateRestrictions: {
          investorMinimumAge: 0,
          passportExpiry: 0
        },
        error: '',
        errors: {
          birthDate: '',
          minimumBirthDate: ''
        },
        genderId: '',
        passportValid: true,
        passportExpiryDateValid: true,
        residentialCountryId: '',
        success: '',
        stateId: '',
        validation: false
      }
    };
    this.memberId = '';
    this.masterData = {
      countries: new Array<any>(),
      genders: new Array<any>(),
      states: new Array<any>()
    };
    this.signUpInvestorPersonalForm = this._formBuilder.group({
      address1: new FormControl(null, [Validators.required]),
      address2: new FormControl(null, []),
      birthDate: new FormControl(null, [Validators.required]),
      citizenshipCountryId: new FormControl(null, [Validators.required]),
      district: new FormControl(null, [Validators.required]),
      genderId: new FormControl(null, [Validators.required]),
      icNumber: new FormControl(null, [Validators.pattern(this._validatorService.numberPattern)]),
      passportExpiryDate: new FormControl(null, []),
      passportNumber: new FormControl(null, []),
      residentialCountryId: new FormControl(null, [Validators.required]),
      stateId: new FormControl(null, []),
      zipCode: new FormControl(null, [Validators.required])
    });
    this.steps = this._baseParameterService.getInvestorOnboardingStep();
    this.twoFaOptions = {};
    this.lastStepIndex = 0;
    this.isInvestorOnboardingCompleted = false;
    this.investorMemberTypeCode = CONFIGURATION.member_type_code.investor;
  }

  ngOnInit() {
    this.lastStepIndex = Math.max.apply(Math, this.steps.map(function (o) { return o.index; }));
    this.initialize();
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
                            documentValue['type'] === 'PASSPORT' ?
                              this.formModel.signUpInvestorDocument.needPassport :
                              !this.formModel.signUpInvestorDocument.needPassport
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

                  }
                );

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

  kickOut(): void {
    this._authService.logOut();
    this._router.navigate(['/log-in']);
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
        ` ${document.label}
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
      (this.signUpInvestorPersonalForm.value.icNumber === null || this.signUpInvestorPersonalForm.value.icNumber === "") &&
      (this.signUpInvestorPersonalForm.value.passportNumber === null || this.signUpInvestorPersonalForm.value.passportNumber === "")
    );
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

  onSignUpInvestorPersonalFormAccept(event: any): void {
    this.formModel.signUpInvestorPersonal.accepted = event.checked;
  }

  onSignUpInvestorPersonalFormSubmit(): void {
    this.formModel.signUpInvestorPersonal.validation = true;
    let signUpInvestorPersonalValid = this.signUpInvestorPersonalForm.valid;

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

    if (signUpInvestorPersonalValid) {
      const body = {
        address1: this.signUpInvestorPersonalForm.value.address1,
        address2: this.signUpInvestorPersonalForm.value.address2,
        birthDate: this._utilityService.stripTimeZoneFromDate(this.signUpInvestorPersonalForm.value.birthDate),
        countryId: CONFIGURATION.country_code,
        citizenshipCountryId: this.signUpInvestorPersonalForm.value.citizenshipCountryId,
        district: this.signUpInvestorPersonalForm.value.district,
        genderId: this.signUpInvestorPersonalForm.value.genderId,
        icNumber: this.signUpInvestorPersonalForm.value.icNumber,
        passportExpiryDate: this._utilityService.stripTimeZoneFromDate(this.signUpInvestorPersonalForm.value.passportExpiryDate),
        passportNumber: this.signUpInvestorPersonalForm.value.passportNumber,
        residentialCountryId: this.signUpInvestorPersonalForm.value.residentialCountryId,
        stateId: this.signUpInvestorPersonalForm.value.stateId,
        zipCode: this.signUpInvestorPersonalForm.value.zipCode,
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

  onResidentialCountryChange(countryCode: string, stateId: number = null): void {
    if (countryCode) {
      this.signUpInvestorPersonalForm.patchValue({
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
              this.formModel.signUpInvestorPersonal.stateId = stateId;
              this.signUpInvestorPersonalForm.patchValue({
                stateId: stateId
              });
            }
          });
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
              document.message = this._domSanitizer.sanitize(SecurityContext.HTML,
                `<span class="upload-label">${document.label}</span>
                  <br>
                  <span class="upload-btn-description">
                    ${this.formModel.signUpInvestorDocument.placeholder.dragDrop}
                  </span>
                  <a class="link">${this.formModel.signUpInvestorDocument.placeholder.browseFiles}</a>
                `);
            }
          }
        );
      });
  }

  prefillSignUpInvestorPersonalForm(): void {
    this.signUpInvestorPersonalForm.patchValue({
      address1: this.formModel.existing.address1,
      address2: this.formModel.existing.address2,
      citizenshipCountryId: this.formModel.existing.citizenshipCountryId,
      genderId: this.formModel.existing.genderId,
      icNumber: this.formModel.existing.icNumber,
      passportNumber: this.formModel.existing.passportNumber,
      residentialCountryId: this.formModel.existing.residentialCountryId,
      zipCode: this.formModel.existing.zipCode
    });

    this.formModel.signUpInvestorPersonal.genderId = this.formModel.existing.genderId;
    this.formModel.signUpInvestorPersonal.citizenshipCountryId = this.formModel.existing.citizenshipCountryId;
    this.formModel.signUpInvestorPersonal.residentialCountryId = this.formModel.existing.residentialCountryId;
    this.formModel.signUpInvestorPersonal.stateId = this.formModel.existing.stateId;

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
          document.type === 'PASSPORT' ?
            this.formModel.signUpInvestorDocument.needPassport :
            !this.formModel.signUpInvestorDocument.needPassport
        );
      });
  }

  goToSubscriptionAgreement() {
    this._router.navigate(['/admin-investor/subscription-agreement']);
  }

}
