
import { forkJoin as observableForkJoin, Subject, Observable } from 'rxjs';

import { debounceTime } from 'rxjs/operators';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UtilityService } from '../../services/utility.service';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import { DocumentService } from '../../services/document.service';
import { TranslateService } from '@ngx-translate/core';
import CONFIGURATION from '../../../configurations/configuration';
import { BaseParameterService } from '../../services/base-parameter.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ValidatorService } from '../../services/validator.service';
import { SubscriptionAgreementTemplate } from '../../models/member.class';
import { ModalService } from 'app/services/modal.service';
import { Router } from '@angular/router';
import { FormService } from '../../services/form.service';
import { DomSanitizer } from '@angular/platform-browser';

enum rdnRegistrationSteps {
  personal = 0,
  emergencyContact = 1,
  sourceOfWealth = 2,
  completed = 9999
};

@Component({
  selector: 'rdn-activation',
  templateUrl: './rdn-activation.html'
})
export class RdnActivationComponent implements OnInit {
  identityAddressZipCodeArea: any;
  residentialAddressZipCodeArea: any;
  emergencyAddressZipCodeArea: any;
  companyAddressZipCodeArea: any;
  countryCode: string;
  memberDetail: any;
  memberTypeCodes: any;
  referralModel: any;
  rdnRegistrationForm: FormGroup;
  masterData: any;
  currentStep: number;
  steps = new Array<any>();
  identityAddressSubject: Subject<string> = new Subject();
  residentialAddressSubject: Subject<string> = new Subject();
  emergencyAddressSubject: Subject<string> = new Subject();
  companyAddressSubject: Subject<string> = new Subject();
  residentialAddressList: any;
  residentialAddressListFlag: boolean;
  identityAddressList: any;
  identityAddressListFlag: boolean;
  emergencyAddressList: any;
  emergencyAddressListFlag: boolean;
  companyAddressList: any;
  companyAddressListFlag: boolean;
  icType: string;
  selectedIdentityAreaId: string;
  selectedResidentialAreaId: string;
  selectedEmergencyAreaId: string;
  selectedCompanyAreaId: string;
  showValidation: boolean;
  sourceOfWealthDetail: any;
  sourceOfWealthList: any;
  residentialAddressDetail: any;
  subscriptionAgreementTemplates: Array<SubscriptionAgreementTemplate>;
  companyAddressFlag: boolean;
  copyResidentialAddress: boolean;
  formModel: any;
  employmentStatusId: number;
  entrepenuerStatusId: number;
  toggleMessage: any;
  errorMessage: any;
  showResidentialAddressList: boolean;
  showIdentityAddressList: boolean;
  showEmergencyAddressList: boolean;
  showCompanyAddressList: boolean;
  passportExpiredMonthLimit: number;
  docDetail: any;
  isLocalInvestor: boolean;
  isEmergencyLocalAddress: boolean;
  isCompanyLocalAddress: boolean;
  companyAddressDetail: any;
  isDisabledCompanyZipArea: boolean;

  constructor(
    private _authService: AuthService,
    private _domSanitizer: DomSanitizer,
    private _formBuilder: FormBuilder,
    private _formService: FormService,
    private _validatorService: ValidatorService,
    private _memberService: MemberService,
    private _modalService: ModalService,
    private _router: Router,
    private _baseParameterService: BaseParameterService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _documentService: DocumentService,
    private _translateService: TranslateService, ) {
    this.identityAddressSubject.pipe(debounceTime(750)).subscribe(searchTextValue => {
      const addressType = 'identity';
      if (searchTextValue.trim()) {
        this.getAddressLocation(searchTextValue, addressType);
      }
    });
    this.residentialAddressSubject.pipe(debounceTime(750)).subscribe(searchTextValue => {
      const addressType = 'residential';
      if (searchTextValue.trim()) {
        this.getAddressLocation(searchTextValue, addressType);
      }
    });
    this.emergencyAddressSubject.pipe(debounceTime(750)).subscribe(searchTextValue => {
      const addressType = 'emergency';
      if (searchTextValue.trim()) {
        this.getAddressLocation(searchTextValue, addressType);
      }
    });
    this.companyAddressSubject.pipe(debounceTime(750)).subscribe(searchTextValue => {
      const addressType = 'company';
      if (searchTextValue.trim()) {
        this.getAddressLocation(searchTextValue, addressType);
      }
    });
    this.currentStep = 1;
    this.masterData = {
      countries: new Array<any>(),
      degree: new Array<any>(),
      religion: new Array<any>(),
      maritalStatus: new Array<any>(),
      employmentPeriods: new Array<any>(),
      employmentStatuses: new Array<any>(),
      jobCategories: new Array<any>(),
      genders: new Array<any>(),
      banks: new Array<any>(),
      icType: new Array<any>(),
      monthlyIncome: new Array<any>()
    };

    this.formModel = {
      signUpInvestorDocument: {
        configuration: this._baseParameterService.getDocumentUploadingConfig(),
      },
      passportExpiryDateValid: true,
      passportExpiryDateErrorMessage: '',
    };

    this.sourceOfWealthList = {
      inheritance: false,
      gift: false,
      asset: false,
      other: false
    };
    this.sourceOfWealthDetail = {
      inheritanceAmount: '',
      inheritanceLineage: '',
      giftGiver: '',
      giftReason: '',
      giftAmount: '',
      assetDescription: '',
      assetAmount: '',
      otherDescription: '',
      otherAmount: ''
    };
    this.steps = [
      { index: 1, key: 0, label: 'Personal information' },
      { index: 2, key: 1, label: 'Emergency Contact' },
      { index: 3, key: 2, label: 'Source of wealth' },
      { index: 4, key: 9999, label: 'Completed' }
    ];
    this.rdnRegistrationForm = this._formBuilder.group({
      motherMaidenName: new FormControl(null, [Validators.required]),
      birthPlace: new FormControl(null, [Validators.required]),
      religion: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      maritalStatusId: new FormControl(null, [Validators.required]),
      education: new FormControl(null, [Validators.required]),
      residentialAddress: new FormControl([Validators.required]),
      residentialAreaId: new FormControl(null, [Validators.required]),
      residentialCountryId: new FormControl(null, [Validators.required]),
      residentialAreaCode: new FormControl(null, []),
      residentialAreaName: new FormControl(null, []),
      zipCodeArea: new FormControl(null, [Validators.required]),
      selectedArea: new FormControl(null, [Validators.required]),
      identityType: new FormControl(null, [Validators.required]),
      identityNumber: new FormControl(null, [Validators.required]),
      identityAddress: new FormControl(null, [Validators.required]),
      identityCountryId: new FormControl(null, [Validators.required]),
      identityAddressAreaCode: new FormControl(null, []),
      identityAddressAreaName: new FormControl(null, []),
      emergencyFullname: new FormControl(null, [Validators.required]),
      emergencyRelationship: new FormControl(null, [Validators.required]),
      emergencyContactNumber: new FormControl(null, [Validators.required, Validators.pattern(this._validatorService.numberPattern)]),
      emergencyCountryId: new FormControl(null, [Validators.required]),
      emergencyAddress: new FormControl(null, [Validators.required]),
      emergencyAreaCode: new FormControl(null, []),
      emergencyAreaName: new FormControl(null, []),
      employmentStatus: new FormControl(null, [Validators.required]),
      taxCardNumber: new FormControl(null, []),
      employmentCompanyName: new FormControl(null, []),
      employmentJobTitle: new FormControl(null, []),
      employmentDuration: new FormControl(null, []),
      employmentAnnualIncome: new FormControl(null, []),
      companyCountryId: new FormControl(null, []),
      companyAreaCode: new FormControl(null, []),
      companyAreaName: new FormControl(null, []),
      companyAddress: new FormControl(null, []),
      companyZipCodeArea: new FormControl(null, []),
      passportNumber: new FormControl(null, []),
      passportExpiryDate: new FormControl(null, []),
    });
    this.residentialAddressListFlag = false;
    this.residentialAddressList = [];
    this.identityAddressListFlag = false;
    this.identityAddressList = [];
    this.emergencyAddressListFlag = false;
    this.emergencyAddressList = [];
    this.companyAddressListFlag = false;
    this.companyAddressList = [];
    this.icType = '';
    this.selectedIdentityAreaId = '';
    this.selectedResidentialAreaId = '';
    this.showValidation = false;
    this.identityAddressZipCodeArea = '';
    this.emergencyAddressZipCodeArea = '';
    this.companyAddressZipCodeArea = '';
    this.subscriptionAgreementTemplates = new Array<SubscriptionAgreementTemplate>();
    this.companyAddressFlag = false;
    this.copyResidentialAddress = false;
    this.showResidentialAddressList = true;
    this.showIdentityAddressList = true;
    this.showEmergencyAddressList = true;
    this.showCompanyAddressList = true;
    this.passportExpiredMonthLimit = CONFIGURATION.passportExpiredMonthLimit;
    this.docDetail = {
      npwp:
      {
        label: 'NPWP',
        type: 'NPWP',
        uploaded: false,
        placeholder: {
          upload: '',
          uploaded: ''
        },
        error: '',
        success: '',
      }
      ,
      kitas:
      {
        label: 'KITAS',
        type: 'KITAS',
        uploaded: false,
        placeholder: {
          upload: '',
          uploaded: ''
        },
        error: '',
        success: '',
      }
      ,
      passport:
      {
        label: 'Paspor',
        type: 'Passport',
        uploaded: false,
        placeholder: {
          upload: '',
          uploaded: ''
        },
        error: '',
        success: '',
      }
      ,
    };


    this.toggleMessage = {
      yes: '',
      no: ''
    };
    this.errorMessage = {
      inheritanceDetail: '',
      giftDetail: '',
      assetDetail: '',
      otherDetail: '',
      AllFieldRequired: '',
      uploadTaxCardPhoto: '',
      uploadPassportPhoto: '',
      uploadKitasPhoto: '',
      residentialZipCodeValid: '',
      residentialAreaSelect: '',
      identityZipCodeValid: '',
      identityAreaSelect: '',
      emergencyZipCodeValid: '',
      emergencyAreaSelect: '',
      companZipCodeValid: '',
      companyAreaSelect: '',
      sourceOfWealth: '',
      emergencyAreaName: '',
      identityAreaName: '',
      residentialAreaName: ''
    };
    this.isLocalInvestor = false;
    this.isEmergencyLocalAddress = false;
    this.isCompanyLocalAddress = false;
    this.isDisabledCompanyZipArea = false;
  }

