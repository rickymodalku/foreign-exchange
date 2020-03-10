export interface ActivationStep {
  id: number;
  code: string;
  name: string;
}

export class BorrowerLoan {
  amount: number;
  company: string;
  companyType: string;
  companyValue: string;
  contact: string;
  email: string;
  name: string;
  terms: number;
}

export interface MemberActivationStatus {
  id: number;
  name: string;
  code: string;
}

export interface MemberBankAccount {
  id: number;
  memberId: number;
  bankId: number;
  bankName: string;
  bankOther: string;
  bankAccountTypeId: number;
  bankAccountTypeName: string;
  branch: string;
  address: string;
  swiftCode: string;
  currency: string;
  number: string;
  name: string;
  isDefault: boolean;
  isValid: boolean;
  pic: string;
}

export interface MemberCrowdfundingSetting {
  id: number;
  loanTypeId: number;
  minimumTenor: number;
  maximumTenor: number;
  minimumInterestRate: number;
  maximumInterestRate: number;
  investOnAmountAllowed: string;
  amount: number;
  industries: string;
  pic: string;
}

export interface MemberDetail {
  id: number;
  memberTypeId: number;
  memberEntityTypeId: number;
  memberStatusId: number;
  memberActivationStatusId: number;
  userName: string;
  firstName: string;
  fullName: string;
  lastName: string;
  icTypeId: number;
  icNumber: string;
  passportNumber: string;
  taxCardTypeId: string;
  taxCardNumber: string;
  phoneNumber: string;
  mobilePhoneNumber: string;
  faxNumber: string;
  address1: string;
  address2: string;
  countryId: string;
  residentialCountryId: string;
  stateId: number;
  cityId: number;
  district: string;
  area: string;
  areaId: string;
  areaCode: string;
  zipCode: string;
  unitNumber: string;
  unitFloor: string;
  birthDate: Date;
  birthPlace: string;
  bcaVaNumber: string;
  genderId: number;
  referralId: number;
  referralCode: string;
  virtualAccountNumber: string;
  citizenshipIsSame: boolean;
  citizenshipAddress1: string;
  citizenshipAddress2: string;
  citizenshipCountryId: string;
  citizenshipStateId: number;
  citizenshipCityId: number;
  citizenshipDistrict: string;
  citizenshipArea: string;
  citizenshipAreaCode: string;
  citizenshipZipCode: string;
  citizenshipUnitNumber: string;
  citizenshipUnitFloor: string;
  isVip: boolean;
  companyIndustryId: number;
  companyIndustryOther: string;
  companyEntityTypeId: number;
  companyName: string;
  companyRegistrationNumber: string;
  companyPhoneNumber: string;
  companyEmail: string;
  companyFaxNumber: string;
  companyAddress1: string;
  companyAddress2: string;
  companyCountryId: string;
  companyStateId: number;
  companyCityId: number;
  companyDistrict: string;
  companyArea: string;
  companyAreaCode: string;
  companyZipCode: string;
  companyUnitNumber: string;
  companyUnitFloor: string;
  companyBirthDate: Date;
  companyTotalEmployeeId: number;
  companyCrimeStatus: string;
  companyCrimeDetail: string;
  companyEverBankrupt: boolean;
  companyOwnership: number;
  companyAnnualRevenue: number;
  companyAnnualNetIncome: number;
  companyCurrentDebt: number;
  companyCurrentInstallment: number;
  activationStepId: number;
  memberTypeCode: string;
  memberTypeName: string;
  memberEntityType: MemberEntityType;
  memberStatus: MemberStatus;
  memberActivationStatus: MemberActivationStatus;
  memberCrowdfundingSettings: Array<MemberCrowdfundingSetting>;
  memberBankAccounts: Array<MemberBankAccount>;
  activationStep: ActivationStep;
  assessment: string;
  subscriptionAgreementExists: boolean;
  signupDate: Date;
  motherMaidenName: string;
  degreeCode: number;
  maritalStatusId: number;
  religionCode: number;
  beneficialOwnerFullname: string;
  beneficialOwnerICNumber: string;
  beneficialOwnerFullAddress: string;
  beneficialOwnerRelationship: string;
  spouseFullName: string;
  passportExpiryDate: string;
  emergencyRelationship: string;
  emergencyFullname: string;
  emergencyMobilePhoneNumber: string;
  emergencyAddress1: string;
  emergencyAreaId: string;
  emergencyAreaCode: string;
  emergencyZipCode: string;
  emergencyCountryId: string;
  citizenshipAreaId: string;
  investBalance: boolean;
  exposurePerBorrower: number;
  exposurePerIndustry: number;
  lastSignUpStepWeb: string;
  faMemberId: number;
  faMember: any;
}

export interface MemberEntityType {
  id: number;
  code: string;
  name: string;
  isInstitutional: boolean;
}

export class MemberLoginDetail {
  activatedAt: string;
  activationStepCode: string;
  assessment: string;
  countryId: string;
  fullName: string;
  id: number;
  isInstitutional: boolean;
  memberStatusCode: string;
  memberTypeCode: string;
  memberEntityCode: string;
  memberEntityTypeId: string;
  memberTypeName: string;
  needsRDNOpening: string;
  referralCode: string;
  referralId: number;
  subaccounts: Array<MemberSubaccount>;
  userName: string;
  memberChangeRequestEntity: any;
}

export interface MemberStatus {
  id: number;
  name: string;
}

export class MemberSubaccount {
  id: number;
  userName: string;
  accessLevel: string;
}

export class MyInfo {
  username: string;
  country_code: string;
  member_type: string;
  member_token: string;
  code: string;
}


export interface SubscriptionAgreementTemplate {
  id: number;
  countryId: string;
  label: string;
  displayedLabel: string;
  prependedLabel: string;
  grouping: string;
  inputTypeId: number;
  inputTypeCode: string;
  inputTypeName: string;
  valueString: string;
  valueDecimal: number;
  valueBoolean: boolean;
  required: boolean;
  valid: boolean;
  hidden: boolean;
  page: number;
}

export interface BoltTemplate {
  id: number;
  label: string;
  inputTypeId: number;
  inputTypeCode: string;
  inputTypeName: string;
  valueString: string;
  valueDecimal: number;
  valueBoolean: boolean;
  required: boolean;
  valid: boolean;
}

export interface BoltTemplateGrouping {
  id: number;
  countryId: string;
  code: string;
  templates: Array<BoltTemplate>;
}

export class ZohoLead {
  companyName: string;
  companyRevenue: number = 0;
  companyType: string;
  contactNumber: string;
  mobile_phone_number: string;
  countryId: string;
  email: string;
  fullName: string;
  gclid: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  leadType: string;
  loanAmount: number = 0;
  loanTenor: string;
  notes: string;
  pic: string;
  howDidYouFindUs: string;
  howDidYouFindUsDetails: string;
  zohoLeadsOwnerId: string;
  zohoLeadsOwner: string;
  zoho_leads_source: string;
}

export class MemberContactChangeTemplate {
  mobilePhoneNumber: string;
  otpChannel?: string;
}

export class MemberPhoneNumberChangeVerifyTemplate {
  key: string;
  token: number;
}

export interface DepositSetting {
  maximum_deposit?: number;
  minimum_deposit: number;
  minimum_first_deposit: number;
}

export class CountryDetailData {
  id: string;
  code: string;
  name: string;
  withholding_tax: string;
  is_gross_withholding_tax: boolean;
  investor_minimum_age: string;
  is_exclusive_gst: boolean;
  gst: string;
  rounding_adjustment_limit: string;
  auto_investment_threshold: string;
  deposit_settings: DepositSetting;
}
