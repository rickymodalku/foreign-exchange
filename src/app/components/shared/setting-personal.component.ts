import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { FeatureFlagService } from '../../services/feature-flag.service';
import { NotificationService } from '../../services/notification.service';
import { ValidatorService } from '../../services/validator.service';
import { FormService } from '../../services/form.service';
import CONFIGURATION from '../../../configurations/configuration';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'setting-personal',
  templateUrl: './setting-personal.html'
})
export class SettingPersonalComponent implements OnInit {
  countryCode: string;
  currentStep: string;
  formModel: any;
  masterData: any;
  phonePrefix: string;
  settingPersonalForm: FormGroup;
  infoEmail: string;
  steps: Array<any>;
  enableUpdate: boolean;
  enable2FAFeatureToggle: boolean;
  featureToggle: any;
  featureFlagObservable: Observable<any>;

  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private featureFlagService: FeatureFlagService,
    private _translateService: TranslateService,
    private _validatorService: ValidatorService,
    private _formService: FormService
  ) {
    this.countryCode = CONFIGURATION.country_code;
    this.infoEmail = CONFIGURATION.infoEmail;
    this.formModel = {
      existing: null,
      settingPersonal: {
        accepted: true,
        birthDateValid: true,
        dateRestrictions: {
          investorMinimumAge: 0
        },
        error: '',
        errors: {
          birthDate: '',
          minimumBirthDate: ''
        },
        success: '',
        validation: false,
        residentialCountryId: '',
        stateId: '',
      }
    };
    this.enable2FAFeatureToggle = false;
    this.masterData = {
      countries: new Array<any>(),
      genders: new Array<any>(),
      states: new Array<any>()
    };
    this.phonePrefix = CONFIGURATION.phone_prefix;
    this.settingPersonalForm = this._formBuilder.group({
      address1: new FormControl(null, [Validators.required]),
      address2: new FormControl(null, []),
      birthDate: new FormControl(null, [Validators.required]),
      birthPlace: new FormControl(null, [Validators.required]),
      fullName: new FormControl(null, [Validators.required]),
      genderId: new FormControl(null, [Validators.required]),
      icNumber: new FormControl(null, [Validators.required]),
      taxCardNumber: new FormControl(null, []),
      mobilePhoneNumber: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern(this._validatorService.numberPattern)]),
      mobilePhonePrefix: new FormControl(this.phonePrefix, [Validators.required, Validators.pattern(this._validatorService.phonePrefixPattern)]),
      residentialCountryId: new FormControl(null, [Validators.required]),
      stateId: new FormControl(null, []),
      zipCode: new FormControl(null, [Validators.required])
    });
    if (this.countryCode === 'MY') {
      this.settingPersonalForm.addControl('district', new FormControl('', [Validators.required]));
    } else {
      this.settingPersonalForm.addControl('district', new FormControl('', []));
    }
    this.enableUpdate = false;
  }

  ngOnInit() {
    this.get2faToogle();
    const activationStepCodes = CONFIGURATION.activation_step_code;
    this.currentStep = this._authService.getActivationStepCode();
    if (this.currentStep === activationStepCodes['send_econtract']) {
      this.settingPersonalForm.controls['fullName'].enable();
      this.settingPersonalForm.controls['icNumber'].enable();
    } else {
      this._formService.disableFields(this.settingPersonalForm,
        ['fullName', 'icNumber', 'birthPlace', 'mobilePhoneNumber',
          'mobilePhonePrefix', 'birthDate', 'genderId', 'address1',
          'address2', 'residentialCountryId', 'stateId', 'zipCode',
          'district', 'taxCardNumber'
        ]);
    }

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
          this.masterData.genders = masterData.genders;
        },
        error => {
          this._notificationService.error();
        }
      );

    this._memberService
      .getMemberDetail()
      .subscribe(
        member => {
          this.formModel.existing = member;
          this.formModel.existing.mobilePhoneNumber = this.formModel.existing.mobilePhoneNumber.replace(this._validatorService.spaceRegex, '');

          this.settingPersonalForm.patchValue({
            address1: this.formModel.existing.address1,
            address2: this.formModel.existing.address2,
            birthPlace: this.formModel.existing.birthPlace,
            fullName: this.formModel.existing.firstName,
            icNumber: this.formModel.existing.icNumber,
            taxCardNumber: this.formModel.existing.taxCardNumber,
            genderId: this.formModel.existing.genderId,
            mobilePhoneNumber: this.formModel.existing.mobilePhoneNumber.indexOf('+') === 0 ? this.formModel.existing.mobilePhoneNumber.substring(3, this.formModel.existing.mobilePhoneNumber.length) : this.formModel.existing.mobilePhoneNumber,
            mobilePhonePrefix: this.formModel.existing.mobilePhoneNumber.indexOf('+') === 0 ? this.formModel.existing.mobilePhoneNumber.substring(0, 3) : CONFIGURATION.phone_prefix,
            residentialCountryId: this.formModel.existing.residentialCountryId,
            zipCode: this.formModel.existing.zipCode
          });
          this.onResidentialCountryChange(this.formModel.existing.residentialCountryId, this.formModel.existing.stateId);
          this.onResidentialStateChange(this.formModel.existing.stateId, this.formModel.existing.district);
          if (this.formModel.existing.taxCardNumber) {
            this._formService.disableFields(this.settingPersonalForm, ['taxCardNumber']);
          }
          if (this.formModel.existing.birthDate) {
            this.settingPersonalForm.patchValue({
              birthDate: new Date(this.formModel.existing.birthDate),
            });
          }
        },
        error => {
          this._notificationService.error();
        }
      );

    this._translateService
      .get('form.setting-personal')
      .subscribe(
        personal => {
          this.formModel.settingPersonal.error = personal.error;
          this.formModel.settingPersonal.errors.birthDate = personal.errors['birth-date'];
          this.formModel.settingPersonal.errors.minimumBirthDate = personal.errors['minimum-birth-date'];
          this.formModel.settingPersonal.success = personal.success;
        }
      );

    this._translateService
      .get('master.date-restrictions')
      .subscribe(
        dateRestrictions => {
          this.formModel.settingPersonal.dateRestrictions.investorMinimumAge = dateRestrictions['investor-minimum-age'];
        }
      );
  }

  onBirthDateChange(showNotification: boolean): void {
    this.formModel.settingPersonal.birthDateValid = (
      this.settingPersonalForm.value.birthDate !== null &&
      this.settingPersonalForm.value.birthDate !== ""
    );
    if (this.formModel.settingPersonal.birthDateValid) {
      var today = new Date();
      var comparator = new Date(this.settingPersonalForm.value.birthDate);
      var timeDiff = today.getTime() - comparator.getTime();
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (diffDays <= 0) {
        this.formModel.settingPersonal.birthDateValid = false;
        if (showNotification) {
          this._notificationService.error(this.formModel.settingPersonal.errors.birthDate);
        }
      } else if (diffDays < 365.25 * this.formModel.settingPersonal.dateRestrictions.investorMinimumAge) {
        this.formModel.settingPersonal.birthDateValid = false;
        if (showNotification) {
          this._notificationService.error(this.formModel.settingPersonal.errors.minimumBirthDate);
        }
      }
    }
  }

  onSettingPersonalFormSubmit(): void {
    this.formModel.settingPersonal.validation = true;
    let settingPersonalValid = this.settingPersonalForm.valid;

    // Birth Date Validation
    this.onBirthDateChange(true);
    settingPersonalValid = settingPersonalValid && this.formModel.settingPersonal.birthDateValid;

    let settingPersonalConfiguration = {
      address1: this.settingPersonalForm.value.address1,
      address2: this.settingPersonalForm.value.address2,
      birthDate: this.settingPersonalForm.getRawValue().birthDate,
      birthPlace: this.settingPersonalForm.getRawValue().birthPlace,
      district: this.settingPersonalForm.value.district,
      taxCardNumber: this.settingPersonalForm.getRawValue().taxCardNumber,
      firstName: this.settingPersonalForm.getRawValue().fullName,
      genderId: this.settingPersonalForm.getRawValue().genderId,
      mobilePhoneNumber: this.settingPersonalForm.getRawValue().mobilePhonePrefix + this.settingPersonalForm.getRawValue().mobilePhoneNumber,
      residentialCountryId: this.settingPersonalForm.value.residentialCountryId,
      stateId: this.settingPersonalForm.value.stateId,
      zipCode: this.settingPersonalForm.value.zipCode,
    };
    if (this.settingPersonalForm.value.taxCardNumber) {
      this._formService.disableFields(this.settingPersonalForm, ['taxCardNumber']);
    }
    const activationStepCodes = CONFIGURATION.activation_step_code;
    // Only only the user to change their IC at send econtract step
    if (this.currentStep === activationStepCodes['send_econtract']) {
      settingPersonalConfiguration = Object.assign(settingPersonalConfiguration, {
        icNumber: this.settingPersonalForm.value.icNumber
      });
    }

    if (settingPersonalValid) {
      this._memberService
        .updateMember(
          settingPersonalConfiguration
        )
        .subscribe(
          response => {
            if (response.status === 'success') {
              this.formModel.settingPersonal.validation = false;
              this._notificationService.success(this.formModel.settingPersonal.success);
            } else {
              this._notificationService.error(response.message);
            }
          },
          error => {
            this._notificationService.error();
          }
        );
    }
  }

  onResidentialCountryChange(countryCode: string, stateId: number = null): void {
    if (countryCode) {
      this.settingPersonalForm.patchValue({
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
              this.settingPersonalForm.patchValue({
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
      this.settingPersonalForm.patchValue({
        district: district
      });
    }
  }

  get2faToogle() {
    // Feature toggle for 2fa login
    const { twoFa } = this.featureFlagService.getFeatureFlagKeys();
    this.featureFlagObservable = this.featureFlagService.getFeatureFlagObservable();
    this.featureFlagObservable.subscribe((flags) => {
      this.enable2FAFeatureToggle = flags[twoFa];
    });
  }

  onPhoneNumberChanged(phoneNumber: string) {
    this.settingPersonalForm.patchValue({
      mobilePhoneNumber: phoneNumber.indexOf('+') === 0 ? phoneNumber.substring(3, phoneNumber.length) : phoneNumber,
      mobilePhonePrefix: phoneNumber.indexOf('+') === 0 ? phoneNumber.substring(0, 3) : CONFIGURATION.phone_prefix
    });
  }
}
