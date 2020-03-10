import { Injectable } from '@angular/core';
import { ENVIRONMENT } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Country } from '../models/baseParameters.class';
import CONFIGURATION from '../../configurations/configuration';
import { AuthService } from './auth.service';

@Injectable()
export class BaseParameterService {

  private country_list: Array<Country>;
  private interest_rate: any;
  statistic_tabs: any;
  funding_status: any;
  private loan_status_filter: any;
  other_bank_id: any;
  private other_id_card_id: any;
  sign_up_swipper_config;
  private document_uploading_config;
  private document_auth_uploading_config;
  private document_uploading_config_with_upload_image;
  private document_uploading_sort;
  tenor_type_label: any;
  transferTypes: any;
  loanStatuses: any;
  private memberStatuses: any;
  private loanStatusesMapping: any;
  private loanStages: any;
  private loanStagesName: any;
  private memberEntityTypeId: any;
  private memberEntityCode: any;
  private investorOnboardingStep: any;
  private borrowerOnboardingStep: any;
  private agreementStep: any;
  private employeementAnnualRevenueList: any;
  private invSignUpEvents;
  private invActivationEvents;
  private brwSignUpEvents;
  private autoInvestEvents;
  private invWalletEvents;
  private newLoanEvents;
  private sbnEvents;
  private icType: any;
  private myInfo: any;
  private loanSimulationParameters: any;
  private refer_section: any;
  private investorAgreementStep: any;
  private investorAgreementStepWithAuthorizationConsent: any;
  private max_loan_amount: any;
  private employmentStatuses;
  private accreditedStatuses: any;
  private accreditedDefaultValue: any;
  private accreditedBasedOnAnnualIncomeId: any;
  private tierAmount: any;
  private autoInvestmentSetting: any;
  private mobileOperatingSystem: any;
  private gracePeriodSetting: any;
  private autoInvestmentLoyalty: any;
  private bankIdList: any;
  private paymenStatusesList: any;
  private errorCode: any;
  private investmentProfile: any;
  private scrollTelorance: number;
  private productGroupId: any;
  private homePagePromoBannerEvents: any;
  private accountVerificationStepDetail: any;
  private autoInvestmentInterestRateRange: any;

