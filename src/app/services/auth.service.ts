import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { SecurityService } from './security.service';
import {
  AuthEventEmitter,
  SignUpCredential
} from '../models/auth.class';
import CONFIGURATION from '../../configurations/configuration';

@Injectable()
export class AuthService {
  private _keys: any;
  logInEventEmitter: AuthEventEmitter;
  twoFaLoginEventEmitter: AuthEventEmitter;
  private _memberTypeCodes: any;
  navigationEventEmitter: AuthEventEmitter;
  private twoFaPass: string;
  tmpLogoutUserName: string;

  constructor(
    private _localStorageService: LocalStorageService,
    private _securityService: SecurityService
  ) {
    this._keys = {
      accessLevel: this._securityService.encode(CONFIGURATION.encryption_key, 'accessLevel'),
      activationStepCode: this._securityService.encode(CONFIGURATION.encryption_key, 'activationStepCode'),
      bearerToken: this._securityService.encode(CONFIGURATION.encryption_key, 'bearerToken'),
      expiryTime: this._securityService.encode(CONFIGURATION.encryption_key, 'expiryTime'),
      fullName: this._securityService.encode(CONFIGURATION.encryption_key, 'fullName'),
      memberEntityTypeId: this._securityService.encode(CONFIGURATION.encryption_key, 'memberEntityTypeId'),
      memberId: this._securityService.encode(CONFIGURATION.encryption_key, 'memberId'),
      memberUUID: this._securityService.encode(CONFIGURATION.encryption_key, 'memberUUID'),
      memberStatusCode: this._securityService.encode(CONFIGURATION.encryption_key, 'memberStatusCode'),
      needsRDNOpening: this._securityService.encode(CONFIGURATION.encryption_key, 'needsRDNOpening'),
      memberTypeCode: this._securityService.encode(CONFIGURATION.encryption_key, 'memberTypeCode'),
      referralCode: this._securityService.encode(CONFIGURATION.encryption_key, 'referralCode'),
      referralId: this._securityService.encode(CONFIGURATION.encryption_key, 'referralId'),
      refreshToken: this._securityService.encode(CONFIGURATION.encryption_key, 'refreshToken'),
      rememberMe: this._securityService.encode(CONFIGURATION.encryption_key, 'rememberMe'),
      signUpMemberTypeCode: this._securityService.encode(CONFIGURATION.encryption_key, 'signUpMemberTypeCode'),
      signUpToken: this._securityService.encode(CONFIGURATION.encryption_key, 'signUpToken'),
      signUpUserName: this._securityService.encode(CONFIGURATION.encryption_key, 'signUpUserName'),
      subaccountMemberId: this._securityService.encode(CONFIGURATION.encryption_key, 'subaccountMemberId'),
      isInstitutional: this._securityService.encode(CONFIGURATION.encryption_key, 'isInstitutional'),
      subaccountUserName: this._securityService.encode(CONFIGURATION.encryption_key, 'subaccountUserName'),
      userName: this._securityService.encode(CONFIGURATION.encryption_key, 'userName'),
      activatedAt: this._securityService.encode(CONFIGURATION.encryption_key, 'activatedAt'),
      memberChangeRequestEntity: this._securityService.encode(CONFIGURATION.encryption_key, 'memberChangeRequestEntity'),
      memberEntityCode: this._securityService.encode(CONFIGURATION.encryption_key, 'memberEntityCode'),
      lastSignUpStepWeb: this._securityService.encode(CONFIGURATION.encryption_key, 'lastSignUpStepWeb'),
      twoFaNextStep: this._securityService.encode(CONFIGURATION.encryption_key, 'twoFaNextStep')
    };
    this.logInEventEmitter = new AuthEventEmitter();
    this.twoFaLoginEventEmitter = new AuthEventEmitter();
    this._memberTypeCodes = {
      'BORROWER': CONFIGURATION.member_type_code.borrower,
      'COMPANY': CONFIGURATION.member_type_code.company,
      'INVESTOR': CONFIGURATION.member_type_code.investor,
      'PARTNER': CONFIGURATION.member_type_code.partner
    }
    this.navigationEventEmitter = new AuthEventEmitter();
    this.tmpLogoutUserName = null;
  }

