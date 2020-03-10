const idConfiguration = {
  name: 'Modalku',
  email: 'info@modalku.co.id',
  country_code: 'ID',
  country_name: 'Indonesia',
  currency: 'IDR - Indonesia Rupiah',
  currency_code: 'IDR',
  currency_symbol: 'Rp',
  enableLoyaltyProgram: false,
  encryption_key: 'MK-ID',
  header_logo_classname_prefix: 'mk',
  header_vertical_logo_classname_prefix: 'mk',
  // Temporary remove -> Search for first-deposit-message to enable again
  format: {
    date: 'y-MM-dd',
    date_time: 'y-MM-dd HH:mm:ss',
    activity_date_time: 'MMM dd y HH:mm',
    decimal: '1.2-2',
    decimal_separator: ',',
    thousands_separator: '.',
    locale: 'id'
  },
  institution_id: 11,
  language: 'id',
  supportedLanguages: ['en', 'id'],
  mobileAppUrl: {
    investor: {
      googlePlay: 'https://smart.link/5b3478f63ff40',
      appStore: 'https://smart.link/5b3479991fbd0'
    },
    borrower: {
      googlePlay: 'https://play.google.com/store/apps/details?id=id.co.modalku.danacepat',
    }
  },
  meta: {
    image: '/assets/img/icon/logo.png',
    og_type: 'information',
    twitter_card: 'summary_large_image',
    twitter_site: '@modalkuid'
  },
  browseLoan: {
    showOptOut: true,
    powerOfAttorney: true,
    riskDisclosureStatement: false,
    suitabilityAssessmentTest: false,
    blog: 'https://blog.modalku.co.id'
  },
  image_base_url: 'assets/img/ID',
  phone_prefix: '+62',
  reference: {
    intercom_help: '',
    intercom_help_borrower: '',
    intercom_help_investor: ''
  },
  va_detail: {
    VA_bank: 'Sinarmas',
    VA_bank_bca: 'Bank Central Asia',
    VA_bank_bca_id: '12999 ',
    VA_branch: 'KCU Thamrin',
    VA_name: 'MDKU QQ',
    VA_id: '8299',
  },
  portfolio: {
    showTaxField: false
  },
  borrower_referral_email: {
    show: false,
    email: ''
  },
  intercom: {
    enable: false,
    appId: 'b3usbkt8',
    hashCode: 'dgMyVbgFO_8hD3hvVc95ase7LLcp7xrMrsGKOUXB'
  },
  googleMap: {
    initialPositionLat: -6.17511,
    initialPositionLong: 106.8650395,
    officePositionLat: -6.1686516,
    officePositionLong: 106.7640952,
  },
  google_tag_manager_id: 'GTM-KL3HMW',
  sendgrid_template: {
    investor_twoFa_email_template_id: '203d20e8-1fb0-4981-b5fd-07ae907c00b6',
    borrower_twoFa_email_template_id: '203d20e8-1fb0-4981-b5fd-07ae907c00b6',
    borrower_email_template_id: '44106b83-8d0d-4539-b9c7-0bce2f3ffe33',
    investor_email_template_id: 'e8ecb763-ef89-4f4c-85b9-ac791e901511'
  },
  referralLink: {
    borrower: window.location.origin + '/sign-up/borrower?referral=',
    investor: window.location.origin + '/sign-up/investor?referral='
  },
  blog: 'https://blog.modalku.co.id',
  learningCenter: 'http://blog.modalku.co.id/learning-center/',
  minimizingRiskArticle: '',
  maximizingInvestmentArticle: '',
  mediapress: 'https://blog.modalku.co.id/category/apa-kabar-modalku',
  facebook: 'https://www.facebook.com/modalkuid/',
  linkedin: 'https://www.linkedin.com/company/modalku',
  twitter: 'https://twitter.com/modalkuid',
  // Navigation configurations
  referProgram: false,
  help: false,
  digisign: {
    loan: true,
  },
  showPartner: false,
  showInvestorExposureBanner: false,
  showInvestorAccreditedDeclarationBanner: false,
  showAddBankAccount: false,
  showTaxInvoice: false,
  showPrivacyNoticeInvoiceFinancing: false,
  showPrivacyNoticeMalay: false,
  showPrivacyNotice: true,
  zoho_leads_owner: null,
  zoho_leads_owner_id: null,
  zoho_leads_source: null,
  wootricToken: 'NPS-44fd5589',
  showCrowdfundtalk: false,
  showDisclosureNotice: false,
  enable2Fa: true,
  enable2FaLogin: false,
  zohoLeadsOwnerBorrow: [
    { id: '2747047000003599004', email: 'ali.afrijal@modalku.co.id' },
    { id: '2747047000007323014', email: 'sandy.christian@modalku.co.id' },
  ],
  leadAmountSetting: 500000000,
  infoEmail: 'layanan@modalku.co.id',
  learnMoreAALink: '',
  enableWootric: true,
  zendesk: {
    enable: true,
    key: '85c1b1a5-2bb6-4dc2-ba14-2b21ad6baa9a',
  },
  showLegalPopup: false,
  passportExpiredMonthLimit: 6,
  careerBambooHRLink: 'https://fsmk.bamboohr.com/jobs/',
  enableRestructuredLoan: false,
  websiteTermsAndConditionPdf: '',
  dateRestrictions: {
    passportExpiry: 6
  },
  modalPromoBanner: true,
  showICNumberText: true,
};

export default idConfiguration;
