const myConfiguration = {
  name: 'Funding Societies Malaysia',
  email: 'info@fundingsocieties.com.my',
  country_code: 'MY',
  country_name: 'Malaysia',
  currency: 'MYR - Malaysia Ringgit',
  currency_code: 'MYR',
  currency_symbol: 'RM',
  enableLoyaltyProgram: false,
  encryption_key: 'FS-MY',
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
  investorExposure: {
    investorExposureFirstWarningLimit: 48000,
    investorExposureSecondWarningLimit: 50000,
  },
  institution_id: 21,
  language: 'en',
  supportedLanguages: ['en', 'zh'],
  mobileAppUrl: {
    investor: {
      googlePlay: 'https://smart.link/5b34775dccfd5',
      appStore: 'https://smart.link/5b3476528f546'
    },
    borrower: {
      googlePlay: 'https://play.google.com/store/apps/details?id=com.fundingsocieties.borrower&hl=en',
    }
  },
  meta: {
    image: '/assets/img/icon/logo.png',
    og_type: 'information',
    twitter_card: 'summary_large_image',
    twitter_site: '@FundSocietiesMy'
  },
  borrower_referral_email: {
    show: true,
    email: 'info@fundingsocieties.com.my'
  },
  intercom: {
    enable: true,
    appId: 'bmqdkdd5',
    hashCode: 'ejuNDAdSStdRGRexV2cjc7LjRSyMcqA_6ylDa4N7'
  },
  googleMap: {
    initialPositionLat: 3.11075,
    initialPositionLong: 101.666427,
    officePositionLat: 3.110751,
    officePositionLong: 101.666427,
  },
  portfolio: {
    showTaxField: true
  },
  browseLoan: {
    showOptOut: true,
    powerOfAttorney: false,
    riskDisclosureStatement: false,
    suitabilityAssessmentTest: false,
    blog: 'https://blog.fundingsocieties.com.my?utm_source=mainsite&utm_medium=organic'
  },
  google_tag_manager_id: 'GTM-MT6NPNC',
  sendgrid_template: {
    investor_twoFa_email_template_id: 'dc555571-20f2-413d-b335-f9b1c0eab4f2',
    borrower_twoFa_email_template_id: 'dc555571-20f2-413d-b335-f9b1c0eab4f2',
    borrower_email_template_id: '',
    investor_email_template_id: ''
  },
  referralLink: {
    borrower: window.location.origin + '/sign-up-borrower?referral=',
    investor: 'http://promo.fundingsocieties.com.my/referral-program/?r='
  },
  image_base_url: 'assets/img/MY',
  phone_prefix: '+60',
  reference: {
    intercom_help: 'http://intercom.help/funding-societies-malaysia',
    intercom_help_borrower: 'http://intercom.help/funding-societies-malaysia',
    intercom_help_investor: 'http://intercom.help/funding-societies-malaysia'
  },
  story: 'https://blog.fundingsocieties.com.my/our-story?utm_source=mainsite&utm_medium=organic',
  blog: 'https://blog.fundingsocieties.com.my?utm_source=mainsite&utm_medium=organic',
  learningCenter: 'https://blog.fundingsocieties.com.my/learning-center?utm_source=mainsite&utm_medium=organic',
  minimizingRiskArticle: '',
  maximizingInvestmentArticle: '',
  mediapress: 'https://blog.fundingsocieties.com.my/category/company-news-and-events?utm_source=mainsite&utm_medium=organic',
  facebook: 'https://www.facebook.com/fundingsocietiesmalaysia/',
  linkedin: 'https://www.linkedin.com/company/funding-societies-malaysia',
  twitter: 'https://twitter.com/fundsocietiesmy',
  // Navigation configurations
  referProgram: true,
  help: true,
  digisign: {
    loan: false,
  },
  showPartner: false,
  showInvestorExposureBanner: true,
  showInvestorAccreditedDeclarationBanner: false,
  showAddBankAccount: true,
  showTaxInvoice: false,
  showPrivacyNoticeInvoiceFinancing: false,
  showPrivacyNoticeMalay: true,
  showPrivacyNotice: false,
  zoho_leads_owner: null,
  zoho_leads_owner_id: null,
  zoho_leads_source: 'Website Homepage Form',
  zoho_leads_source_signup: 'FS Website',
  crowdfundtalkLinkActivation: 'https://crowdfundtalks.com/?utm_source=fsmy_investor',
  wootricToken: 'NPS-e7eb8c13',
  boltLinkBorrowPage: 'https://fsbolt.com/web/my?utm_source=website&utm_medium=landing_page_borrow',
  applyBoltBorrowPage: 'https://fsbolt.com/web/my/business-information?utm_source=website&utm_medium=landing_page_borrow',
  crowdfundtalkLinkFooter: 'https://crowdfundtalks.com/?utm_source=my_footer',
  showCrowdfundtalk: true,
  disclosureNoticeLink: 'https://landing.fundingsocieties.com/membership/my/disclosure-notice.html',
  showDisclosureNotice: true,
  infoEmail: 'info@fundingsocieties.com.my',
  enable2Fa: true,
  enable2FaLogin: false,
  learnMoreAALink: 'https://intercom.help/funding-societies-malaysia/articles/2428667-auto-invest-error-messages-explained',
  enableWootric: true,
  zendesk: {
    enable: false,
    key: '',
  },
  showLegalPopup: true,
  passportExpiredMonthLimit: 6,
  careerBambooHRLink: 'https://fsmk.bamboohr.com/jobs/',
  enableRestructuredLoan: false,
  websiteTermsAndConditionPdf: '/assets/legal/FSMY Website Terms.pdf',
  authorizationConsent: {
    websiteLink: 'www.fundingsocieties.com.my'
  },
  investEmail: 'invest@fundingsocieties.com',
  prioritySettings: {
    products: [
      {
        id : 'notified_invoice_financing',
        title: 'form.setting-priority-investment.right-form.product_names.notified-Invoice-financing',
        interestRateText: '10-16%',
        tenorText: '30-120',
        notePercent: 1,
        productId: 7,
        interestRate: {
          min: 10,
          max: 16
        },
        tenor: {
          min: 30,
          max: 120
        },
      },
      {
        id : 'dealer_financing',
        title: 'form.setting-priority-investment.right-form.product_names.dealer-financing',
        interestRateText: '12%',
        tenorText: '90',
        notePercent: 5,
        productId: 28,
        interestRate: {
          min: 12,
          max: 12
        },
        tenor: {
          min: 90,
          max: 90
        },
      }
    ]
  },
  websitePrivacyNoticePdf: '/assets/legal/Privacy Notice (MY).pdf',
  websitePrivacyNoticeBmPdf: '/assets/legal/Privacy Notice BM (MY).pdf',
  dateRestrictions: {
    passportExpiry: 6
  },
  modalPromoBanner: false,
  showICNumberText: false,
};

export default myConfiguration;
