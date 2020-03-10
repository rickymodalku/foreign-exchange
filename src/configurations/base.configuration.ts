// Add here for base configurations for all countries
const base_configuration = {
  access_level_code: {
    administrator: 'ADMINISTRATOR',
    owner: 'OWNER'
  },
  activation_step_code: {
    activated: 'ACT',
    deposit: 'DEP',
    escrow_agent: 'ESCROW',
    fill_information: 'SA',
    first_deposit: 'DEP-CONF',
    generic_questionnaire: 'GEN',
    null: 'NULL',
    send_econtract: 'SEND',
    sign_econtract: 'SIGN',
    suitability_assessment_test: 'SAT'
  },
  last_sign_up_web_status: {
    investorPersonalInformation: 'INVESTOR_PERSONAL_INFORMATION',
    investorBusinessInformation: 'INVESTOR_BUSINESS_INFORMATION',
    investorDocumentsUpload: 'INVESTOR_DOCUMENTS_UPLOAD',
    borrowerPersonalInformation: 'BORROWER_PERSONAL_INFORMATION',
    borrowerBusinessInformation: 'BORROWER_BUSINESS_INFORMATION',
    borrowerFinancialInformation: 'BORROWER_FINANCIAL_INFORMATION',
    borrowerDocumentsUpload: 'BORROWER_DOCUMENTS_UPLOAD',
    accountVerification: 'ACCOUNT_VERIFICATION',
  },
  member_type_code: {
    borrower: 'BRW',
    company: 'COM',
    investor: 'INV',
    partner: 'PRT'
  },
  member_status: {
    registered: 'REG',
    blacklisted: 'BLK',
    reverification: 'REV'
  },
  notification_delay: 5000,
  loading_delay: 1000,
  otpSetting: {
    numberOfOtpDigits: 6,
    otpDigitPrefix: 'otp-digit-',
    otpValidTiming: 60, // In seconds
  }
};

export default base_configuration;
