// SERVE: `ng serve --env=production`
// BUILD: `ng build --aot --env=production && npm run minify`

export const ENVIRONMENT = {
  version: '{BUILD_VERSION}',
  baseUrls: {
    id: ['new.modalku.co.id', 'modalku.co.id', 'www.modalku.co.id'],
    my: ['new.fundingsocieties.com.my', 'fundingsocieties.com.my', 'www.fundingsocieties.com.my'],
    sg: ['new.fundingsocieties.com', 'fundingsocieties.com', 'www.fundingsocieties.com', 'fundingsocieties.co', 'www.fundingsocieties.co'],
    vn: ['new.fundingsocieties.com', 'vn.fundingsocieties.com', 'www.fundingsocieties.com'],
  },
  environment_name: 'production',
  enableSendingMixPanelEvents: true,
  sentry_logging: true,
  firebase: {
    apiKey: 'AIzaSyDJnlv8NCKpWZBaedcMXL7UQszOy3Z9ojc',
    databaseURL: 'https://alice-writes-web-3.firebaseio.com',
    projectId: 'alice-writes-web-3'
  },
  google: {
    map_api_key: 'AIzaSyChLdirr8WHATQQaj8W-YYjNo26Hgzfsf'
  },
  myinfo: {
    borrower : {
      clientId : 'PROD-201505169M-BORROWER',
    },
    investor : {
      clientId: 'PROD-201505169M-INVESTOR',
    },
    callbackUrl: 'https://fundingsocieties.com/myinfo_callback'
  },
  governmentBondTradeable: {
    link: 'https://fitsonline.binaartha.com/'
  },
  production: true,
  boltLinkXero: 'https://fsbolt.com/web/business-information',
  yearInReviewLink: 'https://yearinreview.fundingsocieties.com',
  service: {
    authentication: 'https://api.fundingasiagroup.com',
    bond: 'https://api.fundingasiagroup.com/api/v1/esbn',
    crowdfunding: 'https://api.fundingasiagroup.com/api/cfp',
    document: 'https://api.fundingasiagroup.com/api/docs_management/v2',
    finance: 'https://api.fundingasiagroup.com/api/fs',
    financeV2: 'https://api.fundingasiagroup.com/api/fs/v2',
    finance_public: 'https://api.fundingasiagroup.com/api/fs/p',
    loan: 'https://api.fundingasiagroup.com/api/ln',
    loanV2: 'https://api.fundingasiagroup.com/api/ln/v2',
    look_up: 'https://api.fundingasiagroup.com/api/lu',
    loyalty: 'https://api.fundingasiagroup.com/api/v1/loyalty',
    member: 'https://api.fundingasiagroup.com/api/ms',
    memberV2: 'https://api.fundingasiagroup.com/api/v2/members',
    note: 'https://api.fundingasiagroup.com/api/ns',
    two_fa: 'https://api.fundingasiagroup.com/api/2fa',
    public_identifier: '/p',
    v2: 'https://api.fundingasiagroup.com/api/v2',
    slack: 'https://microloan.fundingasiagroup.com/slack/send',
    payment_service: 'https://api.fundingasiagroup.com/api/ps',
    curlec_payment: 'https://mydd.mydirectdebit.my/new-instant-pay',
    myinfo: 'https://myinfosg.api.gov.sg/v2',
  },
  launch_darkly_client_id:'5da027bac00cf208a28289f4'
};
