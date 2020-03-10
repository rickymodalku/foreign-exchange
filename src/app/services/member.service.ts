
import { throwError as observableThrowError, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  Response,
  ResponseContentType,
  RequestOptions,
  RequestOptionsArgs
} from '@angular/http';
import { ENVIRONMENT } from '../../environments/environment';
import CONFIGURATION from '../../configurations/configuration';
import { HttpParams } from '@angular/common/http';
import {
  ActivationStep,
  BoltTemplateGrouping,
  BoltTemplate,
  MemberActivationStatus,
  MemberBankAccount,
  MemberCrowdfundingSetting,
  MemberDetail,
  MemberEntityType,
  MemberLoginDetail,
  MemberStatus,
  MemberSubaccount,
  SubscriptionAgreementTemplate,
  MemberContactChangeTemplate,
  CountryDetailData, DepositSetting,
} from '../models/member.class';
import { Router } from '@angular/router';
import { EventEmitter } from '../models/generic.class';

@Injectable()
export class MemberService {
  myInfoData: any;
  memberStatusEventEmitter: EventEmitter;
  constructor(
    private _authService: AuthService,
    private _http: Http,
    private _router: Router,
    private _baseService: BaseService
  ) {
    this.memberStatusEventEmitter = new EventEmitter();
  }

  private _delete(url: string): Observable<any> {
    return this._http
      .delete(url, this._generateRequestOptions()).pipe(
        map(this._mapResponse),
        catchError(this._errorHandler));
  }

  private _errorHandler(error: any): Observable<any> {
    let json;
    try {
      json = error.json();
    } catch (e) {
      return observableThrowError(error);
    }

    return observableThrowError(json);
  }

  private _generateRequestOptions(): RequestOptionsArgs {
    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Accept', 'application/json');
    options.headers.append('Content-Type', 'application/json');
    return options;
  }

  private _get(url: string): Observable<any> {
    return this._http
      .get(url, this._generateRequestOptions()).pipe(
        map(this._mapResponse),
        catchError(this._errorHandler));
  }


  private _getPDF(url: string): Observable<any> {
    return this._http
      .get(url, { responseType: ResponseContentType.Blob }).pipe(
        catchError(this._errorHandler));
  }

  private _mapResponse(response: Response): any {
    let json;
    try {
      json = response.json();
    } catch (e) {
      throw new Error(response.toString());
    }

    if (typeof json.status !== 'undefined' && json.status === 'error') {
      throw new Error(json.message);
    }

    return json;
  }

  private _put(url: string, body: any): Observable<any> {
    return this._http
      .put(url, body, this._generateRequestOptions()).pipe(
        map(this._mapResponse),
        catchError(this._errorHandler));
  }

  private _post(url: string, body: any): Observable<any> {
    return this._http
      .post(url, body, this._generateRequestOptions()).pipe(
        map(this._mapResponse),
        catchError(this._errorHandler));
  }

  // Member
  activate(body: any): Observable<any> {
    let url = ENVIRONMENT.service.member + ENVIRONMENT.service.public_identifier + '/member_auth/register';
    return this._post(url, body);
  }

  v2Activate(countryCode: string, userName: string, token: string): Observable<any> {
    const url = `${ENVIRONMENT.service.v2}/users/activate`;
    return this._put(url, {
      country_code: countryCode,
      username: userName,
      token: token
    });
  }

  addAutoInvestmentSetting(body: any) {
    let url = ENVIRONMENT.service.member + '/member_crowdfunding_settings';
    return this._post(url, body);
  }

  addBankAccount(body: MemberBankAccount): Observable<any> {
    let url = ENVIRONMENT.service.member + '/member_bank_accounts';
    return this._post(url, body);
  }

  addLead(body: any): Observable<any> {
    if (CONFIGURATION.country_code === 'MY') {
      body.contactNumber = '';
    } else {
      body.mobile_phone_number = '';
    }
    let url = ENVIRONMENT.service.member + ENVIRONMENT.service.public_identifier + '/leads';
    return this._post(url, body);
  }

  checkForgotPasswordRequest(userName: string, countryId: string, token: string): Observable<any> {
    let url = ENVIRONMENT.service.member + ENVIRONMENT.service.public_identifier + '/member_auth/check/forgot_password?username=' + encodeURIComponent(userName) + '&country_id=' + countryId + '&token=' + token;
    return this._get(url);
  }

  createMemberSubscriptionAgreement(memberSubscriptionAgreements: Array<SubscriptionAgreementTemplate>) {
    let body = {
      list: memberSubscriptionAgreements
    };
    let url = ENVIRONMENT.service.member + '/member_subscription_agreements';
    return this._post(url, body);
  }

  getMemberSubscriptionAgreementList() {
    let url = ENVIRONMENT.service.member + '/member_subscription_agreements/me';
    return this._get(url);
  }

