// SERVE: `ng serve --env=uat`
// BUILD: `ng build --aot --env=uat && npm run minify`

export const ENVIRONMENT = {
    version: '{BUILD_VERSION}',
    baseUrls: {
      id: ['id.modalku.co.id', 'id1.modalku.co.id', 'www.modalku.co.id', 'modalku.co.id']
    },
    environment_name: 'production',
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
      link: 'https://fitsonline.binaartha.com/'
    },
    production: true,
    boltLinkXero: 'https://fsbolt.com/web/business-information',
    yearInReviewLink: 'https://yearinreview.fundingsocieties.com',
    service: {
      authentication: 'https://api.modalku.co.id',
      bond: 'https://api.modalku.co.id/api/v1/esbn',
      crowdfunding: 'https://api.modalku.co.id/api/cfp',
      document: 'https://api.modalku.co.id/api/docs_management/v2',
      finance: 'https://api.modalku.co.id/api/fs',
      financeV2: 'https://api.modalku.co.id/api/fs/v2',
      finance_public: 'https://api.modalku.co.id/api/fs/p',
      loan: 'https://api.modalku.co.id/api/ln',
      loanV2: 'https://api.modalku.co.id/api/ln/v2',
      look_up: 'https://api.modalku.co.id/api/lu',
      loyalty: 'https://api.modalku.co.id/api/v1/loyalty',
      member: 'https://api.modalku.co.id/api/ms',
      memberV2: 'https://api.modalku.co.id/api/v2/members',
      note: 'https://api.modalku.co.id/api/ns',
      two_fa: 'https://api.modalku.co.id/api/2fa',
      public_identifier: '/p',
      v2: 'https://api.modalku.co.id/api/v2',
      slack: 'https://microloan.fundingasiagroup.com/slack/send',
      payment_service: 'https://api.modalku.co.id/api/ps',
      curlec_payment: 'https://mydd.mydirectdebit.my/new-instant-pay',
      myinfo: 'https://myinfosgstg.api.gov.sg/test/v2',
    },
    launch_darkly_client_id:'5da027bac00cf208a28289f4'
  };
