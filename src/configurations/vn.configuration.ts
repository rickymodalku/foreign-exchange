const vnConfiguration = {
  name: 'Funding Societies Vietnam',
  email: 'info@fundingsocieties.com',
  country_code: 'VN',
  country_name: 'Vietnam',
  currency: 'VND - Vietnam Dong',
  currency_code: 'VND',
  currency_symbol: 'S$',
  enableLoyaltyProgram: true,
  encryption_key: 'FS-SG',
  header_logo_classname_prefix: 'funding-societies',
  header_vertical_logo_classname_prefix: 'funding-societies-vertical',
  format: {
    date: 'y-MM-dd',
    date_time: 'y-MM-dd HH:mm:ss',
    activity_date_time: 'MMM dd y HH:mm',
    decimal: '1.2-2',
    decimal_separator: '.',
    thousands_separator: ',',
    locale: 'en'
  },
  borrower_referral_email: {
    show: true,
    email: 'refer@fundingsocieties.com'
  },
  portfolio: {
    showTaxField: false
  },
  institution_id: 1,
  language: 'en',
  supportedLanguages: ['vi', 'en'],
  mobileAppUrl: {
    investor: {
      googlePlay: 'https://smart.link/5b34775dccfd5',
      appStore: 'https://smart.link/5b3476528f546'
    },
    borrower: {
      googlePlay: 'https://smart.link/5b34775dccfd5',
      appStore: 'https://smart.link/5b3476528f546'
    }
  },
  meta: {
    image: '/assets/img/icon/logo.png',
    og_type: 'information',
    twitter_card: 'summary_large_image',
    twitter_site: '@FundSocieties'
  },
  googleMap: {
    initialPositionLat: 1.3553794,
    initialPositionLong: 103.8677444,
    officePositionLat: 1.3004,
    officePositionLong: 103.8508,
  },
  google_tag_manager_id: 'GTM-52WRXTG',
  intercom: {
    enable: true,
    appId: 'pqkn8tj3',
    hashCode: 'D22g6nTLVMTkrWe6SbsZf4eMIpXNUCmOgA2lqwQy'
  },
  sendgrid_template: {
    investor_twoFa_email_template_id: 'ac59f5d5-7341-4bf8-89d8-09751f1acc97',
    borrower_twoFa_email_template_id: 'ac59f5d5-7341-4bf8-89d8-09751f1acc97',
    borrower_email_template_id: '',
    investor_email_template_id: ''
  },
  referralLink: {
    borrower: window.location.origin + '/sign-up-borrower?referral=',
    investor: window.location.origin + '/sign-up-investor?referral='
  },
  browseLoan: {
    showOptOut: true,
    powerOfAttorney: false,
    riskDisclosureStatement: false,
    suitabilityAssessmentTest: false,
    blog: 'https://blog.fundingsocieties.com?utm_source=mainsitesg&utm_medium=investpage'
  },
  image_base_url: 'assets/img/SG',
  phone_prefix: '+84',
  reference: {
    intercom_help: 'https://help.fundingsocieties.com',
    intercom_help_borrower: 'https://help.fundingsocieties.com/borrowers',
    intercom_help_investor: 'https://help.fundingsocieties.com/investors'
  },
  story: 'https://blog.fundingsocieties.com/our-story?utm_source=mainsite&utm_medium=organic',
  blog: 'https://blog.fundingsocieties.com?utm_source=mainsite&utm_medium=organic',
  learningCenter: 'https://blog.fundingsocieties.com/learning-center?utm_source=mainsite&utm_medium=organic',
  minimizingRiskArticle: '',
  maximizingInvestmentArticle: '',
  mediapress: 'https://blog.fundingsocieties.com/press?utm_source=mainsite&utm_medium=organic',
  facebook: 'https://www.facebook.com/fundingsocieties/',
  linkedin: 'https://www.linkedin.com/company/funding-societies',
  twitter: 'https://twitter.com/fundsocieties',
  // Navigation configurations
  referProgram: true,
  help: true,
  digisign: {
    loan: false,
  },
  showPartner: true,
  showInvestorExposureBanner: false,
  showInvestorAccreditedDeclarationBanner: false,
  showPrivacyNoticeInvoiceFinancing: true,
  showPrivacyNoticeMalay: false,
  showAddBankAccount: false,
  showTaxInvoice: true,
  showPrivacyNotice: true,
  zoho_leads_owner: null,
  zoho_leads_owner_id: null,
  zoho_leads_source: null,
  wootricToken: 'NPS-8c7383f1',
  boltLinkBorrowPage: 'https://fsbolt.com?utm_source=website&utm_medium=landing_page_borrow',
  applyBoltBorrowPage: 'https://fsbolt.com/web/business-information?utm_source=website&utm_medium=landing_page_borrow',
  crowdfundtalkLinkActivation: 'https://crowdfundtalks.com/?utm_source=fssg_investor',
  crowdfundtalkLinkFooter: 'https://crowdfundtalks.com/?utm_source=sg_footer',
  showCrowdfundtalk: true,
  showDisclosureNotice: false,
  infoEmail: 'info@fundingsocieties.com',
  enable2Fa: true,
  learnMoreAALink: '',
  zendesk: {
    enable: false,
    key: '',
  },
  passportExpiredMonthLimit: 6,
  careerBambooHRLink: 'https://fsmk.bamboohr.com/jobs/',
  enableRestructuredLoan: false,
  dateRestrictions: {
    passportExpiry: 6
  },
  modalPromoBanner: true,
  showICNumberText: true,
};

export default vnConfiguration;