  ngOnInit() {
    this.countryCode = CONFIGURATION.country_code;
    this.employmentStatusId = this._baseParameterService.getEmploymentStatuses().find(o => o.label === 'Karyawan').id;
    this.entrepenuerStatusId = this._baseParameterService.getEmploymentStatuses().find(o => o.label === 'Wiraswasta').id;
    this.getMemberDetail();
    this.getLookUpData();
    this.getTranslation();
  }

  getTranslation() {
    this._translateService
      .get('investor-dashboard.rdn-information.error')
      .subscribe(
        error => {
          this.errorMessage = {
            inheritanceDetail: error['inheritance-detail'],
            giftDetail: error['gift-detail'],
            assetDetail: error['asset-detail'],
            otherDetail: error['other-detail'],
            AllFieldRequired: error['required-field'],
            uploadTaxCardPhoto: error['tax-card-number'],
            uploadKitasPhoto: error['kitas-photo'],
            uploadPassportPhoto: error['passport-photo'],
            residentialZipCodeValid: error['esidential-valid-zip-code'],
            residentialAreaSelect: error['residential-address-area-select'],
            identityZipCodeValid: error['identity-valid-zip-code'],
            identityAreaSelect: error['identity-address-area-select'],
            emergencyZipCodeValid: error['emergency-valid-zip-code'],
            emergencyAreaSelect: error['emergency-address-area-select'],
            companZipCodeValid: error['company-valid-zip-code'],
            companyAreaSelect: error['company-address-area-select'],
            sourceOfWealth: error['source-of-wealth'],
            emergencyAreaName: error['emergency-area-name'],
            identityAreaName: error['identity-area-name'],
            residentialAreaName: error['residential-area-name']
          };
        }
      );
    this._translateService
      .get('investor-dashboard.rdn-information.form')
      .subscribe(
        toggle => {
          this.toggleMessage = {
            yes: toggle['yes'],
            no: toggle['no']
          };
        }
      );

    this._translateService
      .get('form.onboarding-investor.personal')
      .subscribe(
        personal => {
          this.formModel.passportExpiryDateErrorMessage = personal.errors['passport-expiry-date'];
        }
      );
  }


  getSubscriptionAgreementTemplate() {
    this._memberService
      .getSubscriptionAgreementTemplates()
      .subscribe(
        subscriptionAgreementTemplates => {
          this.subscriptionAgreementTemplates = subscriptionAgreementTemplates;
        },
        error => {
          this._notificationService.error(error);
        }
      );
  }

  getMemberDetail() {
    this._memberService.getMemberDetail()
      .subscribe(
        memberDetail => {
          this.memberDetail = memberDetail;
          this.getSubscriptionAgreementTemplate();
          this.rdnRegistrationForm.patchValue({
            motherMaidenName: memberDetail.motherMaidenName,
            gender: memberDetail.genderId,
            birthPlace: memberDetail.birthPlace,
            religion: memberDetail.religionCode,
            maritalStatusId: memberDetail.maritalStatusId,
            education: memberDetail.degreeCode,
            residentialAddress: memberDetail.address1,
            residentialCountryId: memberDetail.residentialCountryId,
            residentialAreaName: memberDetail.area,
            identityAddress: memberDetail.citizenshipAddress1,
            identityAddressAreaCode: memberDetail.citizenshipAreaCode,
            identityAddressAreaName: memberDetail.citizenshipArea,
            emergencyRelationship: memberDetail.emergencyRelationship,
            emergencyFullname: memberDetail.emergencyFullname,
            emergencyContactNumber: memberDetail.emergencyMobilePhoneNumber,
            emergencyAddress: memberDetail.emergencyAddress1,
            emergencyAreaCode: memberDetail.emergencyAreaCode,
            residentialAreaCode: memberDetail.areaCode,
            zipCodeArea: memberDetail.zipCode,
            identityType: Number(memberDetail.icTypeId),
            identityNumber: memberDetail.icNumber,
            taxCardNumber: memberDetail.taxCardNumber,
            emergencyCountryId: memberDetail.emergencyCountryId || this.countryCode,
            companyCountryId: memberDetail.companyCountryId || this.countryCode,
            identityCountryId: memberDetail.citizenshipCountryId,
            passportNumber: memberDetail.passportNumber,
            passportExpiryDate: new Date(memberDetail.passportExpiryDate),
          });

          this.icType = this._baseParameterService.getICType().find(o => o.id === Number(memberDetail.icTypeId)).name;
          this.residentialAddressZipCodeArea = memberDetail.zipCode;
          this.identityAddressZipCodeArea = memberDetail.citizenshipZipCode;
          this.emergencyAddressZipCodeArea = memberDetail.emergencyZipCode;
          this.selectedResidentialAreaId = memberDetail.areaId;
          this.selectedIdentityAreaId = memberDetail.citizenshipAreaId;
          this.selectedEmergencyAreaId = memberDetail.emergencyAreaId;
          this.selectedEmergencyAreaId = memberDetail.emergencyAreaId;
          if (this.residentialAddressZipCodeArea && this.residentialAddressZipCodeArea.trim()) {
            this.selectedEmergencyAreaId = memberDetail.emergencyAreaId;
            this.getAddressLocation(this.residentialAddressZipCodeArea, 'residential');
          }
          if (this.identityAddressZipCodeArea && this.identityAddressZipCodeArea.trim()) {
            this.getAddressLocation(this.identityAddressZipCodeArea, 'identity');
          }
          if (this.emergencyAddressZipCodeArea && this.emergencyAddressZipCodeArea.trim()) {
            this.getAddressLocation(this.emergencyAddressZipCodeArea, 'emergency');
          }
          this.getUploadedDocument();
          this.onResidentialCountryChange(true);
          this.onIdentityCountryChange(true);
        },
        error => {
          this._notificationService.error();
        });
  }