  constructor(
    private _translateService: TranslateService,
    private _authService: AuthService,
  ) {

    this.bankIdList = {
      bca: 170
    };

    this.autoInvestmentSetting = {
      // tenorTypeId is actually the unique loan id whereas loanTypeId is actually the loan group id
      SG: [
        // Business Term Loan
        {
          code: 'BT',
          loanTypeId: 7,
          tenorTypeId: 8,
          minInterestRange: {
            min: 6,
            max: 18,
            step: 1
          },
          maxInterestRange: {
            min: 6.99,
            max: 18.99,
            step: 1
          },
          amountRange: {
            min: 100,
            max: 5000,
            step: 100,
            minAA30: 20,
            maxAA30: 50000,
          },
        },
        // Invoice Financing
        {
          code: 'IF',
          loanTypeId: 8,
          tenorTypeId: 9,
          minInterestRange: {
            min: 2,
            max: 18,
            step: 1
          },
          maxInterestRange: {
            min: 5.99,
            max: 18.99,
            step: 1
          },
          amountRange: {
            min: 100,
            max: 5000,
            step: 100,
            minAA30: 20,
            maxAA30: 50000,
          },
        },
        // Secured Loan
        {
          code: 'PL',
          loanTypeId: 16,
          tenorTypeId: 23,
          minInterestRange: {
            min: 4,
            max: 9,
            step: 0.5
          },
          maxInterestRange: {
            min: 4.5,
            max: 9.5,
            step: 0.5
          },
          amountRange: {
            min: 1000,
            max: 50000,
            step: 1000,
            minAA30: 20,
            maxAA30: 50000,
          },
        }
      ],
      MY: [
        // Invoice Financing
        {
          code: 'IF',
          loanTypeId: 6,
          tenorTypeId: 7,
          minInterestRange: {
            min: 8,
            max: 14,
            step: 0.5
          },
          maxInterestRange: {
            min: 12,
            max: 18,
            step: 0.5
          },
          amountRange: {
            min: 100,
            max: 5000,
            step: 100,
            minAA30: 100,
            maxAA30: 5000,
          },
        },
        // Business Term Financing
        {
          code: 'BT',
          loanTypeId: 5,
          tenorTypeId: 6,
          minInterestRange: {
            min: 8,
            max: 14.5,
            step: 0.5
          },
          maxInterestRange: {
            min: 11.5,
            max: 18,
            step: 0.5
          },
          amountRange: {
            min: 100,
            max: 5000,
            step: 100,
            minAA30: 100,
            maxAA30: 5000,
          },
        }
      ],
      ID: [
        // Pinjaman UMKM
        {
          code: 'BT',
          loanTypeId: 10,
          tenorTypeId: 13,
          minInterestRange: {
            min: 12.68,
            max: 34.68,
            step: 1
          },
          maxInterestRange: {
            min: 17.97,
            max: 39.97,
            step: 1
          },
          amountRange: {
            min: 1000000,
            max: 500000000,
            step: 1000000,
            minAA30: 100000,
            maxAA30: 2000000000,
          },
        },
        // Invoice Financing
        {
          code: 'IF',
          loanTypeId: 11,
          tenorTypeId: 16,
          minInterestRange: {
            min: 7,
            max: 20,
            step: 1
          },
          maxInterestRange: {
            min: 10,
            max: 23,
            step: 1
          },
          amountRange: {
            min: 1000000,
            max: 500000000,
            step: 1000000,
            minAA30: 100000,
            maxAA30: 2000000000,
          },
        },
        // Revolver & MCA
        {
          code: 'RV',
          loanTypeId: 12,
          tenorTypeId: 18,
          minInterestRange: {
            min: 7,
            max: 20,
            step: 1
          },
          maxInterestRange: {
            min: 10,
            max: 23,
            step: 1
          },
          amountRange: {
            min: 1000000,
            max: 500000000,
            step: 1000000,
            minAA30: 100000,
            maxAA30: 2000000000,
          },
        }
      ]
    };

    this.accreditedBasedOnAnnualIncomeId = {
      MY: {
        id: 6
      },
      SG: {
        id: 2
      },
      VN: {
        id: 18
      }
    };

    this.accreditedDefaultValue = {
      MY: {
        id: 5
      },
      SG: {
        id: 1
      },
      VN: {
        id: 17
      }
    };

    this.memberEntityTypeId = {
      retail: '1',
      premierInvestor: '2'
    };

    this.agreementStep = {
      MY: {
        0: {
          key: 0,
          label: 'Bank account'
        },
        1: {
          key: 1,
          label: 'Wealth declaration'
        },
        2: {
          key: 9999,
          label: 'Completed'
        }
      }
    };

    this.mobileOperatingSystem = {
      android: 'android',
      ios: 'ios'
    };

    this.investorOnboardingStep = {
      SG: [
        {
          index: 1,
          lastSignUpStepWeb: 'INVESTOR_PERSONAL_INFORMATION',
          label: 'Personal Details'
        },
        {
          index: 2,
          lastSignUpStepWeb: 'INVESTOR_DOCUMENTS_UPLOAD',
          label: 'Document Upload'
        },
        {
          index: 3,
          lastSignUpStepWeb: '',
          label: 'Completed'
        }
      ],
      MY: [
        {
          index: 1,
          lastSignUpStepWeb: 'INVESTOR_PERSONAL_INFORMATION',
          label: 'Personal Details'
        },
        {
          index: 2,
          lastSignUpStepWeb: 'INVESTOR_DOCUMENTS_UPLOAD',
          label: 'Document Upload'
        },
        {
          index: 3,
          lastSignUpStepWeb: '',
          label: 'Completed'
        }
      ],
      ID: [
        {
          index: 1,
          lastSignUpStepWeb: 'INVESTOR_PERSONAL_INFORMATION',
          label: 'Personal Details'
        },
        {
          index: 2,
          lastSignUpStepWeb: 'INVESTOR_BUSINESS_INFORMATION',
          label: 'Business'
        },
        {
          index: 3,
          lastSignUpStepWeb: 'INVESTOR_DOCUMENTS_UPLOAD',
          label: 'Document'
        },
        {
          index: 4,
          lastSignUpStepWeb: '',
          label: 'Completed'
        }

      ],
      VN: {
        0: {
          key: 0,
          sort: 1,
          label: 'Review Myinfo'
        },
        1: {
          key: 1,
          sort: 2,
          label: 'Business'
        },
        2: {
          key: 9999,
          sort: 3,
          label: 'Completed'
        }
      }
    };

    this.borrowerOnboardingStep = {
      SG: [
        {
          index: 1,
          lastSignUpStepWeb: 'BORROWER_BUSINESS_INFORMATION',
          label: 'Business Information'
        }
      ],
      MY: [
        {
          index: 1,
          lastSignUpStepWeb: 'BORROWER_BUSINESS_INFORMATION',
          label: 'Business Information'
        },
        {
          index: 2,
          lastSignUpStepWeb: 'BORROWER_FINANCIAL_INFORMATION',
          label: 'Financial'
        },
        {
          index: 3,
          lastSignUpStepWeb: 'BORROWER_PERSONAL_INFORMATION',
          label: 'Personal Detail'
        },
        {
          index: 4,
          lastSignUpStepWeb: 'BORROWER_DOCUMENTS_UPLOAD',
          label: 'Document'
        }
      ],
      ID: [
        {
          index: 1,
          lastSignUpStepWeb: 'BORROWER_PERSONAL_INFORMATION',
          label: 'Personal Info'
        },
        {
          index: 2,
          lastSignUpStepWeb: 'BORROWER_BUSINESS_INFORMATION',
          label: 'Data Usaha'
        },
        {
          index: 3,
          lastSignUpStepWeb: 'BORROWER_DOCUMENTS_UPLOAD',
          label: 'Dokumen'
        }
      ],
      VN: {
        0: {
          key: 0,
          sort: 1,
          label: 'Review Myinfo'
        },
        1: {
          key: 1,
          sort: 2,
          label: 'Business'
        },
        2: {
          key: 9999,
          sort: 3,
          label: 'Completed'
        }
      }
    };

    this.investorAgreementStep = {
      MY: {
        0: {
          key: 0,
          label: 'Bank account'
        },
        1: {
          key: 1,
          label: 'Wealth declaration'
        },
        2: {
          key: 2,
          label: 'Terms And Conditions'
        },
        3: {
          key: 3,
          label: 'Completed'
        }
      }
    };

    this.investorAgreementStepWithAuthorizationConsent = {
      MY: {
        0: {
          key: 0,
          label: 'Bank account'
        },
        1: {
          key: 1,
          label: 'Wealth declaration'
        },
        2: {
          key: 2,
          label: 'Authorization Consent'
        },
        3: {
          key: 3,
          label: 'Terms And Conditions'
        },
        4: {
          key: 4,
          label: 'Completed'
        }
      }
    };

    this.interest_rate = {
      SG: {
        valueFrom: 0.06,
        valueTo: 0.15
      },
      MY: {
        valueFrom: 0.06,
        valueTo: 0.15
      },
      ID: {
        valueFrom: 0.12,
        valueTo: 0.26
      }
    };

    this.country_list =
      [{ name: 'All', code: 'ALL' },
      { name: 'Indonesia', code: 'ID' },
      { name: 'Malaysia', code: 'MY' },
      { name: 'Singapore', code: 'SG' }];

    this.other_bank_id = {
      SG: '9991',
      ID: '9993',
      MY: '9995'
    };

    this.other_id_card_id = {
      SG: '9991',
      ID: '9993',
      MY: '9995'
    };

    this.transferTypes = {
      SG: [
        { value: 'TT' },
        { value: 'Internet Banking' },
      ],
      MY: [
        { value: 'Check' },
        { value: 'ATM' },
        { value: 'Wire Transfer' },
        { value: 'TT' },
        { value: 'Bank Transfer' },
        { value: 'Internet Banking' },
      ],
      VN: [
        { value: 'TT' },
        { value: 'Internet Banking' },
      ],
    };

    this.tenor_type_label =
      [{ tenor_type: 1, key: 'Day' },
      { tenor_type: 7, key: 'Week' },
      { tenor_type: 14, key: 'Fortnight' },
      { tenor_type: 30, key: 'Month' },
      { tenor_type: 360, key: 'Year' }];

    this.statistic_tabs = {
      general: 0,
      repayment: 1,
      disbursement: 2
    };

    this.funding_status = {
      FUNDING: 'FUNDING',
      PRECF: 'PRE-CF',
      SUCCESS: 'SUCCESS'
    };

    this.loan_status_filter = {
      ACTIVE: 'ACTIVE',
      FUNDED: 'FUNDED'
    };

    this.document_uploading_sort = {
      ID: [
        { type: 'KTP', sort: 1 },
        { type: 'KTP_PASANGAN', sort: 2 },
        { type: 'KK', sort: 3 },
        { type: 'NPWP', sort: 4 },
        { type: 'NPWP_PERUSAHAAN', sort: 5 },
        { type: 'PASSPORT', sort: 6 },
        { type: 'SELFIE_WITH_ID', sort: 7 }
      ],
      MY: [
        { type: 'NRIC_FRONT', sort: 1 },
        { type: 'NRIC_BACK', sort: 2 },
        { type: 'PASSPORT', sort: 3 },
      ],
      SG: [
        { type: 'NRIC_FRONT', sort: 1 },
        { type: 'NRIC_BACK', sort: 2 },
        { type: 'PASSPORT', sort: 3 },
        { type: 'PORA', sort: 4 }
      ]
    };

    this.sign_up_swipper_config = {
      centeredSlides: true,
      direction: 'horizontal',
      keyboardControl: true,
      loop: true,
      mousewheelControl: false,
      pagination: '.swiper-pagination',
      paginationClickable: true,
      slidesPerView: 1,
      autoplay: 10000
    };

    this.loanStagesName = {
      origination: 'ORIGINATION',
      underwriting: 'UNDERWRITING',
      offer: 'OFFER',
      funding: 'FUNDING',
      settlement: 'SETTLEMENT',
    };

    this.document_uploading_config = {
      acceptedFiles: 'image/*,application/pdf',
      maxFilesize: 10,
      maxFiles: 1,
      url: ENVIRONMENT.service.document + '/docs',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': '',
        'X-Requested-With': ''
      }, init: function () {
        this.on('addedfile', function (file) {
          if (this.files.length > 1) {
            this.removeFile(this.files[0]);
          }
        });
      }
    };
    this.document_auth_uploading_config = {
      acceptedFiles: 'image/*,application/pdf',
      maxFilesize: 10,
      maxFiles: 1,
      url: ENVIRONMENT.service.document + '/docs/upload',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': '',
        'X-Requested-With': ''
      }, init: function () {
        this.on('addedfile', function (file) {
          if (this.files.length > 1) {
            this.removeFile(this.files[0]);
          }
        });
      }
    };
    this.document_uploading_config_with_upload_image = {
      acceptedFiles: 'image/*,application/pdf',
      maxFilesize: 10,
      maxFiles: 1,
      url: ENVIRONMENT.service.document + '/docs/upload',
      headers: {
        'Accept': 'application/json',
        'Authorization': this._authService.getBearerToken(),
        'Cache-Control': '',
        'X-Requested-With': ''
      }
    };

    this.tierAmount = {
      SG: [
        {
          name: 'Blue',
          amount: 0
        }, {
          name: 'Silver',
          amount: 5000
        }, {
          name: 'Gold',
          amount: 50000
        }, {
          name: 'Platinum',
          amount: 150000
        }, {
          name: 'Prestige',
          amount: 250000
        }
      ]
    };

    this.loanStatusesMapping = {
      accept: 'OFF-BRW-ACCEPT',
      offer: 'OFFER-SENT',
      ongoing: 'ONGOING',
      paid: 'PAID',
      reject: 'OFF-BRW-REJECT',
      default: 'DEFAULT'
    };

    this.invSignUpEvents = [
      'INV-register',
      'INV-personal-details',
      'INV-business',
      'INV-doc-upload',
      'INV-email-verified'
    ];

    this.invActivationEvents = [
      'INV-assessment',
      'INV-bank',
      'INV-sow',
      'INV-investor-data',
      'INV-tnc',
      'INV-deposit'
    ];

    this.invWalletEvents = [
      'INV-deposit',
      'INV-withdrawal',
      'INV-first-deposit',
      'INV-FPX-first-deposit',
      'INV-FPX-deposit'
    ];

    this.brwSignUpEvents = [
      'BRW-register',
      'BRW-personal',
      'BRW-business',
      'BRW-organization',
      'BRW-financials',
      'BRW-applicant',
      'BRW-doc-upload',
      'BRW-account-verified',
      'BRW-myinfo-signup'
    ];

    this.autoInvestEvents = [
      'aa-create',
      'aa-disable',
      'aa-delete'
    ];

    this.newLoanEvents = [
      'loan-details',
      'guarantor-details'
    ];

    this.sbnEvents = [
      'id-bond-landing-page',
      'id-bond-register-sid',
      'id-bond-register-sbn',
      'id-bond-order'
    ];

    this.homePagePromoBannerEvents = [
      'close-sticky-banner',
      'year-end-promo-carousel-more-info',
      'rocketman-carousel-more-info'
    ];

    this.icType = {
      SG: {
        id: 1,
        name: 'NRIC'
      },
      VN: {
        id: 1,
        name: 'NRIC'
      },
      ID: [
        { id: 3, name: 'KTP' },
        { id: 4, name: 'SIM' },
        { id: 5, name: 'NPWP' },
        { id: 6, name: 'Paspor' }
      ]
    };

    // MyInfo fixed attribute names
    // Do not modify the key or it won't work
    this.myInfo = {
      brwSelectedAttributes: ['name', 'sex', 'nationality', 'dob', 'mobileno', 'cpfbalances', 'employment',
        'cpfcontributions', 'assessableincome', 'assessyear', 'regadd', 'ownerprivate', 'residentialstatus'],
      borrowerAttributes: ['name', 'aliasname', 'sex', 'race', 'dob', 'residentialstatus', 'nationality', 'birthcountry',
        'mobileno', 'homeno', 'email', 'regadd', 'mailadd', 'billadd', 'assessableincome', 'assessyear', 'employment',
        'occupation', 'ownerprivate', 'cpfbalances', 'cpfcontributions'],
      investorAttributes: ['name', 'aliasname', 'sex', 'race', 'dob', 'residentialstatus', 'nationality', 'birthcountry',
        'mobileno', 'homeno', 'email', 'regadd', 'mailadd', 'billadd', 'assessableincome', 'assessyear', 'employment',
        'occupation', 'ownerprivate'],
      invSelectedAttributes: ['name', 'mobileno'],
    };

    this.refer_section = {
      SG: {
        name: 'signup',
        elementID: 'refer-signup-updates'
      }
    };

    this.max_loan_amount = {
      SG: {
        7: { // Business Term Loan
          maxAmount: 1500000,
          displayAmount: '$1,500,000',
        },
        8: { // Invoice Financing
          maxAmount: 1000000,
          displayAmount: '$1,000,000',
        },
        16: { // Secured Loan
          maxAmount: 3000000,
          displayAmount: '$3,000,000',
        },
        29: { // Revolver Loan
          maxAmount: 100000,
          displayAmount: '$100,000',
        },
        32: { // Revolver Loan
          maxAmount: 10000,
          displayAmount: '$10,000',
        }
      },
      MY: {
        6: { // Invoice Financing
          maxAmount: 1250000,
          displayAmount: 'RM1,250,000',
        },
        5: { // Business Term Financing
          maxAmount: 500000,
          displayAmount: 'RM500,000',
        },
        30: { // Business Term Financing
          maxAmount: 1000000,
          displayAmount: 'RM1,000,000',
        },
      },
      ID: {
        10: { // Pinjaman UKM
          maxAmount: 2000000000,
          displayAmount: 'Rp. 2M',
        },
        11: { // Invoice Financing
          maxAmount: 2000000000,
          displayAmount: 'Rp. 2M',
        },
        12: { // Revolver & MCA
          maxAmount: 10000000000,
          displayAmount: 'Rp. 10M',
        },
      },
    };

    this.employmentStatuses = {
      SG: [{
        id: 1,
        label: 'Employed',
        target: 'employment'
      }, {
        id: 2,
        label: 'Self-employed',
        target: 'business'
      }, {
        id: 3,
        label: 'Retired',
        target: 'past'
      }, {
        id: 4,
        label: 'Unemployed',
        target: 'past'
      }, {
        id: 5,
        label: 'Student',
        target: 'null'
      }],
      MY: [
        {
          id: 6,
          label: 'Employed',
        },
        {
          id: 7,
          label: 'Self-employed',
        },
        {
          id: 8,
          label: 'Retired/ Unemployed',
        },
        {
          id: 9,
          label: 'Housewife',
        },
        {
          id: 10,
          label: 'Student',
        }],
      VN: [{
        id: 18,
        label: 'Employed',
        target: 'employment'
      }, {
        id: 19,
        label: 'Self-employed',
        target: 'business'
      }, {
        id: 20,
        label: 'Retired',
        target: 'past'
      }, {
        id: 21,
        label: 'Unemployed',
        target: 'past'
      }, {
        id: 22,
        label: 'Student',
        target: 'null'
      }],
      ID: [{
        id: 11,
        label: 'Karyawan',
        target: 'employment'
      }, {
        id: 12,
        label: 'Wiraswasta',
        target: 'business'
      }, {
        id: 13,
        label: 'Pensiun',
        target: 'null'
      }, {
        id: 14,
        label: 'Tidak bekerja',
        target: 'null'
      }, {
        id: 15,
        label: 'Pelajar',
        target: 'null'
      }]
    };

    this.accreditedStatuses = {
      MY: [
        { id: 5, label: 'Not Accredited.' },
        { id: 6, label: 'Accredited based on annual income.' },
        { id: 7, label: 'Accredited based on net asset.' },
        { id: 8, label: 'Accredited based on annual income and net asset.' },
      ]
    };

    this.memberStatuses = [
      {
        id: 1,
        code: 'REG'
      }, {
        id: 2,
        code: 'BLK'
      }, {
        id: 3,
        code: 'REV'
      }];

    this.gracePeriodSetting = {
      SG: {
        dayPeriod: 7,
        productPrefix: ['SBBT', 'SBPL']
      },
      MY: {
        dayPeriod: 7,
        productPrefix: ['MBBT', 'MBIF']
      },
      ID: {
        dayPeriod: 5,
        productPrefix: ['ALL']
      },
      VN: {
        dayPeriod: 7,
        productPrefix: ['ALL']
      }
    };

    this.autoInvestmentLoyalty = {
      SG: {
        isSilver: ['SILVER', 'GOLD', 'PLATINUM', 'PRESTIGE'],
        isGoldAndAbove: ['GOLD', 'PLATINUM', 'PRESTIGE']
      },
      MY: {
        isSilver: ['SILVER', 'GOLD', 'PLATINUM', 'PRESTIGE'],
        isGoldAndAbove: ['GOLD', 'PLATINUM', 'PRESTIGE']
      },
      ID: {
        isSilver: ['SILVER', 'GOLD', 'PLATINUM', 'PRESTIGE'],
        isGoldAndAbove: ['GOLD', 'PLATINUM', 'PRESTIGE']
      },
      VN: {
        isSilver: ['SILVER', 'GOLD', 'PLATINUM', 'PRESTIGE'],
        isGoldAndAbove: ['GOLD', 'PLATINUM', 'PRESTIGE']
      }
    };

    this.memberEntityCode = {
      retail: 'RETAIL',
      accredited: 'ACCREDITED',
    };

    this.paymenStatusesList = {
      'early-paid': 'P.E.R',
      'late-repaid': 'LATE-REPAID',
      'miss': 'MISS',
      'over-paid': 'OVER-PAID',
      'paid': 'PAID',
      'partial-paid': 'PARTIAL-PAID',
      'revert': 'REVERT',
      'unpaid': 'UNPAID',
    };

    this.errorCode = {
      digisign: {
        invalidDocumentToSignObject: 42220001013,
        accountNotRegistered: 42220001005,
        documentToSignRetrievalFailed: 42220001016
      }
    };

    this.investmentProfile = {
      SG: [
        {
          name: 'conservative',
          id: '1'
        },
        {
          name: 'balanced',
          id: '2'
        },
        {
          name: 'aggressive',
          id: '3'
        },
      ]
    };

    this.productGroupId = {
      ID: {
        businessTermLoan: 10
      }
    }

    this.scrollTelorance = 10;

    this.loanSimulationParameters = {
      ID: {
        tenorLengthDividerByTenorType: {
          1: 360,
          7: 52,
          30: 12,
        },
      },
      SG: {
        tenorLengthDividerByTenorType: {
          1: 365,
          7: 52,
          30: 12,
        },
      },
      VN: {
        tenorLengthDividerByTenorType: {
          1: 365,
          7: 52,
          30: 12,
        },
      },
      MY: {
        tenorLengthDividerByTenorType: {
          1: 365,
          7: 52,
          30: 12,
        },
      }
    };

    this.accountVerificationStepDetail = {
      label: 'ACCOUNT_VERIFICATION',
      key: 9999
    };
    this.autoInvestmentInterestRateRange = {
      ID: {
        max: 100
      }
    };
  }

  getErrorCode() {
    return this.errorCode;
  }

  getAgreementStep() {
    return this.agreementStep[CONFIGURATION.country_code];
  }

  getInvestorOnboardingStep() {
    return this.investorOnboardingStep[CONFIGURATION.country_code];
  }

  getBorrowerOnboardingStep() {
    return this.borrowerOnboardingStep[CONFIGURATION.country_code];
  }

  getInvestorAgreementStep() {
    return this.investorAgreementStep[CONFIGURATION.country_code];
  }

  getInvestorAgreementStepWithAuthorizationConsent() {
    return this.investorAgreementStepWithAuthorizationConsent[CONFIGURATION.country_code];
  }

  getInterestRate() {
    return this.interest_rate[CONFIGURATION.country_code];
  }

  getDocumentUploadingSortList() {
    return this.document_uploading_sort[CONFIGURATION.country_code];
  }

  getDocumentUploadingConfig() {
    const token = this._authService.getBearerToken();
    let documentUploadingConfig = this.document_uploading_config;
    if (token) {
      documentUploadingConfig.headers['Authorization'] = 'Bearer ' + token;
    }
    return documentUploadingConfig;
  }
  getAuthenticatedDocumentUploadingConfig() {
    const token = this._authService.getBearerToken();
    let documentUploadingConfig = this.document_auth_uploading_config;
    if (token) {
      documentUploadingConfig.headers['Authorization'] = 'Bearer ' + token;
    }
    return documentUploadingConfig;
  }
  getDocumentUploadingConfigWithUploadImage() {
    const token = this._authService.getBearerToken();
    let documentUploadingConfig = this.document_uploading_config_with_upload_image;
    if (token) {
      documentUploadingConfig.headers['Authorization'] = 'Bearer ' + token;
    }
    return documentUploadingConfig;
  }

  getLoanStatusesMapping() {
    return this.loanStatusesMapping;
  }

  getCountryList() {
    return this.country_list;
  }

  getLoanStages() {
    const loanStages = {
      origination: 1,
      underwriting: 2,
      offer: 3,
      funding: 4,
      settlement: 5,
    };
    return loanStages;
  }

  getLoanStatuses() {
    const loanStatuses = {
      underwritingApprove: 24,
      ongoing: 38
    };
    return loanStatuses;
  }

  getLoanFilterStatus() {
    return this.loan_status_filter;
  }

  getNewLoanEvents(): Array<string> {
    return this.newLoanEvents;
  }

  getInvSignUpEvents(): Array<string> {
    return this.invSignUpEvents;
  }

  getHomePagePromoEvents(): Array<string> {
    return this.homePagePromoBannerEvents;
  }

  getInvActivationEvents(): Array<string> {
    return this.invActivationEvents;
  }

  getBrwSignUpEvents(): Array<string> {
    return this.brwSignUpEvents;
  }

  getSbnEvents(): Array<string> {
    return this.sbnEvents;
  }

  getAutoInvestEvents(): Array<string> {
    return this.autoInvestEvents;
  }

  getInvWalletEvents(): Array<string> {
    return this.invWalletEvents;
  }

  getICType() {
    return this.icType[CONFIGURATION.country_code];
  }

  getMyInfoAttributes(memberType) {
    return this.myInfo[`${memberType}Attributes`];
  }

  getMyInfoSelectedAttributes(memberType) {
    return this.myInfo[`${memberType.toLowerCase()}SelectedAttributes`];
  }

  getReferSection() {
    return this.refer_section[CONFIGURATION.country_code];
  }

  getMaxLoanAmount() {
    return this.max_loan_amount[CONFIGURATION.country_code];
  }

  getLoanStageName() {
    return this.loanStagesName;
  }

  getEmploymentStatuses() {
    return this.employmentStatuses[CONFIGURATION.country_code];
  }

  getAutoInvestmentSetting() {
    return this.autoInvestmentSetting[CONFIGURATION.country_code];
  }

  getAccreditedBasedOnAnnualIncomeId() {
    return this.accreditedBasedOnAnnualIncomeId[CONFIGURATION.country_code];
  }

  getAccreditedDefaultValue() {
    return this.accreditedDefaultValue[CONFIGURATION.country_code];
  }

  getAccreditedStatuses() {
    return this.accreditedStatuses[CONFIGURATION.country_code];
  }

  getMobileOperatingSystem() {
    return this.mobileOperatingSystem;
  }

  getAccountVerificationStepDetail() {
    return this.accountVerificationStepDetail;
  }

  getEmploymentAnnualRevenueList() {
    this._translateService
      .get('form.source-of-wealth.annual-revenue-wording')
      .subscribe(
        annualRevenueWording => {
          const below = annualRevenueWording.below;
          const above = annualRevenueWording.above;
          this.employeementAnnualRevenueList = {
            MY: [ // Using this value for net worth as well
              { value: `${below} RM20,000.00`, angelInvestorFlag: false },
              { value: 'RM20,000.00 - RM40,000.00', angelInvestorFlag: false },
              { value: 'RM40,000.00 - RM60,000.00', angelInvestorFlag: false },
              { value: 'RM60,000.00 - RM80,000.00', angelInvestorFlag: false },
              { value: 'RM80,000.00 - RM100,000.00', angelInvestorFlag: false },
              { value: 'RM100,000.00 - RM150,000.00', angelInvestorFlag: false },
              { value: 'RM150,000.00 - RM200,000.00', angelInvestorFlag: false },
              { value: 'RM200,000.00 - RM300,000.00', angelInvestorFlag: false },
              { value: 'RM300,000.00 - RM500,000.00', angelInvestorFlag: false },
              { value: 'RM500,000.00 - RM1,000,000.00', angelInvestorFlag: false },
              { value: `RM1,000,000.00 and ${above}`, angelInvestorFlag: true }
            ],
            SG: [
              { value: `${below} SGD20,000.00`, angelInvestorFlag: false },
              { value: 'SGD20,000.00 - SGD40,000.00', angelInvestorFlag: false },
              { value: 'SGD40,000.00 - SGD60,000.00', angelInvestorFlag: false },
              { value: 'SGD60,000.00 - SGD80,000.00', angelInvestorFlag: false },
              { value: 'SGD80,000.00 - SGD100,000.00', angelInvestorFlag: false },
              { value: 'SGD100,000.00 - SGD150,000.00', angelInvestorFlag: false },
              { value: 'SGD150,000.00 - SGD200,000.00', angelInvestorFlag: false },
              { value: 'SGD200,000.00 - SGD300,000.00', angelInvestorFlag: false },
              { value: `${above} SGD300,000.00`, angelInvestorFlag: true }
            ],
            VN: [
              { value: `${below} VND20,000.00`, angelInvestorFlag: false },
              { value: 'VND20,000.00 - VND40,000.00', angelInvestorFlag: false },
              { value: 'VND40,000.00 - VND60,000.00', angelInvestorFlag: false },
              { value: 'VND60,000.00 - VND80,000.00', angelInvestorFlag: false },
              { value: 'VND80,000.00 - VND100,000.00', angelInvestorFlag: false },
              { value: 'VND100,000.00 - VND150,000.00', angelInvestorFlag: false },
              { value: 'VND150,000.00 - VND200,000.00', angelInvestorFlag: false },
              { value: 'VND200,000.00 - VND300,000.00', angelInvestorFlag: false },
              { value: `${above} VND300,000.00`, angelInvestorFlag: true }
            ]
          };
        }
      );
    return this.employeementAnnualRevenueList[CONFIGURATION.country_code];
  }

  getTierAmount() {
    return this.tierAmount[CONFIGURATION.country_code];
  }

  getMemberEntityTypeId() {
    return this.memberEntityTypeId;
  }

  getOtherWealthAmountlist(countryCode: string) {
    this._translateService
      .get('form.source-of-wealth.annual-revenue-wording')
      .subscribe(
        annualRevenueWording => {
          const below = annualRevenueWording.below;
          const above = annualRevenueWording.above;
          this.employeementAnnualRevenueList = {
            MY: [
              { value: `${below} RM20,000.00`, angelInvestorFlag: false },
              { value: 'RM20,000.00 - RM40,000.00', angelInvestorFlag: false },
              { value: 'RM40,000.00 - RM60,000.00', angelInvestorFlag: false },
              { value: 'RM60,000.00 - RM80,000.00', angelInvestorFlag: false },
              { value: 'RM80,000.00 - RM100,000.00', angelInvestorFlag: false },
              { value: 'RM100,000.00 - RM150,000.00', angelInvestorFlag: false },
              { value: 'RM150,000.00 - RM200,000.00', angelInvestorFlag: false },
              { value: 'RM200,000.00 - RM300,000.00', angelInvestorFlag: false },
              { value: `${above} RM300,000.00`, angelInvestorFlag: true }
            ],
            SG: [
              { value: `${below} SGD1M`, angelInvestorFlag: false },
              { value: 'SGD1M - SGD2M', angelInvestorFlag: true },
              { value: 'SGD2M - SGD3M', angelInvestorFlag: true },
              { value: `${above} SGD3M`, angelInvestorFlag: true }
            ],
            VN: [
              { value: `${below} VND1M`, angelInvestorFlag: false },
              { value: 'VND1M - VND2M', angelInvestorFlag: true },
              { value: 'VND2M - VND3M', angelInvestorFlag: true },
              { value: `${above} VND3M`, angelInvestorFlag: true }
            ]
          };
        }
      );
    return this.employeementAnnualRevenueList[countryCode];
  }

  getTransferTypes(countryCode: string) {
    return this.transferTypes[countryCode];
  }

  getMemberStatuses() {
    return this.memberStatuses.slice(0);
  }

  getGracePeriodSetting() {
    return this.gracePeriodSetting[CONFIGURATION.country_code];
  }

  getAutoInvestmentLoyalty() {
    return this.autoInvestmentLoyalty[CONFIGURATION.country_code];
  }

  getMemberEntityCode() {
    return this.memberEntityCode;
  }

  getBankIdList() {
    return this.bankIdList;
  }

  getPaymentStatusesList() {
    return this.paymenStatusesList;
  }

  getInvestmentProfile() {
    return this.investmentProfile[CONFIGURATION.country_code];
  }

  getScrollTolerance() {
    return this.scrollTelorance;
  }

  getProductGroupId() {
    return this.productGroupId[CONFIGURATION.country_code];
  }

  getLoanSimulationParameters() {
    return this.loanSimulationParameters[CONFIGURATION.country_code];
  }

  getOtherIdCardId() {
    return this.other_id_card_id[CONFIGURATION.country_code];
  }

  getAutoInvestmentInterestRateRange() {
    return this.autoInvestmentInterestRateRange;
  }
}