  getPlatformAgreementPDF(): Observable<any> {
    const token = this._authService.getBearerToken();
    const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token, 'Accept': 'application/pdf' });
    const options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    const url = `${ENVIRONMENT.service.v2}/me/subscription_agreements/latest`;
    return this._http.get(url, options);
  }

  viewMemberSubscriptionAgreement(templateListId: number): Observable<any> {
    const url = ENVIRONMENT.service.member + '/member_subscription_agreements?list_id=' + templateListId;
    return this._getPDF(url);
  }

  deleteAutoInvestmentSetting(id: number) {
    let url = ENVIRONMENT.service.member + '/member_crowdfunding_settings/' + id;
    return this._delete(url);
  }

  forgotPassword(body: any): Observable<any> {
    let url = ENVIRONMENT.service.member + ENVIRONMENT.service.public_identifier + '/member_auth/forgot_password';
    return this._post(url, body);
  }

  getAutoInvestmentSetting() {
    let url = ENVIRONMENT.service.member + '/member_crowdfunding_settings/single/me?include_disabled=true';
    return this._get(url);
  }

  getAutoInvestmentSetting3() {
    let url = ENVIRONMENT.service.member + '/member_crowdfunding_settings/single/me?include_disabled=true&version=3';
    return this._get(url);
  }

  getLoginDetail(): Observable<MemberLoginDetail> {
    let url = ENVIRONMENT.service.v2 + '/me/login';
    return this._get(url).pipe(
      map(this.mapLoginDetail));
  }

  updateEntityDetail(memberUuid: string, entityCode: string): Observable<any> {
    const body = {
      entity_code: entityCode
    };
    const url = ENVIRONMENT.service.v2 + '/me/entity';
    return this._put(url, body);
  }

  getLookUpMasterData(): Observable<any> {
    let url = ENVIRONMENT.service.look_up + ENVIRONMENT.service.public_identifier + '/members/all/public/' + CONFIGURATION.country_code;
    return this._get(url);
  }

  getLookUpStates(countryCode: string): Observable<any> {
    let url = ENVIRONMENT.service.look_up + ENVIRONMENT.service.public_identifier + '/states/all/public/' + countryCode;
    return this._get(url);
  }

  getMemberDetail(): Observable<MemberDetail> {
    let url = ENVIRONMENT.service.member + '/members/any/single/simple/me';
    return this._get(url).pipe(
      map(this.mapMemberDetail));
  }

  getMemberMasterData(memberTypeCode: string): Observable<any> {
    return this._get(
      ENVIRONMENT.service.member +
      ENVIRONMENT.service.public_identifier +
      '/members/' +
      memberTypeCode +
      '/references?country_id=' +
      CONFIGURATION.country_code,
    );
  }

  getSignUpDetail(userName: string, countryCode: string, token: string): Observable<any> {
    let url = ENVIRONMENT.service.member + ENVIRONMENT.service.public_identifier + '/member_auth?username=' + encodeURIComponent(userName) + '&country_id=' + countryCode + '&token=' + token;
    return this._get(url);
  }

  getSubscriptionAgreementTemplates(): Observable<Array<SubscriptionAgreementTemplate>> {
    let url = ENVIRONMENT.service.member + '/subscription_agreement_templates/all/' + CONFIGURATION.country_code;
    return this._get(url).pipe(
      map(this.mapSubscriptionAgreementTemplate));
  }

  private mapCountryDetails(response: any): CountryDetailData {
    let result: CountryDetailData = null;
    if (response.data) {
      const data = response.data;
      result = <CountryDetailData>({
        id: data.id,
        code: data.code,
        name: data.name,
        withholding_tax: data.withholding_tax,
        is_gross_withholding_tax: data.is_gross_withholding_tax,
        investor_minimum_age: data.investor_minimum_age,
        is_exclusive_gst: data.is_exclusive_gst,
        gst: data.gst,
        rounding_adjustment_limit: data.rounding_adjustment_limit,
        auto_investment_threshold: data.auto_investment_threshold,
        deposit_settings: data.deposit_settings,
      });
    }
    return result;
  }

  private mapMemberDetail(response: any): MemberDetail {
    const data = response.data;
    let result = null;

    if (data) {
      result = <MemberDetail>({
        id: data.id,
        memberTypeId: data.memberTypeId,
        memberEntityTypeId: data.memberEntityTypeId,
        memberStatusId: data.memberStatusId,
        memberActivationStatusId: data.memberActivationStatusId,
        userName: data.userName,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullname,
        icTypeId: data.icTypeId,
        icNumber: data.icNumber,
        passportNumber: data.passportNumber,
        passportExpiryDate: data.passportExpiryDate,
        taxCardTypeId: data.taxCardTypeId,
        taxCardNumber: data.taxCardNumber,
        phoneNumber: data.phoneNumber,
        mobilePhoneNumber: data.mobilePhoneNumber,
        faxNumber: data.faxNumber,
        address1: data.address1,
        address2: data.address2,
        countryId: data.countryId,
        residentialCountryId: data.residentialCountryId,
        stateId: data.stateId,
        cityId: data.cityId,
        district: data.district,
        area: data.area,
        areaId: data.areaId,
        areaCode: data.areaCode,
        zipCode: data.zipCode,
        unitNumber: data.unitNumber,
        unitFloor: data.unitFloor,
        bcaVaNumber: data.bcaVaNumber,
        birthDate: data.birthDate,
        birthPlace: data.birthPlace,
        genderId: data.genderId,
        referralId: data.referralId,
        referralCode: data.referralCode,
        virtualAccountNumber: data.virtualAccountNumber,
        citizenshipIsSame: data.citizenshipIsSame,
        citizenshipAddress1: data.citizenshipAddress1,
        citizenshipAddress2: data.citizenshipAddress2,
        citizenshipCountryId: data.citizenshipCountryId,
        citizenshipStateId: data.citizenshipStateId,
        citizenshipCityId: data.citizenshipCityId,
        citizenshipDistrict: data.citizenshipDistrict,
        citizenshipArea: data.citizenshipArea,
        citizenshipAreaCode: data.citizenshipAreaCode,
        citizenshipZipCode: data.citizenshipZipCode,
        citizenshipUnitNumber: data.citizenshipUnitNumber,
        citizenshipUnitFloor: data.citizenshipUnitFloor,
        isVip: data.isVip,
        companyIndustryId: data.companyIndustryId,
        companyIndustryOther: data.companyIndustryOther,
        companyEntityTypeId: data.companyEntityTypeId,
        companyName: data.companyName,
        companyRegistrationNumber: data.companyRegistrationNumber,
        companyPhoneNumber: data.companyPhoneNumber,
        companyEmail: data.companyEmail,
        companyFaxNumber: data.companyFaxNumber,
        companyAddress1: data.companyAddress1,
        companyAddress2: data.companyAddress2,
        companyCountryId: data.companyCountryId,
        companyStateId: data.companyStateId,
        companyCityId: data.companyCityId,
        companyDistrict: data.companyDistrict,
        companyArea: data.companyArea,
        companyAreaCode: data.companyAreaCode,
        companyZipCode: data.companyZipCode,
        companyUnitNumber: data.companyUnitNumber,
        companyUnitFloor: data.companyUnitFloor,
        companyBirthDate: data.companyBirthDate,
        companyTotalEmployeeId: data.companyTotalEmployeeId,
        companyCrimeStatus: data.companyCrimeStatus,
        companyCrimeDetail: data.companyCrimeDetail,
        companyEverBankrupt: data.companyEverBankrupt,
        companyOwnership: data.companyOwnership,
        companyAnnualRevenue: data.companyAnnualRevenue,
        companyAnnualNetIncome: data.companyAnnualNetIncome,
        companyCurrentDebt: data.companyCurrentDebt,
        companyCurrentInstallment: data.companyCurrentInstallment,
        activationStepId: data.activationStepId,
        activationStep: null,
        memberBankAccounts: [],
        memberCrowdfundingSettings: [],
        assessment: '1',
        subscriptionAgreementExists: data.agreementsList && data.agreementsList.length > 0,
        signupDate: data.createdAt,
        motherMaidenName: data.motherMaidenName,
        degreeCode: data.degreeCode,
        maritalStatusId: data.maritalStatusId,
        religionCode: data.religionCode,
        beneficialOwnerFullname: data.beneficialOwnerFullname,
        beneficialOwnerICNumber: data.beneficialOwnerICNumber,
        beneficialOwnerFullAddress: data.beneficialOwnerFullAddress,
        beneficialOwnerRelationship: data.beneficialOwnerRelationship,
        spouseFullName: data.spouseFullName,
        emergencyRelationship: data.emergencyRelationship,
        emergencyFullname: data.emergencyFullname,
        emergencyMobilePhoneNumber: data.emergencyMobilePhoneNumber,
        emergencyAddress1: data.emergencyAddress1,
        emergencyAreaId: data.emergencyAreaId,
        emergencyAreaCode: data.emergencyAreaCode,
        emergencyZipCode: data.emergencyZipCode,
        emergencyCountryId: data.emergencyCountryId,
        citizenshipAreaId: data.citizenshipAreaId,
        investBalance: data.investBalance,
        exposurePerBorrower: data.exposurePerBorrower,
        exposurePerIndustry: data.exposurePerIndustry,
        lastSignUpStepWeb: data.lastSignUpStepWeb,
      });
      if (data.memberType) {
        result.memberTypeCode = data.memberType.code;
        result.memberTypeName = data.memberType.name.toUpperCase();
      }
      if (data.memberEntityType) {
        result.memberEntityType = <MemberEntityType>({
          id: data.memberEntityType.id,
          name: data.memberEntityType.name,
          isInstitutional: data.memberEntityType.isInstitutional,
        });
      }
      if (data.memberStatus) {
        result.memberStatus = <MemberStatus>({
          id: parseInt(data.memberStatus.id, 10),
          name: data.memberStatus.name,
        });
      }
      if (data.memberActivationStatus) {
        result.memberActivationStatus = <MemberActivationStatus>({
          id: data.memberActivationStatus.id,
          name: data.memberActivationStatus.name,
          code: data.memberActivationStatus.code,
        });
      }
      for (let item of data.memberBankAccounts) {
        result.memberBankAccounts.push({
          id: item.id,
          memberId: data.id,
          bankId: item.bankId,
          bankName: "",
          bankOther: item.bankOther,
          bankAccountTypeId: item.bankAccountTypeId,
          // bankAccountTypeName: item.bankAccountType.name,
          branch: item.branch,
          address: item.address,
          swiftCode: item.swiftCode,
          currency: item.currency,
          number: item.number,
          name: item.name,
          isDefault: item.isDefault,
          isValid: true,
          pic: item.createdBy
        });
      }
      for (let item of data.memberCrowdfundingSettings) {
        result.memberCrowdfundingSettings.push(<MemberCrowdfundingSetting>({
          id: item.id,
          loanTypeId: item.loanTypeId,
          tenorTypeId: item.tenorTypeId,
          minimumTenor: item.minimumTenor,
          maximumTenor: item.maximumTenor,
          minimumInterestRate: item.minimumInterestRate,
          maximumInterestRate: item.maximumInterestRate,
          investOnAmountAllowed: item.investOnAmountAllowed,
          amount: item.amount,
          industries: item.industries.map(i => i.industryId).join(','),
          pic: item.createdBy
        }));
      }
      if (data.activationStep) {
        result.activationStep = <ActivationStep>({
          id: data.activationStep.id,
          code: data.activationStep.code,
          name: data.activationStep.name
        });
      }
      for (let item of data.suitabilityAssessments) {
        result.assessment = item.type;
      }
      if (data.faMemberId) {
        result.faMemberId = data.faMemberId;
      }
      if (data.faMember) {
        result.faMember = data.faMember;
      }
    }

    return result;
  }

  private mapLoginDetail(response: any): MemberLoginDetail {
    let data = response.data;
    let result = null;

    if (data) {
      result = <MemberLoginDetail>({
        activatedAt: data.activated_at,
        activationStepCode: null,
        assessment: null,
        countryId: data.country_code,
        fullName: data.fullname,
        id: data.id,
        isInstitutional: null,
        memberStatusCode: null,
        memberEntityCode: data.member_entity_code,
        memberEntityTypeId: data.member_entity_type.id,
        memberTypeCode: null,
        memberTypeName: null,
        needsRDNOpening: data.needs_rdn_opening,
        referralCode: data.referral_code,
        referralId: data.referral_id,
        subaccounts: new Array<MemberSubaccount>(),
        userName: data.username,
        memberChangeRequestEntity: data.member_change_requests.entity
      });
      if (data.activation_step) {
        result.activationStepCode = data.activation_step.code;
      }
      if (data.member_entity_type) {
        result.memberEntityTypeId = data.member_entity_type.id;
        result.isInstitutional = data.member_entity_type.is_institutional;
      }
      if (data.member_type) {
        result.memberTypeName = data.member_type.name.toUpperCase();
        result.memberTypeCode = data.member_type.code;
      }
      if (data.member_status) {
        result.memberStatusCode = data.member_status.code;
      }
      if (data.subaccounts) {
        result.subaccounts = data.subaccounts.map(subaccount => {
          return <MemberSubaccount>({
            accessLevel: subaccount.access_level,
            id: subaccount.id,
            userName: subaccount.username,
          });
        })
      }
      if (data.suitability_assessments) {
        let lastItem = data.suitability_assessments[data.suitability_assessments.length - 1];
        result.assessment = lastItem
          ? lastItem.type
          : null;
      }
    }

    return result;
  }

  private mapTemplateGrouping(response: any): BoltTemplateGrouping {
    let result = null;
    if (response) {
      result = <BoltTemplateGrouping>({
        id: 0,
        countryId: "",
        code: "",
        templates: []
      });
      for (let template of response.data.templates) {
        result.id = template.template.grouping.id;
        result.countryId = template.template.grouping.countryId;
        result.code = template.template.grouping.code;

        result.templates.push(<BoltTemplate>({
          id: template.id,
          label: template.template.label,
          inputTypeId: template.template.inputType.id,
          inputTypeCode: template.template.inputType.code,
          inputTypeName: template.template.inputType.name,
          valueString: template.valueString,
          valueDecimal: template.valueDecimal,
          valueBoolean: template.valueBoolean,
          required: template.template.required,
          valid: true
        }));
      }
    }

    return result;
  }

  private mapMemberTemplateGroupingByCode(response: any): BoltTemplateGrouping {
    let result = null;
    if (response) {
      result = <BoltTemplateGrouping>({
        id: 0,
        countryId: '',
        code: '',
        templates: []
      });
      for (let template of response.data) {
        result.id = template.template.grouping.id;
        result.countryId = template.template.grouping.countryId;
        result.code = template.template.grouping.code;

        result.templates.push(<BoltTemplate>({
          id: template.id,
          label: template.template.label,
          inputTypeId: template.template.inputType.id,
          inputTypeCode: template.template.inputType.code,
          inputTypeName: template.template.inputType.name,
          valueString: template.valueString,
          valueDecimal: template.valueDecimal,
          valueBoolean: template.valueBoolean,
          required: template.template.required,
          valid: true
        }));
      }
    }
    return result;
  }

  private mapSubscriptionAgreementTemplate(response: any): Array<SubscriptionAgreementTemplate> {
    let result: Array<SubscriptionAgreementTemplate> = [];
    for (let item of response.data) {
      result.push(<SubscriptionAgreementTemplate>({
        id: item.id,
        countryId: item.countryId,
        label: item.label,
        displayedLabel: item.displayedLabel,
        prependedLabel: "",
        grouping: item.grouping,
        inputTypeId: item.inputType.id,
        inputTypeCode: item.inputType.code,
        inputTypeName: item.inputType.name,
        valueString: null,
        valueDecimal: null,
        valueBoolean: false,
        required: item.required,
        valid: true,
        hidden: item.grouping ? item.grouping.indexOf("_SUB") !== -1 : false,
        page: item.page
      }));
    }

    return result;
  }

  resetPassword(body: any): Observable<any> {
    let url = ENVIRONMENT.service.v2 + '/members/password/reset';
    return this._put(url, body);
  }

  saveGenericQuestionnaire(genericQuestionnaire: any) {
    let endPoint = ENVIRONMENT.service.member + '/member_generic_questionnaires';
    return this._post(endPoint, genericQuestionnaire);
  }

  saveSuitabilityAssessment(suitabilityAssessment: any) {
    let endPoint = ENVIRONMENT.service.member + '/member_suitability_assessments';
    return this._post(endPoint, suitabilityAssessment);
  }

  sendActivationLink(userName: string, countryCode: string, token: string, completion: number, channel?: string): Observable<any> {
    const url = ENVIRONMENT.service.member + ENVIRONMENT.service.public_identifier + '/member_auth/completion';
    const currentUrl = this._router.url;
    return this._put(url, {
      completion: completion,
      countryId: countryCode,
      redirectLink: location.origin + '/activation',
      token: token,
      userName: userName,
      otpChannel: channel,
      templateId: currentUrl.indexOf("/investor") > -1 ?
        CONFIGURATION.sendgrid_template.investor_email_template_id : CONFIGURATION.sendgrid_template.borrower_email_template_id
    });
  }

  sendOtpCode(username: string, countryCode: string, token: string, stage: number, otpChannel: string): Observable<any> {
    const url = `${ENVIRONMENT.service.v2}/users/registration/stage`;
    const currentUrl = this._router.url;

    // If 2Fa enabled, then use 2Fa email
    // else use the old configuration
    let emailTemplateId = currentUrl.indexOf('/investor') > -1 ?
      CONFIGURATION.sendgrid_template.investor_email_template_id : CONFIGURATION.sendgrid_template.borrower_email_template_id;
    if (CONFIGURATION.enable2Fa) {
      emailTemplateId = currentUrl.indexOf('/investor') > -1 ?
        CONFIGURATION.sendgrid_template.investor_twoFa_email_template_id : CONFIGURATION.sendgrid_template.borrower_twoFa_email_template_id;
    }

    return this._put(url, {
      stage: stage,
      countryCode: countryCode,
      otp_channel: otpChannel,
      email: {
        redirectLink: location.origin + '/activation',
        send_name: CONFIGURATION.name,
        send_email: CONFIGURATION.email,
        template_id: emailTemplateId
      },
      token: token,
      username: username,
    });
  }

  signUp(body: any): Observable<any> {
    let url = ENVIRONMENT.service.v2 + '/users/registration';
    return this._post(url, body);
  }

  subscribeNewsletter(body: any): Observable<any> {
    let url = ENVIRONMENT.service.member + ENVIRONMENT.service.public_identifier + '/subscribers';
    return this._post(url, body);
  }

  updateAutoInvestmentSettings(body: any) {
    let url = ENVIRONMENT.service.member + '/member_crowdfunding_settings/me';
    return this._put(url, body);
  }

  getMemberBankAccounts() {
    let url = ENVIRONMENT.service.member + '/member_bank_accounts/me';
    return this._get(url);
  }

  getCompanyBankAccounts() {
    let url = ENVIRONMENT.service.member + '/member_bank_accounts/company';
    return this._get(url);
  }

  updateBankAccounts(memberBankAccounts: Array<MemberBankAccount>): Observable<any> {
    let url = ENVIRONMENT.service.member + '/member_bank_accounts/me';
    let body = {
      list: memberBankAccounts
    };
    return this._put(url, body);
  }

  updateMember(body: any): Observable<any> {
    let url = ENVIRONMENT.service.member + '/members/me';
    return this._put(url, body);
  }

  updateMemberActivationStep(body: any) {
    const url = ENVIRONMENT.service.member + '/members/activation_step/me';
    return this._put(url, body);
  }

  updateMemberActivationStepV2(body: any) {
    const url = `${ENVIRONMENT.service.v2}/me/activation_step`;
    return this._put(url, body);
  }


  updateMemberPhoneNumber(UUID: string, body: MemberContactChangeTemplate) {
    const url = `${ENVIRONMENT.service.v2}/me/mobile_phone_number`;
    return this._put(url, this._baseService.toSnakeCaseRequestBody(body));
  }

  verifyMemberPhoneNumber(UUID: string, body: any) {
    const url = `${ENVIRONMENT.service.v2}/me/mobile_phone_number/verify`
    return this._put(url, this._baseService.toSnakeCaseRequestBody(body));
  }

  updatePassword(memberId: number, body: any) {
    let url = ENVIRONMENT.service.v2 + '/me/password';
    return this._put(url, body);
  }

  updateSignUpCompletion(userName: string, countryCode: string, token: string, completion: number, otpChannel?: string): Observable<any> {
    let url = ENVIRONMENT.service.member + ENVIRONMENT.service.public_identifier + '/member_auth/completion';
    const currentUrl = this._router.url;
    return this._put(url, {
      completion: completion,
      countryId: countryCode,
      redirectLink: location.origin + '/activation',
      token: token,
      userName: userName,
      otpChannel: otpChannel,
      templateId: currentUrl.indexOf("/investor") > -1 ?
        CONFIGURATION.sendgrid_template.investor_email_template_id : CONFIGURATION.sendgrid_template.borrower_email_template_id
    });
  }

  updateSignUpInformation(userName: string, countryCode: string, token: string, member: any) {
    let url = ENVIRONMENT.service.member + ENVIRONMENT.service.public_identifier + '/member_auth';
    return this._put(url, {
      countryId: countryCode,
      member: member,
      token: token,
      userName: userName
    });
  }

  addSignupBankAccount(userName: string, countryCode: string, token: string, bank: any) {
    let url = ENVIRONMENT.service.member + ENVIRONMENT.service.public_identifier + '/member_auth/bank';
    return this._post(url, {
      bank: bank,
      countryId: countryCode,
      token: token,
      userName: userName
    });
  }

  getMemberBoltTemplateByGroupingCode(memberId: number, groupingCode: string): Observable<any> {
    let url = ENVIRONMENT.service.member + '/member_bolt_details/by/grouping/code?member_id=' + memberId + '&grouping_code=' + groupingCode;
    return this._get(url).pipe(
      map(this.mapMemberTemplateGroupingByCode));
  }


  updateMemberBoltTemplates(memberId: number, userName: string, templates: Array<BoltTemplate>) {
    let url = ENVIRONMENT.service.member + '/member_bolt_details';
    return this._put(url,
      {
        memberId: memberId,
        pic: userName,
        list: templates
      });
  }

  getMemberInfo(myInfoPayload: Object, memberType: String) {
    return this._post(`${ENVIRONMENT.service.member}/users/registration/gov_info`, myInfoPayload);
  }

  addReferralBorrower(referral: any, country_code: string, member_type_code: string): Observable<any> {
    let body = {
      "referral_company_name": referral.referralCompany,
      "referral_contact_name": referral.referralFullName,
      "referral_contact_number": referral.referralMobilePhoneNumber,
      "referral_contact_email": referral.referralEmail,
      "referee_company_name": referral.referrerCompany,
      "referee_contact_name": referral.referrerFullName,
      "referee_contact_number": referral.referrerMobilePhoneNumber,
      "referee_contact_email": referral.referrerEmail
    }
    let url = ENVIRONMENT.service.v2 + '/referrals/' + country_code + '/' + member_type_code + '/refer';
    return this._post(url, body);
  }

  signupReferralUpdates(data: any, country_code: string, member_type_code: string): Observable<any> {
    let body = {
      "email": data.email,
      "name": data.fullName
    }
    let url = ENVIRONMENT.service.v2 + '/referrals/' + country_code + '/' + member_type_code + '/register';
    return this._post(url, body);
  }

  getMemberRoyaltyDetail() {
    const url = ENVIRONMENT.service.loyalty + '/member_tiers/me';
    return this._get(url);
  }

  // ESBN MEMBER ENDPOINT
  getEsbnBank(): Observable<any> {
    let url = ENVIRONMENT.service.bond + '/banks';
    return this._get(url);
  }

  getEsbnOccupation(): Observable<any> {
    const url = ENVIRONMENT.service.bond + '/occupations';
    return this._get(url);
  }

  getEsbnProvince(): Observable<any> {
    const url = ENVIRONMENT.service.bond + '/provinces';
    return this._get(url);
  }

  getEsbnCity(provinceId: string): Observable<any> {
    const url = ENVIRONMENT.service.bond + '/provinces/' + provinceId + '/cities';
    return this._get(url);
  }

  getEsbnGender(): Observable<any> {
    const url = ENVIRONMENT.service.bond + '/genders';
    return this._get(url);
  }

  getEsbnSubregistry(): Observable<any> {
    const url = ENVIRONMENT.service.bond + '/subregistries';
    return this._get(url);
  }

  getMemberCustodianData() {
    const url = ENVIRONMENT.service.bond + '/investors/custodian/me?force=true';
    return this._get(url);
  }

  getEsbnTransactionStatus(): Observable<any> {
    const url = ENVIRONMENT.service.bond + '/transaction_statuses';
    return this._get(url);
  }

  getEsbnOffer(): Observable<any> {
    const url = ENVIRONMENT.service.bond + '/series/offer/';
    return this._get(url);
  }

  getEsbnOfferbySid(sid: any): Observable<any> {
    const url = ENVIRONMENT.service.bond + '/series/offer/' + sid;
    return this._get(url);
  }


  getInvestorOrderList(sid: string) {
    const url = ENVIRONMENT.service.bond + '/investors/' + sid + '/orders';
    return this._get(url);
  }

  EsbnSeriesOrder(body: any) {
    const url = ENVIRONMENT.service.bond + '/orders';
    return this._post(url, body);
  }

  registerMemberCustodianData(investorDetail: any) {
    const body = {
      name: investorDetail.investorName,
      id_no: investorDetail.investorIdentityNumber,
      tax_no: investorDetail.investorTaxNumber,
      place_of_birth: investorDetail.investorBirthPlace,
      date_of_birth: investorDetail.investorBirthDate,
      gender_id: investorDetail.investorGender,
      occupation_id: investorDetail.investorOccupation,
      address: investorDetail.investorAddress,
      city_id: investorDetail.investorCity,
      province_id: investorDetail.investorProvince,
      phone: investorDetail.investorHomePhoneNumber,
      mobile_phone: investorDetail.investorPhoneNumber,
      email: investorDetail.investorEmail,
      zip_code: investorDetail.investorAddressZipCode,
      country_of_birth: investorDetail.investorBirthCountry,
      religion_id: investorDetail.investorReligion,
      marital_status_id: investorDetail.investorMaritalStatus,
      employment_annual_income_id: investorDetail.investorIncomePerAnnum,
      education_id: investorDetail.investorEducationBackground,
      investment_objectives_id: investorDetail.investorInvestmentObjectives,
      business_company_name: investorDetail.investorCompanyName,
      business_address: investorDetail.investorCompanyAddress,
      business_company_city_id: investorDetail.investorCompanyCity,
      business_company_province_id: investorDetail.investorCompanyProvince,
      business_company_country: investorDetail.investorCompanyCountry,
      business_industry: investorDetail.investorCompanyBusiness,
      employment_title: investorDetail.investorCompanyPosition,
      employment_annual_income: investorDetail.investorIncomePerAnnum,
      source_of_funds_id: investorDetail.investorSourceOfFund,
      spouse_name: investorDetail.investorSpouseName,
      mother_maiden_name: investorDetail.investorMotherMaidenName,
      investment_objectives: investorDetail.investorInvestmentObjectives,
      funds_acc_bank_id: investorDetail.investorFundAccountBankName,
      funds_acc_account_no: investorDetail.investorFundAccountNumber,
      funds_acc_account_name: investorDetail.investorFundAccountName
    };
    for (const prop in body) {
      if (body.hasOwnProperty(prop) && (body[prop] === null || body[prop] === '')) {
        delete body[prop];
      }
    }
    const url = ENVIRONMENT.service.bond + '/investors/custodian/me';
    return this._post(url, body);
  }

  updateEsbnInvestorDetail(investorDetail: any, sid: string, fundAccountId: number, securitiesAccountId: number) {
    const body = {
      sid: investorDetail.investorSID,
      name: investorDetail.investorName,
      id_no: investorDetail.investorIdentityNumber,
      place_of_birth: investorDetail.investorBirthPlace,
      date_of_birth: investorDetail.investorBirthDate,
      province_id: investorDetail.investorProvince,
      gender_id: investorDetail.investorGender,
      occupation_id: investorDetail.investorOccupation,
      city_id: investorDetail.investorCity,
      address: investorDetail.investorAddress,
      phone: investorDetail.investorHomePhoneNumber,
      mobile_phone: investorDetail.investorPhoneNumber,
      email: investorDetail.investorEmail,
      funds_acc_id: fundAccountId,
      securities_acc_id: securitiesAccountId,
      funds_acc_bank_id: investorDetail.investorFundAccountBankName,
      funds_acc_account_no: investorDetail.investorFundAccountNumber,
      funds_acc_account_name: investorDetail.investorFundAccountName,
      securities_acc_subregistry_id: investorDetail.investorSecuritiesSubRegistry,
      securities_acc_participant_id: investorDetail.investorSecuritiesAccountParticipantName,
      securities_acc_account_no: investorDetail.investorSecuritiesAccountNumber,
      securities_acc_account_name: investorDetail.investorSecuritiesAccountName
    };
    for (const prop in body) {
      if (body.hasOwnProperty(prop) && (body[prop] === null || body[prop] === '')) {
        delete body[prop];
      }
    }
    const url = ENVIRONMENT.service.bond + '/investors/complete/' + sid;
    return this._put(url, body);
  }

  registerEsbnDetail(investorDetail: any) {
    const body = {
      sid: investorDetail.investorSID,
      name: investorDetail.investorName,
      id_no: investorDetail.investorIdentityNumber,
      place_of_birth: investorDetail.investorBirthPlace,
      date_of_birth: investorDetail.investorBirthDate,
      gender_id: investorDetail.investorGender,
      occupation_id: investorDetail.investorOccupation,
      province_id: investorDetail.investorProvince,
      city_id: investorDetail.investorCity,
      address: investorDetail.investorAddress,
      phone: investorDetail.investorHomePhoneNumber,
      mobile_phone: investorDetail.investorPhoneNumber,
      email: investorDetail.investorEmail,
      funds_acc_bank_id: investorDetail.investorFundAccountBankName,
      funds_acc_account_no: investorDetail.investorFundAccountNumber,
      funds_acc_account_name: investorDetail.investorFundAccountName,
      securities_acc_subregistry_id: investorDetail.investorSecuritiesSubRegistry,
      securities_acc_account_no: investorDetail.investorSecuritiesAccountNumber,
      securities_acc_account_name: investorDetail.investorSecuritiesAccountName
    };
    for (const prop in body) {
      if (body.hasOwnProperty(prop) && (body[prop] === null || body[prop] === '')) {
        delete body[prop];
      }
    }
    const url = ENVIRONMENT.service.bond + '/investors/complete';
    return this._post(url, body);
  }

  updateEsbnInvestorRedemption(investorSID: string, orderCode: string, nominal: number) {
    const body = {
      order_code: orderCode,
      sid: investorSID,
      nominal: nominal
    };
    const url = ENVIRONMENT.service.bond + '/redemptions';
    return this._post(url, body);
  }

  getSBNSeriesQuota(investorSID: string, seriesID: number) {
    const url = ENVIRONMENT.service.bond + '/investors/' + investorSID + '/series_quota/' + seriesID;
    return this._get(url);
  }

  getUserLatestSA(): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/pdf' });
    const options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    const url = ENVIRONMENT.service.v2 + '/me/subscription_agreements/latest';
    return this._http.get(url, options);
  }

  getLatestBlankSA(countryCode: string): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/pdf' });
    const options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    const url = ENVIRONMENT.service.v2 + '/members/subscription_agreement_templates/' + countryCode + '/blank';
    return this._http.get(url, options);
  }

  getCountryDetail(countryCode: string) {
    const url = ENVIRONMENT.service.v2 + '/master_data/countries/all/code/' + countryCode;
    return this._get(url).pipe(
      map(this.mapCountryDetails)
    );
  }

  getAddressLocation(countryCode: string, key: string) {
    const url = ENVIRONMENT.service.v2 + '/master_data/locations/' + countryCode + '?search=' + key;
    return this._get(url);
  }

  getAreaName(countryCode: string, areaId: string) {
    const url = ENVIRONMENT.service.v2 + '/master_data/locations/' + countryCode + '?ids=' + areaId;
    return this._get(url);
  }
  getIncomeRange(countryCode: string): Observable<any> {
    return this._get(ENVIRONMENT.service.v2 + '/master_data/income_ranges/' + countryCode + '?order=income_range_type,ASC');
  }

  getReligion(countryCode: string): Observable<any> {
    const url = ENVIRONMENT.service.v2 + '/master_data/religions/' + countryCode;
    return this._get(url);
  }

  getDegree(countryCode: string): Observable<any> {
    const url = ENVIRONMENT.service.v2 + '/master_data/degrees/' + countryCode;
    return this._get(url);
  }

  getPlatformAgreement(countryCode: string): Observable<any> {
    const url = ENVIRONMENT.service.v2 + '/master_data/subscription_agreement_templates/' + countryCode + '/code/latest';
    return this._get(url);
  }

  getAddressFromOneMap(zipCode: string): Observable<any> {
    const url = 'https://developers.onemap.sg/commonapi/search?returnGeom=N&getAddrDetails=Y&searchVal=' + zipCode;
    return this._http.get(url).pipe(map(this._mapResponse), catchError(this._errorHandler));
  }

  getDocumentToSign(uuid: string): Observable<any> {
    const url = ENVIRONMENT.service.v2 + '/me/kyc/documents_to_sign';
    return this._http.get(url).pipe(map(this._mapResponse), catchError(this._errorHandler));
  }

  signRiskDisclosure(): Observable<any> {
    const url = ENVIRONMENT.service.v2 + '/me/subscription_agreements/risk_disclosure/signoff';
    return this._put(url, {});
  }

  getReverificationReason() {
    const url = ENVIRONMENT.service.v2 + '/me/reverification_reasons';
    return this._get(url);
  }

  triggerMemberStatusRetrieval(): void {
    this.memberStatusEventEmitter.emit(true);
  }

  getMemberStatus() {
    const url = ENVIRONMENT.service.v2 + '/me?includes[]=member_status';
    return this._get(url);
  }

  getFAInvestmentSettings() {
    const url = `${ENVIRONMENT.service.v2}/fa/me/investment-settings`;
    return this._get(url);
  }

  postFAInvestmentSettings(body) {
    const url = `${ENVIRONMENT.service.v2}/fa/me/investment-settings`;
    return this._post(url, body);
  }

  putFAInvestmentSettings(investmentSettingId, body) {
    const url = `${ENVIRONMENT.service.v2}/fa/me/investment-settings/${investmentSettingId}`;
    return this._put(url, body);
  }

}