  getUploadedDocument() {
    observableForkJoin(
      this._documentService.getUploadedDocument(this.docDetail.npwp.type),
      this._documentService.getUploadedDocument(this.docDetail.kitas.type),
      this._documentService.getUploadedDocument(this.docDetail.passport.type)
    ).subscribe(responses => {
      const uploadedDoc = responses;
      if (uploadedDoc[0].results.length > 0) {
        this.docDetail.npwp.uploaded = true;
        this.updateDropZoneSuccessMessage(this.docDetail.npwp.type);
      }
      if (uploadedDoc[1].results.length > 0) {
        this.docDetail.kitas.uploaded = true;
        this.updateDropZoneSuccessMessage(this.docDetail.kitas.type);
      }
      if (uploadedDoc[2].results.length > 0) {
        this.docDetail.passport.uploaded = true;
        this.updateDropZoneSuccessMessage(this.docDetail.passport.type);
      }
    }, error => {
      this._notificationService.error();
    });
  }

  patchInvestorFormValue(subscriptionAgreementTemplates: object, label: string, value: any, valueType: string): object {
    const patchedSubscriptAgreementTemplate = Object.create(subscriptionAgreementTemplates);
    const patchInvestorFormValue = patchedSubscriptAgreementTemplate.find(element => {
      return element.label === label;
    });
    if (patchInvestorFormValue) {
      if (valueType === 'string') {
        patchInvestorFormValue.valueString = value;
      }
      if (valueType === 'boolean') {
        patchInvestorFormValue.valueBoolean = Boolean(value);
      }
    }
    return patchInvestorFormValue;
  };

  residentialAddressKeyUpEvent(text: string) {
    if (this.showResidentialAddressList) {
      this.residentialAddressSubject.next(text);
    }
  }

  identityAddressKeyUpEvent(text: string) {
    if (this.showIdentityAddressList) {
      this.identityAddressSubject.next(text);
    }
  }

  emergencyAddressKeyUpEvent(text: string) {
    if (this.showEmergencyAddressList) {
      this.emergencyAddressSubject.next(text);
    }
  }

  companyAddressKeyUpEvent(text: string) {
    if (this.showCompanyAddressList) {
      this.companyAddressSubject.next(text);
    }
  }

