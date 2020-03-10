// SERVE: `ng serve --env=uat`
// BUILD: `ng build --aot --env=uat && npm run minify`

export const ENVIRONMENT = {
  version: '{BUILD_VERSION}',
  baseUrls: {
    id: ['localhost:4200', 'v3uat.modalku.co.id', 'xyz.modalku.co.id'],
    my: ['localhost:4300', 'v3uat.fundingsocieties.com.my', 'xyz.fundingsocieties.com.my'],
    sg: ['localhost:4400', 'v3uat.fundingsocieties.com', 'xyz.fundingsocieties.com']
  },
  environment_name: 'uat',
  enableSendingMixPanelEvents: false,
  sentry_logging: false,
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
      clientId : 'STG-201505169M-BORROWER',
    },
    investor : {
      clientId: 'STG-201505169M-INVESTOR',
    },
    callbackUrl: 'https://v3staging.fundingsocieties.com/myinfo_callback'
  },
  governmentBondTradeable: {
    link: 'http://167.99.72.93/'
  },
  production: true,
  boltLinkXero: 'https://web-uat.fsbolt.com/web/business-information',
  yearInReviewLink: 'https://staging-yearinreview.fundingsocieties.com',
  service: {
    authentication: 'https://uat.fundingasiagroup.com',
    bond: 'https://uat.fundingasiagroup.com/api/v1/esbn',
    crowdfunding: 'https://uat.fundingasiagroup.com/api/cfp',
    document: 'https://uat.fundingasiagroup.com/api/docs_management/v2',
    finance: 'https://uat.fundingasiagroup.com/api/fs',
    financeV2: 'https://uat.fundingasiagroup.com/api/fs/v2',
    finance_public: 'https://uat.fundingasiagroup.com/api/fs/p',
    loan: 'https://uat.fundingasiagroup.com/api/ln',
    loanV2: 'https://uat.fundingasiagroup.com/api/ln/v2',
    look_up: 'https://uat.fundingasiagroup.com/api/lu',
    loyalty: 'https://uat.fundingasiagroup.com/api/v1/loyalty',
    member: 'https://uat.fundingasiagroup.com/api/ms',
    memberV2: 'https://uat.fundingasiagroup.com/api/v2/members',
    note: 'https://uat.fundingasiagroup.com/api/ns',
    two_fa: 'https://uat.fundingasiagroup.com/api/2fa',
    public_identifier: '/p',
    v2: 'https://uat.fundingasiagroup.com/api/v2',
    slack: 'https://microloan.fundingasiagroup.com/slack/send',
    payment_service: 'https://uat.fundingasiagroup.com/api/ps',
    curlec_payment: 'https://mydd.mydirectdebit.my/new-instant-pay',
    myinfo: 'https://myinfosgstg.api.gov.sg/test/v2'
  },
  launch_darkly_client_id:'5da02810c00cf208a2828a05'
};
