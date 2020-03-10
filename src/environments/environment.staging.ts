// SERVE: `ng serve --env=staging`
// BUILD: `ng build --aot --env=staging && npm run minify`
export const ENVIRONMENT = {
  version: '{BUILD_VERSION}',
  baseUrls: {
    id: ['v3staging.modalku.co.id', 'v3staging-app.modalku.co.id', 'lpfstaging.modalku.co.id'],
    my: ['v3staging.fundingsocieties.com.my', 'v3staging-app.fundingsocieties.com.my', 'lpfstaging.fundingsocieties.com.my'],
    sg: ['v3staging.fundingsocieties.com', 'v3staging-app.fundingsocieties.com', 'lpfstaging.fundingsocieties.com'],
    vn: ['vnv3staging.fundingsocieties.com', 'vnv3staging-app.fundingsocieties.com'],
  },
  environment_name: 'staging',
  enableSendingMixPanelEvents: false,
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
  boltLinkXero: 'https://web-staging.fsbolt.com/web/business-information',
  yearInReviewLink: 'https://staging-yearinreview.fundingsocieties.com',
  service: {
    authentication: 'https://staging.fundingasiagroup.com',
    bond: 'https://staging.fundingasiagroup.com/api/v1/esbn',
    crowdfunding: 'https://staging.fundingasiagroup.com/api/cfp',
    document: 'https://staging.fundingasiagroup.com/api/docs_management/v2',
    finance: 'https://staging.fundingasiagroup.com/api/fs',
    financeV2: 'https://staging.fundingasiagroup.com/api/fs/v2',
    finance_public: 'https://staging.fundingasiagroup.com/api/fs/p',
    loan: 'https://staging.fundingasiagroup.com/api/ln',
    loanV2: 'https://staging.fundingasiagroup.com/api/ln/v2',
    look_up: 'https://staging.fundingasiagroup.com/api/lu',
    loyalty: 'https://staging.fundingasiagroup.com/api/v1/loyalty',
    member: 'https://staging.fundingasiagroup.com/api/ms',
    memberV2: 'https://staging.fundingasiagroup.com/api/v2/members',
    note: 'https://staging.fundingasiagroup.com/api/ns',
    two_fa: 'https://staging.fundingasiagroup.com/api/2fa',
    public_identifier: '/p',
    v2: 'https://staging.fundingasiagroup.com/api/v2',
    slack: 'https://microloan.fundingasiagroup.com/slack/send',
    payment_service: 'https://staging.fundingasiagroup.com/api/ps',
    curlec_payment: 'https://mydd.mydirectdebit.my/new-instant-pay',
    myinfo: 'https://myinfosgstg.api.gov.sg/test/v2',
  },
  launch_darkly_client_id:'5da027bac00cf208a28289f3'
};