  onRDNRegistrationFormSubmit() {
    const defaultBank = this.memberDetail.memberBankAccounts.find(x => x.isDefault === true);
    const body = {
      motherMaidenName: this.rdnRegistrationForm.controls.motherMaidenName.value,
      birthPlace: this.rdnRegistrationForm.controls.birthPlace.value,
      religionCode: this.rdnRegistrationForm.controls.religion.value,
      maritalStatusId: this.rdnRegistrationForm.controls.maritalStatusId.value,
      degreeCode: this.rdnRegistrationForm.controls.education.value,
      genderId: this.rdnRegistrationForm.controls.gender.value,
      icTypeId: this.rdnRegistrationForm.controls.identityType.value,
      icNumber: this.rdnRegistrationForm.controls.identityNumber.value,
      taxCardNumber: this.rdnRegistrationForm.controls.taxCardNumber.value,
      citizenshipAreaId: this.selectedIdentityAreaId ? this.selectedIdentityAreaId : null,
      citizenshipZipCode: this.identityAddressZipCodeArea,
      citizenshipAddress1: this.rdnRegistrationForm.controls.identityAddress.value,
      citizenshipAreaCode: this.rdnRegistrationForm.controls.identityAddressAreaCode.value,
      citizenshipArea: this.rdnRegistrationForm.controls.identityAddressAreaName.value,
      citizenshipCountryCode: this.rdnRegistrationForm.controls.identityCountryId.value,
      areaId: this.selectedResidentialAreaId ? this.selectedResidentialAreaId : null,
      area: this.rdnRegistrationForm.controls.residentialAreaName.value,
      residentialCountryId: this.rdnRegistrationForm.controls.residentialCountryId.value,
      zipCode: this.residentialAddressZipCodeArea,
      address1: this.rdnRegistrationForm.controls.residentialAddress.value,
      areaCode: this.rdnRegistrationForm.controls.residentialAreaCode.value,
      emergencyFullname: this.rdnRegistrationForm.controls.emergencyFullname.value,
      emergencyRelationship: this.rdnRegistrationForm.controls.emergencyRelationship.value,
      emergencyMobilePhoneNumber: this.rdnRegistrationForm.controls.emergencyContactNumber.value,
      emergencyCountryId: this.rdnRegistrationForm.controls.emergencyCountryId.value,
      emergencyAddress1: this.rdnRegistrationForm.controls.emergencyAddress.value,
      emergencyAreaCode: this.rdnRegistrationForm.controls.emergencyAreaCode.value,
      emergencyAreaId: this.selectedEmergencyAreaId ? this.selectedEmergencyAreaId : null,
      emergencyArea: this.rdnRegistrationForm.controls.emergencyAreaName.value,
      emergencyZipCode: this.emergencyAddressZipCodeArea,
      passportNumber: this.rdnRegistrationForm.controls.passportNumber.value,
      passportExpiryDate: this.rdnRegistrationForm.controls.passportExpiryDate.value,
    };

    if (this.residentialAddressList.length > 0) {
      this.residentialAddressDetail = this.residentialAddressList.find(o => o.area_id === this.selectedResidentialAreaId);
    }

    const investorRDNDetailTemplateMapping = {
      investorMotherMaidenName: {
        templateLabel: 'Mother\'s Maiden Name',
        value: this.rdnRegistrationForm.controls.motherMaidenName.value,
        valueType: 'string'
      },
      investorBirthPlace: {
        templateLabel: 'Place of Birth',
        value: this.rdnRegistrationForm.controls.birthPlace.value,
        valueType: 'string'
      },
      investorTaxCardNumber: {
        templateLabel: 'Tax Card Number',
        value: this.rdnRegistrationForm.controls.taxCardNumber.value,
        valueType: 'string'
      },
      investorReligion: {
        templateLabel: 'Religion',
        value: this.masterData.religion.find(o => o.code === this.rdnRegistrationForm.controls.religion.value).name,
        valueType: 'string'
      },
      investorDegree: {
        templateLabel: 'Degree',
        value: this.masterData.degree.find(o => o.code === this.rdnRegistrationForm.controls.education.value).name,
        valueType: 'string'
      },
      investorResidentialAreaName: {
        templateLabel: 'Residential Area',
        value: this.isLocalInvestor ? this.residentialAddressDetail.area_name : this.rdnRegistrationForm.controls.residentialAreaName.value,
        valueType: 'string'
      },
      investorResidentialCityName: {
        templateLabel: 'Residential City',
        value: this.isLocalInvestor ? this.residentialAddressDetail.city_name : '',
        valueType: 'string'
      },
      investorResidentialDistrictName: {
        templateLabel: 'Residential District',
        value: this.isLocalInvestor ? this.residentialAddressDetail.district_name : '',
        valueType: 'string'
      },
      investorResidentialProvinceName: {
        templateLabel: 'Residential Province',
        value: this.isLocalInvestor ? this.residentialAddressDetail.province_name : '',
        valueType: 'string'
      },
      investorResidentialZipCode: {
        templateLabel: 'Residential Zip Code',
        value: this.isLocalInvestor ? this.residentialAddressDetail.zip_code : this.residentialAddressZipCodeArea,
        valueType: 'string'
      },
      investorResidentialAreaCode: {
        templateLabel: 'Residential Area Code',
        value: this.rdnRegistrationForm.controls.residentialAreaCode.value,
        valueType: 'string'
      },
      investorEmployeeStatus: {
        templateLabel: 'Employment Status',
        value: this.rdnRegistrationForm.controls.employmentStatus.value,
        valueType: 'string'
      },
      investorEmploymentCompanyName: {
        templateLabel: 'Employment Job Category',
        value: this.rdnRegistrationForm.controls.employmentCompanyName.value,
        valueType: 'string'
      },
      investorEmploymentJobTitle: {
        templateLabel: 'Employment Title',
        value: this.rdnRegistrationForm.controls.employmentJobTitle.value,
        valueType: 'string'
      },
      investorEmploymentDuration: {
        templateLabel: 'Employment Period',
        value: this.rdnRegistrationForm.controls.employmentDuration.value,
        valueType: 'string'
      },
      investorEmploymentAnnualIncome: {
        templateLabel: 'Employment Annual Income',
        value: this.rdnRegistrationForm.controls.employmentAnnualIncome.value,
        valueType: 'string'
      },
      investorFromInheritance: {
        templateLabel: 'From Inheritance',
        value: this.sourceOfWealthList.inheritance,
        valueType: 'boolean'
      },
      investorInheritanceLineage: {
        templateLabel: 'Inheritance Lineage',
        value: this.sourceOfWealthDetail.inheritanceLineage,
        valueType: 'string'
      },
      investorInheritanceAmount: {
        templateLabel: 'Inheritance Amount',
        value: this.sourceOfWealthDetail.inheritanceAmount,
        valueType: 'string'
      },
      investorFromGift: {
        templateLabel: 'From Gift',
        value: this.sourceOfWealthList.gift,
        valueType: 'boolean'
      },
      investorGiftGiver: {
        templateLabel: 'Gift Giver',
        value: this.sourceOfWealthDetail.giftGiver,
        valueType: 'string'
      },
      investorGiftReason: {
        templateLabel: 'Gift Reason',
        value: this.sourceOfWealthDetail.giftReason,
        valueType: 'string'
      },
      investorGiftAmount: {
        templateLabel: 'Gift Amount',
        value: this.sourceOfWealthDetail.giftAmount,
        valueType: 'string'
      },
      investorFromAsset: {
        templateLabel: 'From Asset',
        value: this.sourceOfWealthList.asset,
        valueType: 'boolean'
      },
      investorAssetDescription: {
        templateLabel: 'Asset Description',
        value: this.sourceOfWealthDetail.assetDescription,
        valueType: 'string'
      },
      investorAssetValue: {
        templateLabel: 'Asset Value',
        value: this.sourceOfWealthDetail.assetAmount,
        valueType: 'string'
      },
      investorFromOther: {
        templateLabel: 'From Others',
        value: this.sourceOfWealthList.other,
        valueType: 'boolean'
      },
      investorOtherDescription: {
        templateLabel: 'Others Description',
        value: this.sourceOfWealthDetail.otherDescription,
        valueType: 'string'
      },
      investorOtherValue: {
        templateLabel: 'Others Value',
        value: this.sourceOfWealthDetail.otherAmount,
        valueType: 'string'
      },
    };

    Object.keys(investorRDNDetailTemplateMapping).forEach(key => {
      const patchedInvestorFormValue = this.patchInvestorFormValue(
        this.subscriptionAgreementTemplates,
        investorRDNDetailTemplateMapping[key].templateLabel,
        investorRDNDetailTemplateMapping[key].value,
        investorRDNDetailTemplateMapping[key].valueType);
      this.subscriptionAgreementTemplates = Object.assign(this.subscriptionAgreementTemplates, patchedInvestorFormValue);
    });


    const investorDetailTemplateMapping = {
      investorFullName: {
        templateLabel: 'Fullname',
        value: this.memberDetail.fullName,
        valueType: 'string'
      },
      investorGender: {
        templateLabel: 'Gender',
        value: this.masterData.genders.find(o => o.id === this.rdnRegistrationForm.controls.gender.value).name,
        valueType: 'string'
      },
      investorEmail: {
        templateLabel: 'Email',
        value: this.memberDetail.userName,
        valueType: 'string'
      },
      investorBirthOfDate: {
        templateLabel: 'Date of Birth',
        value: this.memberDetail.birthDate,
        valueType: 'string'
      },
      investorCitizenShip: {
        templateLabel: 'Citizenship Nationality',
        value: this.masterData.countries.find(o => o.code === this.memberDetail.citizenshipCountryId).name,
        valueType: 'string'
      },
      investorMobilePhoneNumber: {
        templateLabel: 'Mobile Phone Number',
        value: this.memberDetail.mobilePhoneNumber,
        valueType: 'string'
      },
      investorResidentialAddress: {
        templateLabel: 'Residential Address',
        value: this.memberDetail.address1,
        valueType: 'string'
      },
      investorMaritalStatus: {
        templateLabel: 'Marital Status',
        value: this.masterData.maritalStatus.find(o => o.id === this.rdnRegistrationForm.controls.maritalStatusId.value).name,
        valueType: 'string'
      },
      investorSpouseName: {
        templateLabel: 'Spouse\'s Fullname',
        value: this.masterData.spouseFullName,
        valueType: 'string'
      },
      investorResidentialCountry: {
        templateLabel: 'Residential Country',
        value: this.masterData.countries.find(o => o.code === this.memberDetail.residentialCountryId).name,
        valueType: 'string'
      },
      investorICNumber: {
        templateLabel: 'IC/Passport Number',
        value: this.memberDetail.icNumber,
        valueType: 'string'
      }, bankAccountName: {
        templateLabel: 'Remittance Beneficiary Bank Account Name',
        value: defaultBank.name,
        valueType: 'string'
      },
      bankAccountNumber: {
        templateLabel: 'Remittance Beneficiary Bank Account Number',
        value: defaultBank.number,
        valueType: 'string'
      },
      bankBeneficiaryName: {
        templateLabel: 'Remittance Name of Beneficiary Bank',
        value: this.masterData.banks.find(o => o.id === defaultBank.bankId).name,
        valueType: 'string'
      },
      bankBeneficiaryOtherName: {
        templateLabel: 'Remittance Name of Beneficiary Bank Other',
        value: defaultBank.bankOther,
        valueType: 'string'
      },
      bankBeneficiaryBranchName: {
        templateLabel: 'Remittance Name of Beneficiary Bank Branch',
        value: defaultBank.branch,
        valueType: 'string'
      },
      bankBeneficiaryBankAddress: {
        templateLabel: 'Remittance Name of Beneficiary Bank Address',
        value: defaultBank.address,
        valueType: 'string'
      },
      bankBeneficiarySWIFT: {
        templateLabel: 'Remittance SWIFT of Beneficiary Bank',
        value: defaultBank.swiftCode,
        valueType: 'string'
      },
      bankBeneficiaryCurrency: {
        templateLabel: 'Remittance Account Currency',
        value: defaultBank.currency,
        valueType: 'string'
      },
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

      termConditionFooter: {
        templateLabel: 'Terms and Conditions Footer 2',
        value: String(new Date()),
        valueType: 'string'
      }
    };

    Object.keys(investorDetailTemplateMapping).forEach(key => {
      const patchedInvestorFormValue = this.patchInvestorFormValue(
        this.subscriptionAgreementTemplates,
        investorDetailTemplateMapping[key].templateLabel,
        investorDetailTemplateMapping[key].value,
        investorDetailTemplateMapping[key].valueType);
      this.subscriptionAgreementTemplates = Object.assign(this.subscriptionAgreementTemplates, patchedInvestorFormValue);
    });

    if (this.rdnRegistrationForm.controls.employmentStatus.value === this.entrepenuerStatusId ||
      this.rdnRegistrationForm.controls.employmentStatus.value === this.employmentStatusId) {
      const companyAreaName = this.selectedCompanyAreaId;
      if (this.isCompanyLocalAddress) {
        this.companyAddressDetail = this.companyAddressList.find(o => o.area_id === companyAreaName);
      }
      let sourceOfWealthBusinessAddressTemplateMapping;
      if (this.rdnRegistrationForm.controls.employmentStatus.value === this.entrepenuerStatusId) {
        sourceOfWealthBusinessAddressTemplateMapping = {
          businessAddress: {
            templateLabel: 'Business Address 1',
            value: this.rdnRegistrationForm.controls.companyAddress.value,
            valueType: 'string'
          },
          businessCountry: {
            templateLabel: 'Business Country of Operation',
            value: this.masterData.countries.find(o => o.code === this.rdnRegistrationForm.controls.companyCountryId.value).name,
            valueType: 'string'
          },
          businessProvince: {
            templateLabel: 'Business Province',
            value: this.isCompanyLocalAddress ? this.companyAddressDetail.province_name : '',
            valueType: 'string'
          },
          businessCity: {
            templateLabel: 'Business City',
            value: this.isCompanyLocalAddress ? this.companyAddressDetail.city_name : '',
            valueType: 'string'
          },
          businessDistrict: {
            templateLabel: 'Business District',
            value: this.isCompanyLocalAddress ? this.companyAddressDetail.district_name : '',
            valueType: 'string'
          },
          businessArea: {
            templateLabel: 'Business Area',
            value: this.isCompanyLocalAddress ? this.companyAddressDetail.area_name : '',
            valueType: 'string'
          },
          businessAreaCode: {
            templateLabel: 'Business Area Code',
            value: this.rdnRegistrationForm.controls.companyAreaCode.value,
            valueType: 'string'
          },
          businessZipCode: {
            templateLabel: 'Business Zip Code',
            value: this.companyAddressZipCodeArea,
            valueType: 'string'
          },
        };
      } else if (this.rdnRegistrationForm.controls.employmentStatus.value === this.employmentStatusId) {
        sourceOfWealthBusinessAddressTemplateMapping = {
          employmentAddress: {
            templateLabel: 'Employment Address 1',
            value: this.rdnRegistrationForm.controls.companyAddress.value,
            valueType: 'string'
          },
          employmentCountry: {
            templateLabel: 'Employment Country of Operation',
            value: this.masterData.countries.find(o => o.code === this.rdnRegistrationForm.controls.companyCountryId.value).name,
            valueType: 'string'
          },
          employmentProvince: {
            templateLabel: 'Employment Province',
            value: this.isCompanyLocalAddress ? this.companyAddressDetail.province_name : '',
            valueType: 'string'
          },
          employmentCity: {
            templateLabel: 'Employment City',
            value: this.isCompanyLocalAddress ? this.companyAddressDetail.city_name : '',
            valueType: 'string'
          },
          employmentDistrict: {
            templateLabel: 'Employment District',
            value: this.isCompanyLocalAddress ? this.companyAddressDetail.district_name : '',
            valueType: 'string'
          },
          employmentArea: {
            templateLabel: 'Employment Area',
            value: this.isCompanyLocalAddress ? this.companyAddressDetail.area_name : '',
            valueType: 'string'
          },
          employmentAreaCode: {
            templateLabel: 'Employment Area Code',
            value: this.rdnRegistrationForm.controls.companyAreaCode.value,
            valueType: 'string'
          },
          employmentZipCode: {
            templateLabel: 'Employment Zip Code',
            value: this.companyAddressZipCodeArea,
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


    this._memberService.updateMember(body).subscribe(
      response => {
        this._memberService.createMemberSubscriptionAgreement(this.subscriptionAgreementTemplates)
          .subscribe(
            response => {
              this._modalService.open('sinarmasRDNSuccessfulDialog');
              this._authService.clearRDNLocalStorage();
            },
            error => {
              this._notificationService.error(error.message);
            }
          );
      });
  }

  getLookUpData() {
    const icTypeId = this._baseParameterService.getICType().find(o => o.name === 'KTP').id;
    this.masterData.icType = this._baseParameterService.getICType().filter(
      loanTypeResponse => loanTypeResponse.id === icTypeId);
    this._memberService
      .getReligion(this.countryCode)
      .subscribe(
        religionList => {
          this.masterData.religion = religionList.data;
        });

    this._memberService
      .getDegree(this.countryCode)
      .subscribe(
        degreeList => {
          this.masterData.degree = degreeList.data;
        });


    this._memberService
      .getMemberMasterData(this._authService.getMemberTypeCode())
      .subscribe(
        response => {
          this.masterData.maritalStatus = response.data.maritalStatuses.filter(o => o.countryId === this.countryCode);
        },
        error => {
          this._notificationService.error();
        }
      );


    this._memberService
      .getLookUpMasterData()
      .subscribe(
        response => {
          const masterData = response.data;
          this.masterData.countries = masterData.countries;
          this.masterData.genders = masterData.genders;
          this.masterData.banks = masterData.banks;
          this._utilityService.moveSpecificArrayToTop(this.masterData.countries, 'code', CONFIGURATION.country_code);
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
          this.masterData.monthlyIncome = masterData['monthly-revenues'];
        });

    this._translateService
      .get('investor-dashboard.rdn-information.form.upload')
      .subscribe(
        uploadWording => {
          this.docDetail.npwp.message = uploadWording.npwp;
          this.docDetail.kitas.message = uploadWording.kitas;
          this.docDetail.passport.message = uploadWording.passport;
        });
  }


  nextPage(backward: boolean = false) {
    let nextStep;
    if (backward) {
      nextStep = this.steps.find(step => {
        return step.index === this.currentStep - 1;
      });
      this.changeStep(nextStep.index, backward);
    }
    this.showValidation = true;
    this.isLocalInvestor = this.rdnRegistrationForm.value.identityCountryId === this.countryCode;
    const personalInformationValid = this.rdnRegistrationForm.controls.motherMaidenName.valid &&
      this.rdnRegistrationForm.controls.birthPlace.valid && this.rdnRegistrationForm.controls.religion.valid &&
      this.rdnRegistrationForm.controls.religion.valid && this.rdnRegistrationForm.controls.gender.valid &&
      this.rdnRegistrationForm.controls.identityType.valid && this.rdnRegistrationForm.controls.identityCountryId.valid &&
      this.rdnRegistrationForm.controls.identityAddress.valid && this.rdnRegistrationForm.controls.identityAddressAreaCode.valid &&
      this.rdnRegistrationForm.controls.residentialAddress.valid && this.rdnRegistrationForm.controls.residentialAreaCode.valid &&
      this.rdnRegistrationForm.controls.residentialCountryId.valid && Boolean(this.residentialAddressZipCodeArea.trim()) &&
      Boolean(this.identityAddressZipCodeArea.trim());
    const identityNumberValid = this.isLocalInvestor ? this.rdnRegistrationForm.controls.identityNumber.valid :
      this.rdnRegistrationForm.controls.passportNumber.valid && this.rdnRegistrationForm.controls.passportExpiryDate.valid;
    const emergencyContactValid = this.rdnRegistrationForm.controls.emergencyFullname.valid &&
      this.rdnRegistrationForm.controls.emergencyRelationship.valid &&
      this.rdnRegistrationForm.controls.emergencyContactNumber.valid &&
      this.rdnRegistrationForm.controls.emergencyCountryId.valid &&
      this.rdnRegistrationForm.controls.emergencyAddress.valid;
    const otherSourceOfWealthValid = this.sourceOfWealthList.inheritance ||
      this.sourceOfWealthList.gift || this.sourceOfWealthList.asset || this.sourceOfWealthList.other;
    if (this.currentStep === 1) {
      if (!this.isLocalInvestor) {
        this.onPassportExpiryDateChange();
      }
      if (!personalInformationValid || !identityNumberValid) {
        this._notificationService.error(this.errorMessage.AllFieldRequired);
        return;
      }
      const needTaxCardPhoto = this.isLocalInvestor ? true : false;
      const needKitasPhoto = this.isLocalInvestor ? false : true;
      if (needTaxCardPhoto && !this.docDetail.npwp.uploaded) {
        this._notificationService.error(this.errorMessage.uploadTaxCardPhoto);
        return;
      }
      if (!this.rdnRegistrationForm.controls.taxCardNumber.valid && needTaxCardPhoto) {
        this._notificationService.error(this.errorMessage.uploadTaxCardPhoto);
        return;
      }
      if (needKitasPhoto) {
        if (!this.docDetail.kitas.uploaded) {
          this._notificationService.error(this.errorMessage.uploadKitasPhoto);
          return;
        } else if (!this.docDetail.passport.uploaded) {
          this._notificationService.error(this.errorMessage.uploadPassportPhoto);
          return;
        }
      }
      if (!this.selectedResidentialAreaId && this.rdnRegistrationForm.controls.residentialCountryId.value === this.countryCode) {
        if (!this.residentialAddressZipCodeArea || this.residentialAddressList.length === 0) {
          this._notificationService.error(this.errorMessage.residentialZipCodeValid);
          return;
        } else if (this.residentialAddressZipCodeArea && this.residentialAddressList.length > 0) {
          this._notificationService.error(this.errorMessage.residentialAreaSelect);
          return;
        }
      }
      if (!this.selectedIdentityAreaId && this.isLocalInvestor) {
        if (!this.identityAddressZipCodeArea || this.identityAddressList.length === 0) {
          this._notificationService.error(this.errorMessage.identityZipCodeValid);
          return;
        } else if (this.identityAddressZipCodeArea && this.identityAddressList.length > 0) {
          this._notificationService.error(this.errorMessage.identityAreaSelect);
          return;
        }
      }
      if (!this.rdnRegistrationForm.controls.residentialAreaName.valid &&
        this.rdnRegistrationForm.controls.residentialCountryId.value !== this.countryCode) {
        this._notificationService.error(this.errorMessage.residentialAreaName);
        return;
      }
      if (!this.rdnRegistrationForm.controls.identityAddressAreaName.valid &&
        this.rdnRegistrationForm.controls.identityCountryId.value !== this.countryCode) {
        this._notificationService.error(this.errorMessage.identityAreaName);
        return;
      }
      if (!this.formModel.passportExpiryDateValid && !this.isLocalInvestor) {
        this._notificationService.error(this.formModel.passportExpiryDateErrorMessage);
        return;
      }
      this.showValidation = false;
    } else if (this.currentStep === 2) {
      this.isEmergencyLocalAddress = this.rdnRegistrationForm.value.emergencyCountryId === this.countryCode;
      if (!this.isEmergencyLocalAddress) {
        this.rdnRegistrationForm.controls.emergencyAreaName.setValidators([Validators.required]);
      } else {
        this.rdnRegistrationForm.controls.emergencyAreaName.setValidators([]);
      }
      this.rdnRegistrationForm.controls.emergencyAreaName.updateValueAndValidity();
      if (!emergencyContactValid || !(Boolean(this.emergencyAddressZipCodeArea.trim()))) {
        this._notificationService.error(this.errorMessage.AllFieldRequired);
        return;
      }
      if (!this.selectedEmergencyAreaId && this.isEmergencyLocalAddress) {
        if (!this.emergencyAddressZipCodeArea || this.emergencyAddressList.length === 0) {
          this._notificationService.error(this.errorMessage.emergencyZipCodeValid);
          return;
        } else if (this.emergencyAddressZipCodeArea && this.emergencyAddressList.length > 0) {
          this._notificationService.error(this.errorMessage.emergencyAreaSelect);
          return;
        }
      }
      if (!this.rdnRegistrationForm.controls.emergencyAreaName.valid && this.isEmergencyLocalAddress === false) {
        this._notificationService.error(this.errorMessage.emergencyAreaName);
        return;
      }
      this.showValidation = false;
    } else if (this.currentStep === 3) {
      const employementStatusId = this.rdnRegistrationForm.controls.employmentStatus.value;
      this.isCompanyLocalAddress = this.rdnRegistrationForm.value.companyCountryId === this.countryCode;
      if (employementStatusId === this.employmentStatusId || employementStatusId === this.entrepenuerStatusId) {
        this.rdnRegistrationForm.controls.employmentCompanyName.setValidators([Validators.required]);
        this.rdnRegistrationForm.controls.employmentJobTitle.setValidators([Validators.required]);
        this.rdnRegistrationForm.controls.employmentDuration.setValidators([Validators.required]);
        this.rdnRegistrationForm.controls.employmentAnnualIncome.setValidators([Validators.required]);
        this.rdnRegistrationForm.controls.companyCountryId.setValidators([Validators.required]);
        this.rdnRegistrationForm.controls.companyAddress.setValidators([Validators.required]);
        this.rdnRegistrationForm.controls.companyZipCodeArea.setValidators([Validators.required]);
        this.updateFormControlValidity();
      } else {
        this.rdnRegistrationForm.controls.employmentCompanyName.setValidators([]);
        this.rdnRegistrationForm.controls.employmentJobTitle.setValidators([]);
        this.rdnRegistrationForm.controls.employmentDuration.setValidators([]);
        this.rdnRegistrationForm.controls.employmentAnnualIncome.setValidators([]);
        this.rdnRegistrationForm.controls.companyCountryId.setValidators([]);
        this.rdnRegistrationForm.controls.companyAddress.setValidators([]);
        this.rdnRegistrationForm.controls.companyZipCodeArea.setValidators([]);
        this.updateFormControlValidity();
      }
      const sourceOfWealthValid = this.rdnRegistrationForm.controls.employmentStatus.valid &&
        this.rdnRegistrationForm.controls.employmentCompanyName.valid &&
        this.rdnRegistrationForm.controls.employmentJobTitle.valid &&
        this.rdnRegistrationForm.controls.employmentDuration.valid &&
        this.rdnRegistrationForm.controls.employmentAnnualIncome.valid &&
        this.rdnRegistrationForm.controls.companyCountryId.valid &&
        this.rdnRegistrationForm.controls.companyAddress.valid;


      this.companyAddressFlag = !this.selectedCompanyAreaId &&
        (employementStatusId === this.employmentStatusId || employementStatusId === this.entrepenuerStatusId);
      if (!sourceOfWealthValid && (employementStatusId === this.employmentStatusId ||
        employementStatusId === this.entrepenuerStatusId || !employementStatusId)) {
        this._notificationService.error(this.errorMessage.AllFieldRequired);
        return;
      }
      if (this.sourceOfWealthList.inheritance) {
        if (!Boolean(this.sourceOfWealthDetail.inheritanceAmount.trim()) ||
          !Boolean(this.sourceOfWealthDetail.inheritanceLineage.trim())) {
          this._notificationService.error(this.errorMessage.inheritanceDetail);
          return;
        }
      } else if (this.sourceOfWealthList.gift) {
        if (!Boolean(this.sourceOfWealthDetail.giftGiver.trim()) ||
          !Boolean(this.sourceOfWealthDetail.giftReason.trim()) ||
          !Boolean(this.sourceOfWealthDetail.giftAmount.trim())) {
          this._notificationService.error(this.errorMessage.giftDetail);
          return;
        }
      } else if (this.sourceOfWealthList.asset) {
        if (!Boolean(this.sourceOfWealthDetail.assetDescription.trim()) ||
          !Boolean(this.sourceOfWealthDetail.assetAmount.trim())) {
          this._notificationService.error(this.errorMessage.assetDetail);
          return;
        }
      } else if (this.sourceOfWealthList.other) {
        if (!Boolean(this.sourceOfWealthDetail.otherDescription.trim()) ||
          !Boolean(this.sourceOfWealthDetail.otherAmount.trim())) {
          this._notificationService.error(this.errorMessage.otherDetail);
          return;
        }
      }
      if (this.companyAddressFlag && this.isCompanyLocalAddress) {
        if (!this.companyAddressZipCodeArea || this.companyAddressList.length === 0) {
          this._notificationService.error(this.errorMessage.companZipCodeValid);
          return;
        } else if (this.companyAddressZipCodeArea && this.companyAddressList.length > 0) {
          this._notificationService.error(this.errorMessage.companyAreaSelect);
          return;
        }
      }
      if (!otherSourceOfWealthValid && (employementStatusId !== 11 && employementStatusId !== 12)) {
        this._notificationService.error(this.errorMessage.sourceOfWealth);
        return;
      }
      this.showValidation = false;
      this.onRDNRegistrationFormSubmit();
      return;
    }

    nextStep = this.steps.find(step => {
      return step.index === this.currentStep + 1;
    });
    this.changeStep(nextStep.index, backward);
  }

  onEmploymentStatusChange() {
    const employementStatusId = this.rdnRegistrationForm.controls.employmentStatus.value;
    this.rdnRegistrationForm.controls.employmentCompanyName.reset();
    this.rdnRegistrationForm.controls.employmentJobTitle.reset();
    this.rdnRegistrationForm.controls.employmentDuration.reset();
    this.rdnRegistrationForm.controls.employmentAnnualIncome.reset();
    this.rdnRegistrationForm.controls.companyCountryId.reset();
    this.rdnRegistrationForm.controls.companyAddress.reset();
    this.rdnRegistrationForm.controls.companyZipCodeArea.reset();
    if (employementStatusId !== 11 && employementStatusId !== 12) {
      this._formService.disableFields(this.rdnRegistrationForm,
        ['employmentCompanyName', 'employmentJobTitle', 'employmentDuration', 'employmentAnnualIncome',
          'companyAreaName', 'companyAreaCode', 'companyCountryId', 'companyAddress', 'companyZipCodeArea']);
      this.isDisabledCompanyZipArea = true;
    } else {
      this._formService.enableFields(this.rdnRegistrationForm,
        ['employmentCompanyName', 'employmentJobTitle', 'employmentDuration', 'employmentAnnualIncome',
          'companyAreaName', 'companyAreaCode', 'companyCountryId', 'companyAddress', 'companyZipCodeArea']);
      this.isDisabledCompanyZipArea = false;
    }
  }


  changeStep(stepIndex: number, backward: boolean = false): void {
    const step = this.steps.find(step => {
      return step.index === stepIndex;
    });
    if (step) {
      if (backward && this.currentStep < step.index) {
        return;
      }

      window.scrollTo(0, 0);
      this.currentStep = step.index;
      switch (step.key) {
        case rdnRegistrationSteps.personal:

          break;
        case rdnRegistrationSteps.emergencyContact:

        case rdnRegistrationSteps.sourceOfWealth:
          break;
        case rdnRegistrationSteps.completed:
      }
    }
  }

  onSelectedSourceOfWealthChange(val: string, sourceOfWealthType: string) {
    if (sourceOfWealthType === 'inheritance') {
      this.sourceOfWealthList.inheritance = val;
    } else if (sourceOfWealthType === 'gift') {
      this.sourceOfWealthList.gift = val;
    } else if (sourceOfWealthType === 'asset') {
      this.sourceOfWealthList.asset = val;
    } else if (sourceOfWealthType === 'other') {
      this.sourceOfWealthList.other = val;
    }
  }

  goToBrowseLoan() {
    this._router.navigate(['/admin-investor/overview']);
  }

  updateFormControlValidity() {
    this.rdnRegistrationForm.controls.employmentCompanyName.updateValueAndValidity();
    this.rdnRegistrationForm.controls.employmentJobTitle.updateValueAndValidity();
    this.rdnRegistrationForm.controls.employmentDuration.updateValueAndValidity();
    this.rdnRegistrationForm.controls.employmentAnnualIncome.updateValueAndValidity();
    this.rdnRegistrationForm.controls.companyCountryId.updateValueAndValidity();
    this.rdnRegistrationForm.controls.companyAddress.updateValueAndValidity();
    this.rdnRegistrationForm.controls.companyZipCodeArea.updateValueAndValidity();
  }

  onCopyresidentialAddress(value: any) {
    if (value.checked) {
      this.rdnRegistrationForm.patchValue({
        residentialAddress: this.rdnRegistrationForm.controls.identityAddress.value,
        residentialAreaCode: this.rdnRegistrationForm.controls.identityAddressAreaCode.value,
        residentialCountryId: this.rdnRegistrationForm.controls.identityCountryId.value,
        residentialAreaName: this.rdnRegistrationForm.controls.identityAddressAreaName.value,
      });
      this.residentialAddressZipCodeArea = this.identityAddressZipCodeArea;
      this.getAddressLocation(this.residentialAddressZipCodeArea, 'residential');
      this.selectedResidentialAreaId = this.selectedIdentityAreaId;
    } else {
      this.rdnRegistrationForm.patchValue({
        residentialAddress: '',
        residentialAreaCode: '',
        residentialCountryId: '',
        residentialAreaName: ''
      });
      this.residentialAddressZipCodeArea = '';
      this.residentialAddressList = [];
    }
  }

  onFileUploadError(args: any, documentLabel: string): void {
    const message = documentLabel + ': ' + args[1];
    this._notificationService.error(message, 5000);
  }

  onFileUploadSending(args: any, documentType: string): void {
    args[2].append('doc_type', documentType);
    args[2].append('country_id', CONFIGURATION.country_code);
  }

  onFileUploadSuccess(args: any, documentType: string): void {
    if (documentType) {
      const message = this.docDetail[documentType.toLowerCase()].label + ' uploaded.';
      this._notificationService.success(message, 5000);
      this.docDetail[documentType.toLowerCase()].uploaded = true;
      this.updateDropZoneSuccessMessage(documentType.toLowerCase());
    }
  }

  onResidentialCountryChange(firstload: boolean = false) {
    if (!firstload) {
      this.rdnRegistrationForm.controls['residentialAddress'].reset();
      this.rdnRegistrationForm.controls['residentialAreaId'].reset();
      this.rdnRegistrationForm.controls['residentialAreaCode'].reset();
      this.rdnRegistrationForm.controls['residentialAreaName'].reset();
      this.residentialAddressZipCodeArea = '';
    }
    if (this.rdnRegistrationForm.value.residentialCountryId !== this.countryCode) {
      if (!firstload) {
        this.selectedResidentialAreaId = '';
        this.showResidentialAddressList = false;
      }
      this.rdnRegistrationForm.controls.residentialAreaName.setValidators([Validators.required]);
    } else {
      if (!firstload) {
        this.showResidentialAddressList = true;
        this.residentialAddressListFlag = false;
        this.residentialAddressList = [];
      }
      this.rdnRegistrationForm.controls.residentialAreaName.setValidators([]);
    }
    this.rdnRegistrationForm.controls.residentialAreaName.updateValueAndValidity();
  }

  onIdentityCountryChange(firstload: boolean = false) {
    if (!firstload) {
      this.rdnRegistrationForm.controls['identityAddress'].reset();
      this.rdnRegistrationForm.controls['identityAddressAreaCode'].reset();
      this.rdnRegistrationForm.controls['identityAddressAreaName'].reset();
      this.identityAddressZipCodeArea = '';
    }
    if (this.rdnRegistrationForm.value.identityCountryId !== this.countryCode) {
      this.rdnRegistrationForm.controls.identityAddressAreaName.setValidators([Validators.required]);
      this.rdnRegistrationForm.controls.passportNumber.setValidators([Validators.required]);
      this.rdnRegistrationForm.controls.passportExpiryDate.setValidators([Validators.required]);
      this.rdnRegistrationForm.controls.taxCardNumber.setValidators([]);
      const icTypeId = this._baseParameterService.getICType().find(o => o.name === 'Paspor').id;
      this.masterData.icType = this._baseParameterService.getICType().filter(
        loanTypeResponse => loanTypeResponse.id === icTypeId);
      this.rdnRegistrationForm.patchValue({
        identityType: icTypeId,
      });
      if (!firstload) {
        this.selectedIdentityAreaId = '';
        this.showIdentityAddressList = false;
      }
    } else {
      const icTypeId = this._baseParameterService.getICType().find(o => o.name === 'KTP').id;
      this.masterData.icType = this._baseParameterService.getICType().filter(
        loanTypeResponse => loanTypeResponse.id === icTypeId);
      this.rdnRegistrationForm.patchValue({
        identityType: icTypeId,
      });
      this.rdnRegistrationForm.controls.identityAddressAreaName.setValidators([]);
      this.rdnRegistrationForm.controls.taxCardNumber.setValidators([Validators.required]);
      this.rdnRegistrationForm.controls.passportNumber.setValidators([]);
      this.rdnRegistrationForm.controls.passportExpiryDate.setValidators([]);
      if (!firstload) {
        this.showIdentityAddressList = true;
        this.identityAddressListFlag = false;
        this.identityAddressList = [];
      }
    }
    this.rdnRegistrationForm.controls.identityAddressAreaName.updateValueAndValidity();
    this.rdnRegistrationForm.controls.taxCardNumber.updateValueAndValidity();
    this.rdnRegistrationForm.controls.passportNumber.updateValueAndValidity();
    this.rdnRegistrationForm.controls.passportExpiryDate.updateValueAndValidity();
  }

  onEmergencyCountryChange() {
    this.rdnRegistrationForm.controls['emergencyAddress'].reset();
    this.rdnRegistrationForm.controls['emergencyAreaCode'].reset();
    this.rdnRegistrationForm.controls['emergencyAreaName'].reset();
    this.emergencyAddressZipCodeArea = '';
    if (this.rdnRegistrationForm.value.emergencyCountryId !== this.countryCode) {
      this.selectedEmergencyAreaId = '';
      this.showEmergencyAddressList = false;
      this.rdnRegistrationForm.controls.emergencyAreaName.setValidators([Validators.required]);
    } else {
      this.showEmergencyAddressList = true;
      this.emergencyAddressListFlag = false;
      this.emergencyAddressList = [];
      this.rdnRegistrationForm.controls.emergencyAreaName.setValidators([]);
    }
    this.rdnRegistrationForm.controls.emergencyAreaName.updateValueAndValidity();
  }

  onCompanyCountryChange() {
    this.rdnRegistrationForm.controls['companyAddress'].reset();
    this.rdnRegistrationForm.controls['companyAreaCode'].reset();
    this.rdnRegistrationForm.controls['companyAreaName'].reset();
    this.companyAddressZipCodeArea = '';
    if (this.rdnRegistrationForm.value.companyCountryId !== this.countryCode) {
      this.selectedCompanyAreaId = '';
      this.showCompanyAddressList = false;
      this.rdnRegistrationForm.controls.companyAreaName.setValidators([Validators.required]);
    } else {
      this.showCompanyAddressList = true;
      this.companyAddressListFlag = false;
      this.companyAddressList = [];
      this.rdnRegistrationForm.controls.companyAreaName.setValidators([]);
    }
    this.rdnRegistrationForm.controls.companyAreaName.updateValueAndValidity();

  }

  getAddressLocation(key: string, addressType: string) {
    this._memberService
      .getAddressLocation(this.countryCode, key)
      .subscribe(
        response => {
          if (addressType === 'residential') {
            this.residentialAddressList = [];
            this.residentialAddressListFlag = true;
            this.residentialAddressList = response.data;
            if (this.residentialAddressList.length === 1) {
              this.selectedResidentialAreaId = this.residentialAddressList[0].area_id;
            }
          } else if (addressType === 'identity') {
            this.identityAddressList = [];
            this.identityAddressListFlag = true;
            this.identityAddressList = response.data;
            if (this.identityAddressList.length === 1) {
              this.selectedIdentityAreaId = this.identityAddressList[0].area_id;
            }
          } else if (addressType === 'emergency') {
            this.emergencyAddressList = [];
            this.emergencyAddressListFlag = true;
            this.emergencyAddressList = response.data;
            if (this.emergencyAddressList.length === 1) {
              this.selectedEmergencyAreaId = this.emergencyAddressList[0].area_id;
            }
          } else if (addressType === 'company') {
            this.companyAddressList = [];
            this.companyAddressListFlag = true;
            this.companyAddressList = response.data;
            if (this.companyAddressList.length === 1) {
              this.selectedCompanyAreaId = this.companyAddressList[0].area_id;
            }
          }
        },
        error => {
          this._notificationService.error(error);
        }
      );
  }

  updateDropZoneSuccessMessage(documentType: string) {
    this.docDetail[documentType.toLowerCase()].message = this._domSanitizer.sanitize(SecurityContext.HTML,
      `${this.docDetail[documentType.toLowerCase()].label}
      Uploaded
      <i class="fa fa-check margin-left-10" aria-hidden="true"></i>
      `);
  }

  onPassportExpiryDateChange(): void {
    this.formModel.passportExpiryDateValid = true;
    if (this.formModel.passportExpiryDateValid) {
      const today = new Date();
      const comparator = new Date(this.rdnRegistrationForm.value.passportExpiryDate);
      const timeDiff = comparator.getTime() - today.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (diffDays / 30.0 < this.passportExpiredMonthLimit) {
        this.formModel.passportExpiryDateValid = false;
        this._notificationService.error(this.formModel.passportExpiryDateErrorMessage);
      }
    }
  }



}
