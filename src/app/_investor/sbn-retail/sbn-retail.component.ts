
import { forkJoin as observableForkJoin, Observable } from 'rxjs';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { FormService } from '../../services/form.service';
import { ValidatorService } from '../../services/validator.service';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { UtilityService } from '../../services/utility.service';
import CONFIGURATION from '../../../configurations/configuration';
import { EventService } from '../../services/event.service';
import { FinanceService } from '../../services/finance.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DocumentService } from '../../services/document.service';
import { ENVIRONMENT } from 'environments/environment';

@Component({
  selector: 'sbn-retail',
  templateUrl: './sbn-retail.html'
})
export class SbnRetailComponent implements OnInit {
  isInvestorSecuritiesAccountNumberEmpty: boolean;
  masterData: any;
  memberDetail: any;
  memberCurrentStatus: string;
  registrationButtonCaption: any;
  registrationStepMapping: any;
  registrationTitle: string;
  memberEsbnDetail: any;
  cityId: string;
  businessCityId: string;
  currency: string;
  formValidation: any;
  investorOrderList: any;
  investmentForm: FormGroup;
  redeemForm: FormGroup;
  sbnInvestorDetailForm: FormGroup;
  provinceId: string;
  businessProvinceId: string;
  selectedOrderCode: string;
  selectedSeries: any;
  sbnFormatting: any;
  sbnOfferList: any;
  sbnRetailMenu: Array<any>;
  sbnRetailMenuMapping: any;
  totalAvailableBond: number;
  transactionStatus: any;
  acceptOrderDisclaimer: boolean;
  acceptRedeemDisclaimer: boolean;
  acceptRegisterTermCondition: boolean;
  acceptBinaArthaAccountOpening: boolean;
  showBinaArthaAccountOpening: boolean;
  currentActiveSeries: string;
  redeemableAmount: any;
  redeemData: any;
  quota: any;
  paymentDateInformation: string;
  tradeableInformation: string;
  sortDataFlag: boolean;
  numberOfOrderData: number;
  orderDetail: any;
  uploadConfiguration: any;
  docDetail: any;
  showCompanyDetail: boolean;
  needSpouseName: boolean;
  defaultBankId: number;
  governmentBondTradeableLink: string;

  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _baseParameterService: BaseParameterService,
    private _documentService: DocumentService,
    private _formService: FormService,
    private _financeService: FinanceService,
    private _eventService: EventService,
    private _notificationService: NotificationService,
    private _memberService: MemberService,
    private _modalService: ModalService,
    private _translateService: TranslateService,
    private _domSanitizer: DomSanitizer,
    private _validatorService: ValidatorService) {
    this.investmentForm = this._formBuilder.group({
      amount: new FormControl(null, [Validators.required, this._validatorService.validatePositiveDecimal])
    });
    this.redeemForm = this._formBuilder.group({
      amount: new FormControl(null, [Validators.required, this._validatorService.validatePositiveDecimal])
    });
    this.sbnInvestorDetailForm = this._formBuilder.group({
      investorSID: new FormControl(null, []),
      investorName: new FormControl(null, [Validators.required]),
      investorIdentityNumber: new FormControl(null, [Validators.required]),
      investorBirthPlace: new FormControl(null, [Validators.required]),
      investorBirthDate: new FormControl(null, [Validators.required]),
      investorBirthCountry: new FormControl(null, [Validators.required]),
      investorReligion: new FormControl(null, [Validators.required]),
      investorMaritalStatus: new FormControl(null, [Validators.required]),
      investorSpouseName: new FormControl(null, []),
      investorEducationBackground: new FormControl(null, [Validators.required]),
      investorGender: new FormControl(null, [Validators.required]),
      investorOccupation: new FormControl(null, [Validators.required]),
      investorAddress: new FormControl(null, [Validators.required]),
      investorProvince: new FormControl(null, [Validators.required]),
      investorCity: new FormControl(null, [Validators.required]),
      investorPhoneNumber: new FormControl(null, [Validators.required]),
      investorAddressZipCode: new FormControl(null, [Validators.required]),
      investorTaxNumber: new FormControl(null, []),
      investorHomePhoneNumber: new FormControl(null, []),
      investorCompanyName: new FormControl(null, []),
      investorCompanyAddress: new FormControl(null, []),
      investorCompanyCity: new FormControl(null, []),
      investorCompanyProvince: new FormControl(null, []),
      investorCompanyCountry: new FormControl(null, []),
      investorCompanyBusiness: new FormControl(null, []),
      investorCompanyPosition: new FormControl(null, []),
      investorIncomePerAnnum: new FormControl(null, [Validators.required]),
      investorSourceOfFund: new FormControl(null, [Validators.required]),
      investorInvestmentObjectives: new FormControl(null, [Validators.required]),
      investorEmail: new FormControl(null, [Validators.required, Validators.email]),
      investorMotherMaidenName: new FormControl(null, [Validators.required]),
      investorFundAccountName: new FormControl(null, [Validators.required]),
      investorFundAccountNumber: new FormControl(null, [Validators.required]),
      investorFundAccountBankName: new FormControl(null, [Validators.required]),
      investorSecuritiesSubRegistry: new FormControl(null, []),
      investorSecuritiesAccountNumber: new FormControl(null, []),
      investorSecuritiesAccountName: new FormControl(null, []),
    });

    this.currency = CONFIGURATION.currency_symbol;
    this.acceptBinaArthaAccountOpening = false;
    this.showBinaArthaAccountOpening = false;
    this.masterData = {
      annualIncomes: new Array<any>(),
      investmentObjectives: new Array<any>(),
      sourceOfFunds: new Array<any>(),
      banks: new Array<any>(),
      cities: new Array<any>(),
      businessCities: new Array<any>(),
      occupations: new Array<any>(),
      degrees: new Array<any>(),
      genders: new Array<any>(),
      maritalStatuses: new Array<any>(),
      countries: new Array<any>(),
      provinces: new Array<any>(),
      religions: new Array<any>(),
      subregistries: new Array<any>()
    };

    this.registrationStepMapping = [
      { number: 1, label: 'sid' },
      { number: 2, label: 'esbn' }
    ];

    this.memberCurrentStatus = '';

    this.registrationTitle = '';

    this.formValidation = {
      investorDetail: false,
      fundAccount: false,
      securitiesAccount: false
    };

    this.memberDetail = {
      fullName: '',
      birthDate: new Date(),
      icNumber: '',
      email: ''
    };

    this.registrationButtonCaption = 'Register';

    this.isInvestorSecuritiesAccountNumberEmpty = false;

    this.investorOrderList = new Array();
    this.sbnOfferList = new Array();
    this.sbnRetailMenu = new Array();

    this.numberOfOrderData = 0;

    this.sbnFormatting = {
      dateFormat: 'dd MMM yyyy',
      decimalFormat: CONFIGURATION.format.decimal,
      dateTimeFormat: 'dd MMM yyyy HH:mm:ss',
    };

    this.quota = {
      investor: 0,
      series: 0
    };

    this.transactionStatus = new Array();
    this.sbnRetailMenuMapping =
      [{ key: 0, sort: 1, numberOfBond: -1, label: 'Data Investor', menu: 'personal', show: true },
      { key: 1, sort: 2, numberOfBond: 0, label: 'Seri Ditawarkan', menu: 'bond', show: true },
      { key: 2, sort: 4, numberOfBond: -1, label: 'Seri Dimiliki - Tradeable', menu: 'bond', show: false },
      { key: 3, sort: 3, numberOfBond: -1, label: 'Status Transaksi', menu: 'history', show: false },
      { key: 4, sort: 5, numberOfBond: -1, label: 'Seri Dimiliki - Non Tradable', menu: 'bond', show: false }];
    this.totalAvailableBond = 0;
    this.provinceId = '';
    this.acceptOrderDisclaimer = false;
    this.acceptRedeemDisclaimer = false;
    this.acceptRegisterTermCondition = false;
    this.currentActiveSeries = '';
    this.redeemableAmount = 0;
    this.sortDataFlag = false;
    this.paymentDateInformation = 'Apabila tanggal yang tercantum jatuh di hari libur, maka pembayaran akan dilakukan di hari kerja berikutnya';
    this.tradeableInformation = 'Pastikan untuk memasukkan password baru Anda saat pertama kali login ke website BinaArtha';
    this.orderDetail = [];

    this.uploadConfiguration = this._baseParameterService.getDocumentUploadingConfigWithUploadImage();

    this.docDetail = {
      ktp:
      {
        label: 'KTP',
        type: 'KTP',
        uploaded: false,
        message: '',
        error: '',
        success: '',
      },
      npwp:
      {
        label: 'NPWP',
        type: 'NPWP',
        uploaded: false,
        message: '',
        error: '',
        success: '',
      },
      selfie_with_id:
      {
        label: 'Selfie with id',
        type: 'SELFIE_WITH_ID',
        uploaded: false,
        message: '',
        error: '',
        success: '',
      },
      signature_file:
      {
        label: 'Foto tanda tangan',
        type: 'SIGNATURE_FILE',
        uploaded: false,
        message: '',
        error: '',
        success: '',
      },
    };

    this.showCompanyDetail = false;
    this.needSpouseName = false;
    this.defaultBankId = 47;
    this.governmentBondTradeableLink = ENVIRONMENT.governmentBondTradeable.link;
  }

  ngOnInit() {
    this.initializeMasterData();
    this._eventService.sendSbnEvent('id-bond-landing-page');
    this._formService.disableFields(this.sbnInvestorDetailForm,
      ['investorSecuritiesSubRegistry', 'investorSecuritiesAccountName']);
    observableForkJoin(
      this._memberService.getEsbnOccupation(),
      this._memberService.getEsbnGender(),
      this._memberService.getEsbnProvince(),
      this._memberService.getEsbnSubregistry(),
    ).subscribe(responses => {
      this.masterData.occupations = responses[0].data;
      this.masterData.genders = responses[1].data;
      this.masterData.provinces = responses[2].data;
      this.masterData.subregistries = responses[3].data;
    },
      error => {
        this._notificationService.error();
      });
    this._memberService.getMemberDetail().subscribe(
      memberDetail => {
        this._translateService
          .get('investor-dashboard.rdn-information.form.upload')
          .subscribe(
            uploadWording => {
              this.docDetail.npwp.message = uploadWording.npwp;
              this.docDetail.ktp.message = uploadWording.ktp;
              this.docDetail.selfie_with_id.message = uploadWording.selfie_with_id;
              this.docDetail.signature_file.message = uploadWording.signature;
              this.getUploadedDocument();
            });
        if (memberDetail) {
          this.memberDetail.id = memberDetail.id;
          this.memberDetail.fullName = memberDetail.fullName;
          this.memberDetail.icNumber = memberDetail.icNumber;
          this.memberDetail.birthDate = memberDetail.birthDate;
          this.memberDetail.birthPlace = memberDetail.birthPlace;
          this.memberDetail.email = memberDetail.userName;
          this.memberDetail.phoneNumber = memberDetail.phoneNumber;
          this.memberDetail.mobilePhoneNumber = memberDetail.mobilePhoneNumber;
          this.memberDetail.address = memberDetail.address1;
          this.memberDetail.religionCode = memberDetail.religionCode;
          this.memberDetail.degreeCode = memberDetail.degreeCode;
          this.memberDetail.maritalStatusId = memberDetail.maritalStatusId;
          this.memberDetail.spouseFullName = memberDetail.spouseFullName;
          this.memberDetail.motherMaidenName = memberDetail.motherMaidenName;
          this.memberDetail.companyAddress1 = memberDetail.companyAddress1;
          this.memberDetail.companyCountryId = memberDetail.companyCountryId;
          this.memberDetail.companyCityId = memberDetail.companyCityId;
          this.memberDetail.citizenshipZipCode = memberDetail.citizenshipZipCode;
          this.memberDetail.companyIndustryId = memberDetail.companyIndustryId;
          this.memberDetail.taxCardNumber = memberDetail.taxCardNumber;
        }

        this.sbnInvestorDetailForm.patchValue({
          investorName: this.memberDetail.fullName,
          investorIdentityNumber: this.memberDetail.icNumber,
          investorBirthPlace: this.memberDetail.birthPlace,
          investorBirthDate: new Date(this.memberDetail.birthDate),
          investorAddress: this.memberDetail.address,
          investorPhoneNumber: this.memberDetail.mobilePhoneNumber,
          investorHomePhoneNumber: this.memberDetail.phoneNumber,
          investorEmail: this.memberDetail.email,
          investorEducationBackground: this.memberDetail.degreeCode,
          investorMotherMaidenName: this.memberDetail.motherMaidenName,
          investorCompanyName: this.memberDetail.companyName,
          investorCompanyAddress: this.memberDetail.companyAddress1,
          investorCompanyCity: this.memberDetail.companyCityId,
          investorCompanyProvince: this.memberDetail.companyStateId,
          investorCompanyCountry: this.memberDetail.companyCountryId
        });

        this._memberService.getMemberCustodianData().subscribe(
          response => {
            this.memberEsbnDetail = response.data;
            this._memberService.getEsbnBank().subscribe(responses => {
              this.masterData.banks = responses.data;
              // this.masterData.banks = this.masterData.banks.filter(x => x.id === this.defaultBankId);
            });
            if (response.data) {
              if (this.memberEsbnDetail.funds_acc_bank_id) {
                this.masterData.banks = this.masterData.banks.filter(x => x.id === this.memberEsbnDetail.funds_acc_bank_id);
              }
              this.sbnInvestorDetailForm.patchValue({
                investorReligion: this.memberDetail.religion_id,
                investorIncomePerAnnum: this.memberEsbnDetail.employment_annual_income_id,
                investorMaritalStatus: this.memberEsbnDetail.marital_status_id,
                investorEducationBackground: this.memberEsbnDetail.education_id,
                investorInvestmentObjectives: this.memberEsbnDetail.investment_objectives_id,
                investorCompanyName: this.memberEsbnDetail.business_company_name,
                investorCompanyAddress: this.memberEsbnDetail.business_address,
                investorCompanyCity: this.memberEsbnDetail.business_company_city_id,
                investorCompanyProvince: this.memberEsbnDetail.business_company_province_id,
                investorCompanyCountry: this.memberEsbnDetail.business_company_country,
                investorCompanyBusiness: this.memberEsbnDetail.business_industry,
                investorCompanyPosition: this.memberEsbnDetail.employment_title,
              });
              this.memberCurrentStatus = response.data.status;
              if (this.memberCurrentStatus === '' || this.memberCurrentStatus === 'INIT') {
                this.registrationTitle = 'Pendaftaran SID';
              } else if (this.memberCurrentStatus === 'PROCESSING') {
                this.registrationTitle = 'Pendaftaran SID - dalam proses'
              } else if (this.memberCurrentStatus === 'SUCCESS') {
                this.registrationTitle = 'Pendaftaran SBN Retail';
              } else if (this.memberCurrentStatus === 'COMPLETE') {
                this.registrationTitle = 'Data Investor SBN Retail';
              }
              if (this.memberEsbnDetail.status === '' || this.memberEsbnDetail.status === 'INIT' || this.memberEsbnDetail.status === 'PROCESSING') {
                this.registrationButtonCaption = 'On Process';
              }
              if (this.memberEsbnDetail.status === 'SUCCESS') {
                this.registrationButtonCaption = 'Verify';
              }
              if (this.memberEsbnDetail.status === 'COMPLETE') {
                this.registrationButtonCaption = 'Complete';
              }
              this.generateMenu(this.memberEsbnDetail.show_orders);
            } else {
              this.registrationTitle = 'Pendaftaran SID';
              this.registrationButtonCaption = 'Register';
            }

            if (this.memberEsbnDetail) {
              if (this.memberEsbnDetail.status === 'SUCCESS') {
                this._formService.disableFields(this.sbnInvestorDetailForm,
                  ['investorSID', 'investorName', 'investorIdentityNumber', 'investorBirthPlace',
                    'investorBirthDate', 'investorGender', 'investorOccupation',
                    'investorReligion', 'investorMaritalStatus', 'investorSpouseName',
                    'investorEducationBackground', 'investorBirthCountry', 'investorMotherMaidenName',
                    'investorSourceOfFund', 'investorInvestmentObjectives',
                    'investorCompanyName', 'investorCompanyAddress', 'investorCompanyCity',
                    'investorCompanyProvince', 'investorCompanyCountry', 'investorCompanyBusiness',
                    'investorCompanyPosition', 'investorAddressZipCode', 'investorIncomePerAnnum',
                    'investorAddress', 'investorProvince', 'investorCity', 'investorTaxNumber',
                    'investorPhoneNumber', 'investorHomePhoneNumber', 'investorEmail',
                    'investorSecuritiesSubRegistry', 'investorSecuritiesAccountNumber', 'investorSecuritiesAccountName']);
              } else {
                if (this.memberEsbnDetail.status) {
                  this.disabledAllInvestorField();
                }
              }
              this.sbnInvestorDetailForm.patchValue({
                investorSID: this.memberEsbnDetail.sid,
                investorName: this.memberEsbnDetail.name,
                investorIdentityNumber: this.memberEsbnDetail.id_no,
                investorBirthPlace: this.memberEsbnDetail.place_of_birth,
                investorBirthDate: new Date(this.memberEsbnDetail.date_of_birth),
                investorGender: String(this.memberEsbnDetail.gender_id),
                investorOccupation: this.memberEsbnDetail.occupation_id,
                investorAddress: this.memberEsbnDetail.address,
                investorProvince: String(this.memberEsbnDetail.province_id),
                investorCity: this.memberEsbnDetail.city_id,
                investorPhoneNumber: this.memberEsbnDetail.mobile_phone,
                investorHomePhoneNumber: this.memberEsbnDetail.phone,
                investorEmail: this.memberEsbnDetail.email,
                investorTaxNumber: this.memberEsbnDetail.tax_no,
                investorIncomePerAnnum: this.memberEsbnDetail.employment_annual_income_id,
                investorSourceOfFund: this.memberEsbnDetail.source_of_funds_id,
                investorInvestmentObjectives: this.memberEsbnDetail.investment_objectives_id,
                investorMotherMaidenName: this.memberEsbnDetail.mother_maiden_name,
                investorBirthCountry: this.memberEsbnDetail.country_of_birth,
                investorReligion: this.memberEsbnDetail.religion_id,
                investorMaritalStatus: this.memberEsbnDetail.marital_status_id,
                investorSpouseName: this.memberEsbnDetail.spouse_name,
                investorEducationBackground: this.memberEsbnDetail.education_id,
                investorAddressZipCode: this.memberEsbnDetail.zip_code,
                investorCompanyName: this.memberEsbnDetail.business_company_name,
                investorCompanyAddress: this.memberEsbnDetail.business_address,
                investorCompanyCity: this.memberEsbnDetail.business_company_city_id,
                investorCompanyProvince: this.memberEsbnDetail.business_company_province_id,
                investorCompanyCountry: this.memberEsbnDetail.business_company_country,
                investorCompanyBusiness: this.memberEsbnDetail.business_industry,
                investorCompanyPosition: this.memberEsbnDetail.employment_title,
                investorFundAccountName: this.memberEsbnDetail.funds_acc_account_name,
                investorFundAccountNumber: this.memberEsbnDetail.funds_acc_account_no,
                investorFundAccountBankName: this.memberEsbnDetail.funds_acc_bank_id,
                investorSecuritiesSubRegistry: this.memberEsbnDetail.securities_acc_subregistry_id,
                investorSecuritiesAccountNumber: this.memberEsbnDetail.securities_acc_account_no,
                investorSecuritiesAccountName: this.memberEsbnDetail.securities_acc_account_name,
              });
              this.onOccupationsChange();
              this.businessProvinceId = String(this.memberEsbnDetail.business_company_province_id);
              this.onBusinessProvinceChange();
              this.sbnInvestorDetailForm.patchValue({
                investorSecuritiesSubRegistry: 392,
                investorSecuritiesAccountName: this.memberDetail.fullName,
              });
              this.memberDetail.fundAccountId = this.memberEsbnDetail.funds_acc_id;
              this.memberDetail.SecuritiesAccountId = this.memberEsbnDetail.securities_acc_id;
              this.provinceId = String(this.memberEsbnDetail.province_id);
              this.onProvinceChange();
            }
          },
          error => {
            this.generateMenu();
            this._notificationService.error(error.message);
          });
      },
      error => {
        this._notificationService.error();
      });

    this._memberService.getEsbnTransactionStatus()
      .subscribe(
        response => {
          this.transactionStatus = response.data;
        },
        error => {
          this._notificationService.error(error.message);
        });
  }

  onOccupationsChange() {
    const needCompanyDetailList = ['11', '03', '04', '07', '  05', '06'];
    this.showCompanyDetail = false;
    const selectedinvestorOccupation = this.sbnInvestorDetailForm.controls.investorOccupation.value;
    if (needCompanyDetailList.includes(selectedinvestorOccupation)) {
      this.showCompanyDetail = true;
    }

    if (this.showCompanyDetail) {
      this.sbnInvestorDetailForm.controls.investorCompanyName.setValidators([Validators.required]);
      this.sbnInvestorDetailForm.controls.investorCompanyAddress.setValidators([Validators.required]);
      this.sbnInvestorDetailForm.controls.investorCompanyCity.setValidators([Validators.required]);
      this.sbnInvestorDetailForm.controls.investorCompanyProvince.setValidators([Validators.required]);
      this.sbnInvestorDetailForm.controls.investorCompanyCountry.setValidators([Validators.required]);
      this.sbnInvestorDetailForm.controls.investorCompanyBusiness.setValidators([Validators.required]);
      this.sbnInvestorDetailForm.controls.investorCompanyPosition.setValidators([Validators.required]);
    } else {
      this.sbnInvestorDetailForm.controls.investorCompanyName.setValidators([]);
      this.sbnInvestorDetailForm.controls.investorCompanyAddress.setValidators([]);
      this.sbnInvestorDetailForm.controls.investorCompanyCity.setValidators([]);
      this.sbnInvestorDetailForm.controls.investorCompanyProvince.setValidators([]);
      this.sbnInvestorDetailForm.controls.investorCompanyCountry.setValidators([]);
      this.sbnInvestorDetailForm.controls.investorCompanyBusiness.setValidators([]);
      this.sbnInvestorDetailForm.controls.investorCompanyPosition.setValidators([]);
    }

    this.sbnInvestorDetailForm.controls.investorCompanyName.updateValueAndValidity();
    this.sbnInvestorDetailForm.controls.investorCompanyAddress.updateValueAndValidity();
    this.sbnInvestorDetailForm.controls.investorCompanyCity.updateValueAndValidity();
    this.sbnInvestorDetailForm.controls.investorCompanyProvince.updateValueAndValidity();
    this.sbnInvestorDetailForm.controls.investorCompanyCountry.updateValueAndValidity();
    this.sbnInvestorDetailForm.controls.investorCompanyBusiness.updateValueAndValidity();
    this.sbnInvestorDetailForm.controls.investorCompanyPosition.updateValueAndValidity();
  }

  initializeMasterData() {
    this._translateService
      .get('master')
      .subscribe(
        masterData => {
          this.masterData.maritalStatuses = masterData['marital-status'];
          this.masterData.maritalStatuses = [
            { id: 1, name: 'Single' },
            { id: 2, name: 'Married' },
            { id: 3, name: 'Widower' }
          ];
          this.masterData.annualIncomes = [
            { id: 1, name: 'Below Rp 10 Million' },
            { id: 2, name: 'Above Rp 10 Million and Below Rp 50 Million' },
            { id: 3, name: 'Above Rp 50 Million and Below Rp 100 Million' },
            { id: 4, name: 'Above Rp 100 Million and Below Rp 500 Million' },
            { id: 5, name: 'Above Rp 500 Million and Below Rp 1 Billion' },
            { id: 6, name: 'Above Rp 1 Billion' },
          ];
          this.masterData.investmentObjectives = [
            { id: 2, name: 'Price Appreciation' },
            { id: 3, name: 'Long Term Investment' },
            { id: 4, name: 'Speculation' },
            { id: 5, name: 'Income' },
            { id: 6, name: 'Short Term Investment' },
            { id: 7, name: 'Portfolio' }
          ];
          this.masterData.sourceOfFunds = [
            { id: 2, name: 'Salary' },
            { id: 3, name: 'Business Profit' },
            { id: 4, name: 'Interest/Savings' },
            { id: 5, name: 'Heritage' },
            { id: 6, name: 'Grant From Parent Or Kinds' },
            { id: 7, name: 'Grant From Spouse' },
            { id: 8, name: 'Pension Funds' },
            { id: 9, name: 'Lottery' },
            { id: 10, name: 'Proceed From Investment' },
            { id: 11, name: 'Bonus' },
            { id: 12, name: 'Benefit' },
            { id: 13, name: 'Loans' },
            { id: 14, name: 'Beneficial Owner' }
          ];
        });

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
        }
      );

    this._memberService
      .getReligion(CONFIGURATION.country_code)
      .subscribe(
        response => {
          this.masterData.religions = response.data;
          this.masterData.religions = [
            { id: 1, label: 'Islam' },
            { id: 2, label: 'Protestan' },
            { id: 3, label: 'Katholik' },
            { id: 4, label: 'Hindu' },
            { id: 5, label: 'Budha' },
            { id: 6, label: 'Kong Hu Cu' },
            { id: 7, label: 'Others' }
          ];
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
          this.masterData.degrees = [
            { code: 2, name: 'SD : Elementary School' },
            { code: 3, name: 'SMP : Junior High School' },
            { code: 4, name: 'SMA : Senior High School' },
            { code: 5, name: 'D3 : Academy ( Akademi -D1 )' },
            { code: 6, name: 'S1 : Degree ( Sarjana, Strata 1 )' },
            { code: 7, name: 'S2 : Master  Degree ( Sarjana, Strata 2 )' },
            { code: 8, name: 'S3 : Doctoral Degree ( Sarjana, Strata 3 )' }
          ];
        },
        error => {
          this._notificationService.error(error);
        }
      );
  }

  getUploadedDocument() {
    observableForkJoin(
      this._documentService.getUploadedDocument(this.docDetail.ktp.type),
      this._documentService.getUploadedDocument(this.docDetail.npwp.type),
      this._documentService.getUploadedDocument(this.docDetail.selfie_with_id.type),
      this._documentService.getUploadedDocument(this.docDetail.signature_file.type),
      ).subscribe(responses => {
      const uploadedDoc = responses;
      if (uploadedDoc[0].results.length > 0) {
        this.docDetail.ktp.uploaded = true;
        this.updateDropZoneSuccessMessage(this.docDetail.ktp.type);
      }
      if (uploadedDoc[1].results.length > 0) {
        this.docDetail.npwp.uploaded = true;
        this.updateDropZoneSuccessMessage(this.docDetail.npwp.type);
      }
      if (uploadedDoc[2].results.length > 0) {
        this.docDetail.selfie_with_id.uploaded = true;
        this.updateDropZoneSuccessMessage(this.docDetail.selfie_with_id.type);
      }
      if (uploadedDoc[3].results.length > 0) {
        this.docDetail.signature_file.uploaded = true;
        this.updateDropZoneSuccessMessage(this.docDetail.signature_file.type);
      }
    }, error => {
      this._notificationService.error();
    });
  }

  openModal(id: string): void {
    this._modalService.open(id);
  }

  closeModal(id: string): void {
    this._modalService.close(id);
  }

  onProvinceChange() {
    this._memberService.getEsbnCity(this.provinceId).subscribe(
      response => {
        this.masterData.cities = response.data;
        if (this.memberEsbnDetail) {
          this.cityId = String(this.memberEsbnDetail.city_id);
        }
      },
      error => {
        this._notificationService.error();
      });
  }

  onBusinessProvinceChange() {
    this._memberService.getEsbnCity(this.businessProvinceId).subscribe(
      response => {
        this.masterData.businessCities = response.data;
        if (this.memberEsbnDetail) {
          this.businessCityId = String(this.memberEsbnDetail.business_company_city_id);
        }
      },
      error => {
        this._notificationService.error();
      });

  }

  generateMenu(showOrder: any = false) {
    this._translateService
      .get('sbn-retail.menu')
      .subscribe(
        menu => {
          for (const key in menu) {
            if (key) {
              this.sbnRetailMenu.push({
                active: menu[key].key === 0,
                numberOfBond: this.sbnRetailMenuMapping.find(x => x.key === menu[key].key).numberOfBond,
                label: menu[key].label,
                key: menu[key].key,
                sort: this.sbnRetailMenuMapping.find(x => x.key === menu[key].key).sort,
                show: this.memberEsbnDetail ? true : this.sbnRetailMenuMapping.find(x => x.key === menu[key].key).show,
                menu: this.sbnRetailMenuMapping.find(x => x.key === menu[key].key).menu
              });
            }
          }
          this.sbnRetailMenu.find(x => x.key === 2).show = showOrder;
          this.sbnRetailMenu.find(x => x.key === 3).show = showOrder;
          this.sbnRetailMenu.find(x => x.key === 4).show = showOrder;

          this.sbnRetailMenu.sort((a, b) => {
            if (a.sort < b.sort) return -1;
            else if (a.sort > b.sort) return 1;
            else return 0;
          });

          this.getEsbnOffer();
        });
  }

  investSBN(series: any): void {
    this.selectedSeries = series;
    this._memberService.getSBNSeriesQuota(this.memberEsbnDetail.sid, this.selectedSeries.id).subscribe(
      response => {
        if (response.status) {
          this.quota.investor = response.data.investor_quota;
          this.quota.series = response.data.series_quota;
          this.openModal('investSBNDialog');
        } else {
          this._notificationService.error(response.error.message);
        }
      },
      error => {
        this._notificationService.error();
      });
  }

  autoFormatInvestmentAmount(modalType: string): void {
    if (modalType === 'redeem') {
      this.redeemForm.patchValue({
        amount: this._validatorService.addDelimiter(this.redeemForm.value.amount, false)
      });
    } else if (modalType === 'buySBN') {
      this.investmentForm.patchValue({
        amount: this._validatorService.addDelimiter(this.investmentForm.value.amount, false)
      });
    }
  }

  redeemSBN(order: any) {
    this.redeemableAmount = order.redeemable_amount;
    this.redeemData = order.redeem_info;
    this.selectedOrderCode = order.order_code;
    this.openModal('RedeemSBNDialog');
  }

  sortData() {
    if (this.sortDataFlag) {
      this.investorOrderList.sort((a, b) => {
        if (a.nominal < b.nominal) return -1;
        else if (a.nominal > b.nominal) return 1;
        else return 0;
      });
    } else {
      this.investorOrderList.sort((a, b) => {
        if (a.nominal > b.nominal) return -1;
        else if (a.nominal < b.nominal) return 1;
        else return 0;
      });
    }
  }

  openTCModal() {
    this.formValidation.investorDetail = true;
    this.isInvestorSecuritiesAccountNumberEmpty = true;
    if (!this.sbnInvestorDetailForm.controls.investorSecuritiesAccountNumber.value) {
      this.isInvestorSecuritiesAccountNumberEmpty = false;
      this._notificationService.error('Mohon lengkapi data yang diperlukan');
    } else if (this.enabledRegisterButton() && this.isInvestorSecuritiesAccountNumberEmpty) {
      this.openModal('registerDialog');
    }
  }

  openConfirmationModal() {
    if (!this.enabledRegisterButton()) {
      return;
    }

    if ((!this.docDetail.ktp.uploaded ||
      !this.docDetail.npwp.uploaded ||
      !this.docDetail.selfie_with_id.uploaded ||
      !this.docDetail.signature_file.uploaded ) &&
      (!this.memberEsbnDetail || this.memberEsbnDetail.status !== 'SUCCESS')) {
      this._notificationService.error('Mohon unggah semua dokumen yang diperlukan');
      return;
    }
    if (this.memberCurrentStatus === '' || this.memberCurrentStatus == null) {
      this.formValidation.investorDetail = true;
      if (this.enabledRegisterButton()) {
        if (this.sbnInvestorDetailForm.valid) {
          this._memberService.registerMemberCustodianData(this.sbnInvestorDetailForm.getRawValue())
            .subscribe(
              response => {
                this._eventService.sendSbnEvent('id-bond-register-sid');
                this.memberEsbnDetail = this.sbnInvestorDetailForm.value;
                this.openModal('registerSIDSuccessFullDialog');
                setTimeout(() => {
                  location.reload();
                }, 3000); //replace with binding data if have time
              },
              error => {
                this._notificationService.error(error.message);
              });
        }
      }

    } else if (this.memberCurrentStatus === 'SUCCESS') {
      this.openTCModal();
    }
  }



  registerInvestorDetail() {
    const binaArthaValidation = !this.acceptBinaArthaAccountOpening && !this.showBinaArthaAccountOpening;
    if (this.acceptRegisterTermCondition && binaArthaValidation) {
      this._memberService.registerEsbnDetail(this.sbnInvestorDetailForm.getRawValue())
        .subscribe(
          response => {
            if (response && response.status === false) {
              this._notificationService.error(response.error.message);
              this.closeModal('registerDialog');
            } else {
              this._eventService.sendSbnEvent('id-bond-register-sbn');
              this.memberEsbnDetail = this.sbnInvestorDetailForm.value;
              this.closeModal('registerDialog');
              this._notificationService.success(response.message);
              setTimeout(() => {
                location.reload();
              }, 3000);
            }
          },
          error => {
            this._notificationService.error(error.message);
          });
    } else {
      this._notificationService.error('Anda belum menyetujui pernyataan');
    }
  }

  disabledAllInvestorField() {
    this._formService.disableFields(this.sbnInvestorDetailForm,
      ['investorSID', 'investorName', 'investorIdentityNumber', 'investorBirthPlace',
        'investorAddress', 'investorGender', 'investorOccupation',
        'investorReligion', 'investorMaritalStatus', 'investorSpouseName,',
        'investorEducationBackground', 'investorBirthCountry', 'investorMotherMaidenName',
        'investorSourceOfFund', 'investorInvestmentObjectives',
        'investorCompanyName', 'investorCompanyAddress', 'investorCompanyCity',
        'investorCompanyProvince', 'investorCompanyCountry', 'investorCompanyBusiness',
        'investorCompanyPosition', 'investorAddressZipCode', 'investorIncomePerAnnum',
        'investorBirthDate', 'investorProvince', 'investorCity', 'investorTaxNumber',
        'investorPhoneNumber', 'investorHomePhoneNumber', 'investorEmail',
        'investorFundAccountBankName', 'investorFundAccountNumber', 'investorFundAccountName',
        'investorSecuritiesSubRegistry', 'investorSecuritiesAccountNumber', 'investorSecuritiesAccountName']);
  }

  updateInvestorDetail() {
    if (this.enabledRegisterButton()) {
      this.formValidation.investorDetail = true;
      if (this.sbnInvestorDetailForm.valid) {
        if (!this.memberEsbnDetail) {
          this.openModal('registerDialog');
        } else {
          const fundAccountId = this.memberEsbnDetail.funds_accounts[0].id;
          const securitiesAccountId = this.memberEsbnDetail.securities_accounts[0].id;
          this._memberService.updateEsbnInvestorDetail(this.sbnInvestorDetailForm.value, this.memberEsbnDetail.sid, fundAccountId, securitiesAccountId)
            .subscribe(
              response => {
                if (response && response.error && response.error.code === 500) {
                  this._notificationService.error(response.error.message);
                } else {
                  this.disabledAllInvestorField();
                  this._notificationService.success(response.message);
                }
              },
              error => {
                this._notificationService.error(error.message);
              });
        }
      } else {
        this._notificationService.error('Mohon lengkapi data yang diperlukan');
      }
    }
  }

  changeSBNRetailMenu(sbnRetailKey: number) {
    this.acceptOrderDisclaimer = false;
    this.sbnRetailMenu.forEach(sbnRetailMenu => {
      sbnRetailMenu.active = sbnRetailMenu.key === sbnRetailKey;
    });
    if (this.getActiveSBNRetailMenu() === 1) {
      this.getEsbnOffer();
    } else if (this.getActiveSBNRetailMenu() !== 0 || this.getActiveSBNRetailMenu() !== 1) {
      this.getInvestorOrderList();
    }
  }

  getEsbnOffer() {
    if (this.memberEsbnDetail) {
      this._memberService.getEsbnOfferbySid(this.memberEsbnDetail.sid)
        .subscribe(
          response => {
            this.sbnOfferList = response.data;
            this.totalAvailableBond = this.sbnOfferList.length;
            this.sbnRetailMenu.find(x => x.key === 1).numberOfBond = this.sbnOfferList.length;
          },
          error => {
            this._notificationService.error(error.message);
          });
    } else {
      this._memberService.getEsbnOffer()
        .subscribe(
          response => {
            this.sbnOfferList = response.data;
            this.totalAvailableBond = this.sbnOfferList.length;
            this.sbnRetailMenu.find(x => x.key === 1).numberOfBond = this.sbnOfferList.length;
          },
          error => {
            this._notificationService.error(error.message);
          });
    }
  }

  sbnRedeemOrder() {
    if (this.acceptRedeemDisclaimer) {
      if (this.redeemForm.valid) {
        const amount = parseFloat(this._validatorService.removeDelimiter(this.redeemForm.value.amount));
        this._memberService.updateEsbnInvestorRedemption(this.memberEsbnDetail.sid, this.selectedOrderCode, amount)
          .subscribe(
            response => {
              if (response && response.error && response.error.code === 500) {
                this._notificationService.error(response.error.message);
              } else {
                this.closeModal('RedeemSBNDialog');
                this.redeemForm.reset();
                this.acceptRedeemDisclaimer = false;
                this._notificationService.success(response.message);
                this.getInvestorOrderList();
              }
            },
            error => {
              this._notificationService.error(error.message);
            });
      } else {
        this._notificationService.error('Masukkan nominal');
      }
    } else {
      this._notificationService.error('Anda belum menyetujui pernyataan');
    }
  }

  sbnSeriesOrder() {
    this.orderDetail = [];
    if (this.acceptOrderDisclaimer) {
      const body = {
        series_id: this.selectedSeries.id,
        funds_account_id: this.memberDetail.fundAccountId,
        securities_account_id: this.memberDetail.SecuritiesAccountId,
        nominal: parseFloat(this._validatorService.removeDelimiter(this.investmentForm.value.amount)),
        sid: this.sbnInvestorDetailForm.controls.investorSID.value
      };
      if (body.nominal) {
        this._memberService.EsbnSeriesOrder(body)
          .subscribe(
            response => {
              this._eventService.sendSbnEvent('id-bond-order');
              this.orderDetail = response.data;
              if (response && response.status === false) {
                this._notificationService.error(response.error.message);
              } else {
                this.closeModal('investSBNDialog');
                this.getEsbnOffer();
                this.investmentForm.reset();
                this.acceptOrderDisclaimer = false;
                this.openModal('investSBNDialogConfirm');
                setTimeout(() => {
                  this._financeService.triggerBalanceRetrieval();
                }, 2000);
              }
            },
            error => {
              this._notificationService.error(error.message);
            });
      } else {
        this._notificationService.error('Masukkan nominal');
      }
    } else {
      this._notificationService.error('Anda belum menyetujui pernyataan');
    }
  }

  getActiveSBNRetailMenu() {
    return this.sbnRetailMenu.length > 0 ? this.sbnRetailMenu.find(x => x.active === true).key : 0;
  }

  showSIDField() {
    return !(this.memberCurrentStatus === '' || this.memberCurrentStatus === 'INIT' || this.memberCurrentStatus === 'PROCESSING');
  }

  enabledRegisterButton() {
    return !(this.memberCurrentStatus === 'INIT' || this.memberCurrentStatus === 'PROCESSING' || this.memberCurrentStatus === 'COMPLETE');
  }

  enabledOrderBondButton() {
    return this.memberCurrentStatus === 'COMPLETE';
  }

  getInvestorOrderList() {
    this._memberService.getInvestorOrderList(this.sbnInvestorDetailForm.controls.investorSID.value)
      .subscribe(
        response => {
          response.data.forEach(data => {
            if (!data.hasOwnProperty('series_data')) {
              data.series_data = {
                'tradeability': 'Non Tradable'
              };
            }
          });
          if (this.getActiveSBNRetailMenu() === 2) {
            this.investorOrderList = response.data.filter(x => x.status_id === '4' && x.series_data.tradeability === 'Non Tradable');
            this.numberOfOrderData = this.investorOrderList.length;
          } else if (this.getActiveSBNRetailMenu() === 4) {
            this.investorOrderList = response.data.filter(x => x.status_id === '4' && x.series_data.tradeability === 'Tradable');
            this.numberOfOrderData = this.investorOrderList.length;
          } else {
            this.investorOrderList = response.data.filter(x => x.status_id !== '4');
            this.numberOfOrderData = this.investorOrderList.length;
          }
        },
        error => {
          this._notificationService.error(error.message);
        });
  }

  onOrderAccept(event: any): void {
    this.acceptOrderDisclaimer = event.checked;
  }

  onReedemAccept(event: any): void {
    this.acceptRedeemDisclaimer = event.checked;
  }

  onRegisterTCAccept(event: any): void {
    this.acceptRegisterTermCondition = event.checked;
  }

  onacceptBinaArthaAccountOpening(event: any): void {
    this.acceptBinaArthaAccountOpening = event.checked;
  }

  onFileUploadError(args: any, documentLabel: string): void {
    const message = documentLabel + ': ' + args[1];
    this._notificationService.error(message, 5000);
  }

  onFileUploadSending(args: any, documentType: string): void {
    args[2].append('doc_type', documentType);
    args[2].append('investor_id', this.memberDetail.id);
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

  updateDropZoneSuccessMessage(documentType: string) {
    this.docDetail[documentType.toLowerCase()].message = this._domSanitizer.sanitize(SecurityContext.HTML,
      `${this.docDetail[documentType.toLowerCase()].label}
      Uploaded
      <i class="fa fa-check margin-left-10" aria-hidden="true"></i>
      `);
  }

  onMaritalStatusChange() {
    this.needSpouseName = false;
    this.sbnInvestorDetailForm.controls.investorSpouseName.setValidators([]);
    if (this.sbnInvestorDetailForm.controls.investorMaritalStatus.value === 2) {
      this.needSpouseName = true;
      this.sbnInvestorDetailForm.controls.investorSpouseName.setValidators([Validators.required]);
    }
    this.sbnInvestorDetailForm.controls.investorSpouseName.updateValueAndValidity();
  }

  goToPaymentLink(link: string) {
    window.open(link, '_blank');
    this.closeModal('investSBNDialogConfirm');
  }

  goToBinaArthaLink() {
    window.open(this.governmentBondTradeableLink, '_blank');
  }
}