  allowAccess(): boolean {
    return this.getAccessLevel() === "ADMINISTRATOR" || this.getAccessLevel() === "OWNER";
  }

  getAccessLevel(): string {
    let result = this._localStorageService.retrieve(this._keys['accessLevel']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getActivationStepCode(): string {
    let result = this._localStorageService.retrieve(this._keys['activationStepCode']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getBearerToken(): string {
    let result = this._localStorageService.retrieve(this._keys['bearerToken']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getExpiryTime(): string {
    let result = this._localStorageService.retrieve(this._keys['expiryTime']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getExpiryTimeKey(): string {
    return this._keys['expiryTime'];
  }

  getFullName(): string {
    let result = this._localStorageService.retrieve(this._keys['fullName']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getMemberStatusCode(): string {
    let result = this._localStorageService.retrieve(this._keys['memberStatusCode']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getNeedsRDNOpening(): string {
    let result = this._localStorageService.retrieve(this._keys['needsRDNOpening']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }


  getMemberTypeCode(): string {
    let result = this._localStorageService.retrieve(this._keys['memberTypeCode']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getRefreshToken(): string {
    let result = this._localStorageService.retrieve(this._keys['refreshToken']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getRememberMe(): boolean {
    let result = this._localStorageService.retrieve(this._keys['rememberMe']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) === 'true' : false;
  }

  getMemberId(): number {
    let result = this._localStorageService.retrieve(this._keys['memberId']);
    return typeof result !== "undefined" && result !== "" && result !== null ? parseInt(this._securityService.decode(CONFIGURATION.encryption_key, result)) : 0;
  }

  getMemberUUID(): string {
    let result = this._localStorageService.retrieve(this._keys['memberUUID']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getReferralCode(): string {
    let result = this._localStorageService.retrieve(this._keys['referralCode']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getReferralId(): number {
    let result = this._localStorageService.retrieve(this._keys['referralId']);
    return typeof result !== "undefined" && result !== "" && result !== null ? parseInt(this._securityService.decode(CONFIGURATION.encryption_key, result)) : 0;
  }

  getActivatedAt(): number {
    let result = this._localStorageService.retrieve(this._keys['activatedAt']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getMemberChangeRequestEntity(): string {
    let result = this._localStorageService.retrieve(this._keys['memberChangeRequestEntity']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getMemberEntityCode(): string {
    let result = this._localStorageService.retrieve(this._keys['memberEntityCode']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getlastSignUpStepWeb(): string {
    const result = this._localStorageService.retrieve(this._keys['lastSignUpStepWeb']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getSignUpCredential(): SignUpCredential {
    let signUpMemberTypeCode = this._localStorageService.retrieve(this._keys['signUpMemberTypeCode']);
    let signUpToken = this._localStorageService.retrieve(this._keys['signUpToken']);
    let signUpUserName = this._localStorageService.retrieve(this._keys['signUpUserName']);
    let isValid = (typeof signUpMemberTypeCode !== "undefined" && signUpMemberTypeCode !== null && signUpMemberTypeCode !== "") &&
      (typeof signUpToken !== "undefined" && signUpToken !== null && signUpToken !== "") &&
      (typeof signUpUserName !== "undefined" && signUpUserName !== null && signUpUserName !== "");

    return isValid ?
      <SignUpCredential>({
        memberTypeCode: this._securityService.decode(CONFIGURATION.encryption_key, signUpMemberTypeCode),
        token: this._securityService.decode(CONFIGURATION.encryption_key, signUpToken),
        userName: this._securityService.decode(CONFIGURATION.encryption_key, signUpUserName)
      }) :
      null;
  }

  getSubaccountMemberId(): number {
    let result = this._localStorageService.retrieve(this._keys['subaccountMemberId']);
    return typeof result !== "undefined" && result !== "" && result !== null ? parseInt(this._securityService.decode(CONFIGURATION.encryption_key, result)) : 0;
  }

  getSubaccountUserName(): string {
    let result = this._localStorageService.retrieve(this._keys['subaccountUserName']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getIsInstitutional(): string {
    let result = this._localStorageService.retrieve(this._keys['isInstitutional']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getMemberEntityTypeId(): string {
    let result = this._localStorageService.retrieve(this._keys['memberEntityTypeId']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getUserName(): string {
    let result = this._localStorageService.retrieve(this._keys['userName']);
    return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "";
  }

  getTwoFaNextStep(): string {
    const result = this._localStorageService.retrieve(this._keys['twoFaNextStep']);
    return ('abcdef' + typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : "").replace(/['"]+/g, '');
  }

  getTmpLogoutUsername(): string {
    return this.tmpLogoutUserName;
  }

  getTwoFaLoginPass(): string {
    return this.twoFaPass || null;
  }

  isAdministrator(): boolean {
    return this.getAccessLevel() === "ADMINISTRATOR" || this.getAccessLevel() === "OWNER";
  }

  isLoggedIn(): boolean {
    return this.getBearerToken() !== "" && this.getMemberId() !== 0;
  }

  logIn(
    memberTypeCode: string,
    memberId: string,
    userName: string,
    memmberUUID: string
  ): void {
    let memberTypeCodeValue = this._securityService.encode(CONFIGURATION.encryption_key, this._memberTypeCodes[memberTypeCode]);
    this._localStorageService.store(this._keys['memberTypeCode'], memberTypeCodeValue);

    let memberIdValue = this._securityService.encode(CONFIGURATION.encryption_key, memberId);
    this._localStorageService.store(this._keys['memberId'], memberIdValue);

    let userNameValue = this._securityService.encode(CONFIGURATION.encryption_key, userName);
    this._localStorageService.store(this._keys['userName'], userNameValue);

    let memberUUID = this._securityService.encode(CONFIGURATION.encryption_key, memmberUUID);
    this._localStorageService.store(this._keys['memberUUID'], memberUUID);
  }

  logOut(): void {
    if (CONFIGURATION.intercom.enable) {
      window['Intercom']('shutdown');
    }
    if (CONFIGURATION.zendesk.enable) {
      window['zE']('webWidget', 'reset');
    }
    let errorMessage = this._localStorageService.retrieve('error-message');
    let unauthorizedMessage = this._localStorageService.retrieve('unauthorized-message');
    this.tmpLogoutUserName = this.getUserName();
    this.removeLoginDetails();
    this._localStorageService.store('error-message', errorMessage);
    this._localStorageService.store('unauthorized-message', unauthorizedMessage);
    this.setLogIn(false);
  }

  setActivationStepCode(activationStepCode: string): void {
    let activationStepCodeValue = this._securityService.encode(CONFIGURATION.encryption_key, activationStepCode);
    this._localStorageService.store(this._keys['activationStepCode'], activationStepCodeValue);
  }

  setLastSignUStepWeb(lastSignUpStepWeb: string): void {
    const lastSignUpStepWebValue = this._securityService.encode(CONFIGURATION.encryption_key, lastSignUpStepWeb);
    this._localStorageService.store(this._keys['lastSignUpStepWeb'], lastSignUpStepWebValue);
  }

  setBearerToken(bearerToken: string): void {
    let bearerTokenValue = this._securityService.encode(CONFIGURATION.encryption_key, bearerToken);
    this._localStorageService.store(this._keys['bearerToken'], bearerTokenValue);
  }

  setDisplayPublicNavigationBar(display: boolean): void {
    return this.navigationEventEmitter.emit(display);
  }

  setExpiryTime(expiryTime: Date): void {
    let expiryTimeValue = this._securityService.encode(CONFIGURATION.encryption_key, expiryTime);
    this._localStorageService.store(this._keys['expiryTime'], expiryTimeValue);
  }

  setLogIn(logIn: boolean): void {
    return this.logInEventEmitter.emit(logIn);
  }
  // This enable user to proceed after the 2FA verification step by storing the password in memory only
  // Fallbacks to login if user refreshes the otp page
  setTwoFaLogin(pass: string): void {
    this.twoFaPass = pass || null;
  }

  triggerTwoFaLogIn(): void {
    return this.twoFaLoginEventEmitter.emit(true);
  }

  setLogInDetails(
    accessLevel: string,
    activationStepCode: string,
    fullName: string,
    memberStatusCode: string,
    referralCode: string,
    referralId: number,
    subaccountMemberId: string,
    subaccountUserName: string,
    isInstitutional: boolean,
    memberEntityTypeId: string,
    needsRDNOpening: string,
    activatedAt: string,
    entityChangeRequestDetail: any,
    memberEntityCode: string
  ): void {
    const accessLevelValue = this._securityService.encode(CONFIGURATION.encryption_key, accessLevel);
    this._localStorageService.store(this._keys['accessLevel'], accessLevelValue);

    const activationStepCodeValue = this._securityService.encode(CONFIGURATION.encryption_key, activationStepCode);
    this._localStorageService.store(this._keys['activationStepCode'], activationStepCodeValue);

    const fullNameValue = this._securityService.encode(CONFIGURATION.encryption_key, fullName);
    this._localStorageService.store(this._keys['fullName'], fullNameValue);

    const memberStatusCodeValue = this._securityService.encode(CONFIGURATION.encryption_key, memberStatusCode);
    this._localStorageService.store(this._keys['memberStatusCode'], memberStatusCodeValue);

    const referralCodeValue = this._securityService.encode(CONFIGURATION.encryption_key, referralCode);
    this._localStorageService.store(this._keys['referralCode'], referralCodeValue);

    const referralIdValue = this._securityService.encode(CONFIGURATION.encryption_key, referralId.toString());
    this._localStorageService.store(this._keys['referralId'], referralIdValue);

    const subaccountMemberIdValue = this._securityService.encode(CONFIGURATION.encryption_key, subaccountMemberId);
    this._localStorageService.store(this._keys['subaccountMemberId'], subaccountMemberIdValue);

    const subaccountUserNameValue = this._securityService.encode(CONFIGURATION.encryption_key, subaccountUserName);
    this._localStorageService.store(this._keys['subaccountUserName'], subaccountUserNameValue);

    const isInstitutionalValue = this._securityService.encode(CONFIGURATION.encryption_key, isInstitutional);
    this._localStorageService.store(this._keys['isInstitutional'], isInstitutionalValue);

    const memberEntityTypeIdValue = this._securityService.encode(CONFIGURATION.encryption_key, memberEntityTypeId);
    this._localStorageService.store(this._keys['memberEntityTypeId'], memberEntityTypeIdValue);

    const needsRDNOpeningValue = this._securityService.encode(CONFIGURATION.encryption_key, needsRDNOpening);
    this._localStorageService.store(this._keys['needsRDNOpening'], needsRDNOpeningValue);

    const activatedAtValue = this._securityService.encode(CONFIGURATION.encryption_key, activatedAt);
    this._localStorageService.store(this._keys['activatedAt'], activatedAtValue);

    const entityChangeRequestDetailValue = this._securityService.encode(CONFIGURATION.encryption_key, JSON.stringify(entityChangeRequestDetail));
    this._localStorageService.store(this._keys['memberChangeRequestEntity'], entityChangeRequestDetailValue);

    const memberEntityCodeValue = this._securityService.encode(CONFIGURATION.encryption_key, memberEntityCode);
    this._localStorageService.store(this._keys['memberEntityCode'], memberEntityCodeValue);
  }

  setRefreshToken(refreshToken: string): void {
    let refreshTokenValue = this._securityService.encode(CONFIGURATION.encryption_key, refreshToken);
    this._localStorageService.store(this._keys['refreshToken'], refreshTokenValue);
  }

  setmemberChangeRequestEntity(entityChangeRequestDetail: any) {
    const entityChangeRequestDetailValue = this._securityService.encode(CONFIGURATION.encryption_key, JSON.stringify(entityChangeRequestDetail));
    this._localStorageService.store(this._keys['memberChangeRequestEntity'], entityChangeRequestDetailValue);
  }

  setSignUpCredential(userName: string, token: string, memberTypeCode: string): void {
    let signUpMemberTypeCodeValue = this._securityService.encode(CONFIGURATION.encryption_key, memberTypeCode);
    let signUpTokenValue = this._securityService.encode(CONFIGURATION.encryption_key, token);
    let signUpUserNameValue = this._securityService.encode(CONFIGURATION.encryption_key, userName);

    this._localStorageService.store(this._keys['signUpMemberTypeCode'], signUpMemberTypeCodeValue);
    this._localStorageService.store(this._keys['signUpToken'], signUpTokenValue);
    this._localStorageService.store(this._keys['signUpUserName'], signUpUserNameValue);
  }

  setRememberMe(rememberMe: boolean): void {
    let rememberMeValue = this._securityService.encode(CONFIGURATION.encryption_key, rememberMe ? 'true' : 'false');
    this._localStorageService.store(this._keys['rememberMe'], rememberMeValue);
  }

  setTwoFANextStep(nextStep: string) {
    const nextStepValue = this._securityService.encode(CONFIGURATION.encryption_key, JSON.stringify(nextStep));
    this._localStorageService.store(this._keys['twoFaNextStep'], nextStepValue);
  }

  clearRDNLocalStorage() {
    this._localStorageService.clear(this._keys['needsRDNOpening']);
  }

  clearTwoFANextStep() {
    this._localStorageService.clear(this._keys['twoFaNextStep']);
  }

  removeLoginDetails(): void {
    this._localStorageService.clear(this._keys['bearerToken']);
    this._localStorageService.clear(this._keys['expiryTime']);
    this._localStorageService.clear(this._keys['accessLevel']);
    this._localStorageService.clear(this._keys['activationStepCode']);
    this._localStorageService.clear(this._keys['fullName']);
    this._localStorageService.clear(this._keys['memberStatusCode']);
    this._localStorageService.clear(this._keys['needsRDNOpening']);
    this._localStorageService.clear(this._keys['referralCode']);
    this._localStorageService.clear(this._keys['referralId']);
    this._localStorageService.clear(this._keys['subaccountMemberId']);
    this._localStorageService.clear(this._keys['subaccountUserName']);
    this._localStorageService.clear(this._keys['isInstitutional']);
    this._localStorageService.clear(this._keys['memberEntityTypeId']);
    this._localStorageService.clear(this._keys['refreshToken']);
    this._localStorageService.clear(this._keys['signUpMemberTypeCode']);
    this._localStorageService.clear(this._keys['signUpToken']);
    this._localStorageService.clear(this._keys['signUpUserName']);
    this._localStorageService.clear(this._keys['memberTypeCode']);
    this._localStorageService.clear(this._keys['memberId']);
    this._localStorageService.clear(this._keys['userName']);
    this._localStorageService.clear(this._keys['signUpMemberTypeCode']);
    this._localStorageService.clear(this._keys['signUpToken']);
    this._localStorageService.clear(this._keys['activatedAt']);
    this._localStorageService.clear(this._keys['memberChangeRequestEntity']);
    this._localStorageService.clear(this._keys['memberEntityCode']);
    this._localStorageService.clear(this._keys['lastSignUpStepWeb']);
    this._localStorageService.clear(this._keys['twoFaNextStep']);
    this._localStorageService.clear('reverification');
    this._localStorageService.clear('riskDisclosurePopup');
    this._localStorageService.clear('fullname');
  }
}
