
import { throwError as observableThrowError, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  Response,
  RequestOptions,
  RequestOptionsArgs,
  ResponseContentType,
} from '@angular/http';

import { HttpParams } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { ENVIRONMENT } from '../../environments/environment';
import CONFIGURATION from '../../configurations/configuration';
import { EventEmitter } from '../models/generic.class';

@Injectable()
export class FinanceService {
  balanceEventEmitter: EventEmitter;

  constructor(
    private _http: Http,
    private _utilityService: UtilityService
  ) {
    this.balanceEventEmitter = new EventEmitter();
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

  private _generateRequestOptions(options?): RequestOptionsArgs {
    let newOptions = new RequestOptions();
    // Custom headers
    newOptions.headers = new Headers();
    if (options) {
      newOptions = options;
      // Default headers
    } else {
      newOptions.headers.append('Accept', 'application/json');
      newOptions.headers.append('Content-Type', 'application/json');
    }

    return newOptions;
  }

  private _get(url: string, options?: any): Observable<any> {
    return this._http
      .get(url, this._generateRequestOptions(options)).pipe(
        map(this._mapResponse),
        catchError(this._errorHandler));
  }

  private _mapResponse(response: Response): any {
    let result;
    if (response.headers.get('content-type').includes('application/json')) {
      try {
        result = response.json();
      } catch (e) {
        throw new Error(response.toString());
      }
      return result;
    } else if (response.headers.get('content-type') === ('application/pdf')) {
      try {
        result = response.blob();
      } catch (e) {
        throw new Error(response.toString());
      }
      return result;
    }

    if (typeof result.status !== 'undefined' && result.status === false) {
      throw new Error(result.value);
    }
  }

  generateParams(paginate: boolean, page: number, loanTypeId: number, loanStatus: string,
    loanSubStatus: string, paymentStatus: string, startDateFrom: any, startDateTo: any,
    maturityDateFrom: any, maturityDateTo: any, recordsPerPage: number): string {
    let params: string;

    if (paginate !== null) {
      params = (params === undefined || params === '') ? '?paginate=' + paginate : params + '&paginate=' + paginate;
    }

    if (page !== 0) {
      params = (params === undefined || params === '') ? '?page=' + page : params + '&page=' + page;
    }

    if (loanTypeId !== 0) {
      params = (params === undefined || params === '') ? '?loan_type=' + loanTypeId : params + '&loan_type=' + loanTypeId;
    }

    if (loanStatus !== '') {
      params = (params === undefined || params === '') ? '?loan_status=' + loanStatus : params + '&loan_status=' + loanStatus;
    }

    if (loanSubStatus !== '') {
      params = (params === undefined || params === '') ? '?loan_sub_status=' + loanSubStatus : params + '&loan_sub_status=' + loanSubStatus;
    }

    if (paymentStatus !== '') {
      params = (params === undefined || params === '') ? '?payment_status=' + paymentStatus : params + '&payment_status=' + paymentStatus;
    }

    if (startDateFrom !== '') {
      params = (params === undefined || params === '') ? '?start_date_from=' + this._utilityService.convertDateToISOString(startDateFrom) : params + '&start_date_from=' + this._utilityService.convertDateToISOString(startDateFrom);
    }

    if (startDateTo !== '') {
      params = (params === undefined || params === '') ? '?start_date_to=' + this._utilityService.convertDateToISOString(startDateTo) : params + '&start_date_to=' + this._utilityService.convertDateToISOString(startDateTo);
    }

    if (maturityDateFrom !== '') {
      params = (params === undefined || params === '') ? '?maturity_date_from=' + this._utilityService.convertDateToISOString(maturityDateFrom) : params + '&maturity_date_from=' + this._utilityService.convertDateToISOString(maturityDateFrom);
    }

    if (maturityDateTo !== '') {
      params = (params === undefined || params === '') ? '?maturity_date_to=' + this._utilityService.convertDateToISOString(maturityDateTo) : params + '&maturity_date_to=' + this._utilityService.convertDateToISOString(maturityDateTo);
    }


    if (recordsPerPage !== 0) {
      params = (params === undefined || params === '') ? '?records_per_page=' + recordsPerPage : params + '&records_per_page=' + recordsPerPage;
    }

    return params;
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

  // Finance
  deposit(body: any): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Deposit/New';
    return this._post(url, body);
  }

  getBorrowerSummary(): Observable<any> {
    const url = ENVIRONMENT.service.financeV2 + `/borrowers/me/loans/summary`;
    // Possible fields for the summary
    // ie. ?fields=loan_payments_history,loan_installments_due,loan_installments
    const fields = ['loan_payments_history', 'loan_installments_due', 'loan_installments'];
    return this._get(url);
  }

  getBorrowerRepayments(fromDate?: Date, toDate?: Date, loanId?: number, size?: number, page?: number): Observable<any> {
    let params = new HttpParams();
    if (fromDate) {
      params = params.append('from_date', fromDate.toISOString());
    }
    if (toDate) {
      params = params.append('to_date', toDate.toISOString());
    }
    if (loanId) {
      params = params.append('loan_id', loanId + '');
    }
    if (size) {
      params = params.append('size', size + '');
    }
    if (page) {
      params = params.append('page', page + '');
    }
    params = params.append('fields', 'loans');
    const url = `${ENVIRONMENT.service.financeV2}/me/installments?${params.toString()}`;
    return this._get(url);
  }

  getBorrowerFirstIncompleteInstallments(loanIds?: Array<number>, getLoanData?: Boolean): Observable<any> {
    let params = new HttpParams();
    if (loanIds) {
      params = params.append('loan_ds', loanIds.join(','));
    }
    if (getLoanData) {
      params = params.append('fields', 'loans');
    }
    const url = `${ENVIRONMENT.service.financeV2}/me/installments/first_incomplete`;
    return this._get(url);
  }

  getBalance(): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Wallet/Balance/me';
    return this._get(url);
  }

  getDeposit(): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Deposit/Search/me';
    return this._get(url);
  }

  getDepositHistory(paginate: boolean, page: number, recordsPerPage: number): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Deposit/History/me?paginate=' + paginate + '&page=' + page + '&records_per_page=' + recordsPerPage;
    return this._get(url);
  }

  getLoans(loanTypeId: number, page: number, recordsPerPage: number) {
    const url = ENVIRONMENT.service.finance + '/Funding/Loan/Available?page=' + page + '&size=' + recordsPerPage + '&typeid=' + loanTypeId + '&countrycode=' + CONFIGURATION.country_code;
    return this._get(url);
  }

  getInvestmentHistory(paginate: boolean, page: number, recordsPerPage: number): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Investment/History/me?paginate=' + paginate + '&page=' + page + '&records_per_page=' + recordsPerPage;
    return this._get(url);
  }

  getInvestorPortfolioInstallments(paginate: boolean, page: number, recordsPerPage: number): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Installment/InstallmetPortFolio/me?paginate=' + paginate + '&page=' + page + '&records_per_page=' + recordsPerPage;
    return this._get(url);
  }

  getInvestorPortfolioRepayments(paginate: boolean, loanTypeId: number, loanStatus: string, loanSubStatus: string,
    paymentStatus: string, startDateFrom: Date, startDateTo: Date, maturityDateFrom: Date,
    maturityDateTo: Date, page: number, recordsPerPage: number): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Payment/PaymentDetail/me' +
      this.generateParams(paginate, page, loanTypeId, loanStatus, loanSubStatus, paymentStatus, startDateFrom, startDateTo,
        maturityDateFrom, maturityDateTo, recordsPerPage);
    return this._get(url);
  }

  getInvestorPortolioRepaymentDetails(memberId: number, loanId: number): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Payment/PaymentDetail/Installments/' + loanId + '/me';
    return this._get(url);
  }

  getInvestorReturnsChart(period: number): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Investment/Portfolio/me?period=' + period;
    return this._get(url);
  }

  getInvestorSummary(): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Wallet/summary/me/investor?history=false';
    return this._get(url);
  }

  getInvestorOverview(): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Wallet/Investor/PortFolio/me';
    return this._get(url);
  }

  getStatements(): Observable<any> {
    const url = `${ENVIRONMENT.service.finance}/Wallet/month/me/list`;
    return this._get(url);
  }

  getStatistics(countryCode: string): Observable<any> {
    const url = ENVIRONMENT.service.finance + ENVIRONMENT.service.public_identifier + '/Wallet/statistics/' + countryCode + '?truncateAmount=false';
    return this._get(url);
  }

  getRepaymentSummary(memberId: number): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Installment/upcoming_repayment/' + memberId
    return this._get(url);
  }

  getPortfolioCsvData(): Observable<any> {
    const url = ENVIRONMENT.service.financeV2 + '/investors/me/portfolio/detail';
    return this._get(url);
  }

  getWithdrawalHistory(paginate: boolean, page: number, recordsPerPage: number): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Withdrawal/History/me?paginate=' + paginate + '&page=' + page + '&records_per_page=' + recordsPerPage;
    return this._get(url);
  }

  getWalletByMonth(page: number, total: number, search: string, orderBy: string,
    month: number, year: number): Observable<any> {
    const url = `${ENVIRONMENT.service.finance}/Wallet/month/me?
      page=${page}&size=${total}&search=${search}&orderby=${orderBy}&month=${month}&year=${year}`;
    return this._get(url);
  }

  getWalletByPeriod(page: number, total: number, search: string, orderBy: string,
    fromDate: string, toDate: string): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Wallet/period/me?page=' + page + '&size=' + total + '&search=' + search + '&orderby=' + orderBy
      + '&fromDate=' + fromDate + '&toDate=' + toDate;
    return this._get(url);
  }


  getPDFStatement(fromDate: string, toDate: string, monthly: boolean): Observable<Blob> {
    const headers = new Headers({ 'Content-Type': 'application/json','Accept': 'application/pdf' });
    const options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    let params = new HttpParams();
    params = params.append('fromDate', fromDate);
    params = params.append('toDate', toDate);
    params = params.append('Monthly', monthly.toString());
    const url = `${ENVIRONMENT.service.finance}/Wallet/DownloadStatement?${params.toString()}`;
    return this._get(url, options);
  }

  invest(body: any): Observable<any> {
    const url = ENVIRONMENT.service.crowdfunding + '/investment';
    return this._post(url, body);
  }

  triggerBalanceRetrieval(): void {
    this.balanceEventEmitter.emit(true);
  }

  withdraw(body: any): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/Withdrawal/New';
    return this._post(url, body);
  }

  getTotalFunded(country: string) {
    const url = ENVIRONMENT.service.finance_public + '/Wallet/TotalFunded/' + country;
    return this._get(url);
  }

  optOutAutoInvestment(loanId: string) {
    const url = ENVIRONMENT.service.finance + '/Funding/AutoAllocation/optout?loan_id=' + loanId;
    return this._http
      .put(url, null, this._generateRequestOptions()).pipe(
        map(
          function (response: Response) {
            let result;
            try {
              if (response['_body'] === '') {
                result = {
                  status: true
                };
                // For error, returning json
              } else {
                result = response.json();
              }
            } catch (e) {
              throw new Error(response.toString());
            }
            return result;
          }
        ), catchError(this._errorHandler));
  }
  getTaxInvoices(memberId: number): Observable<any> {
    const url = `${ENVIRONMENT.service.financeV2}/members/me/tax_invoices?fields=date`;
    return this._get(url);
  }
  getPDFTaxInvoice(id: number, yearDate: number, monthDate: number, token: string): Observable<Blob> {
    const headers = new Headers({ 'Content-Type': 'application/pdf', 'Authorization': 'Bearer ' + token, 'Accept': 'application/pdf' });
    const options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    let params = new HttpParams();
    params = params.append('year', yearDate.toString());
    params = params.append('month', monthDate.toString());
    const url = `${ENVIRONMENT.service.financeV2}/members/me/tax_invoice?${params.toString()}`;
    return this._get(url, options);
  }
  getActivities(page: number, recordsPerPage: number): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/v2/investors/me/activities?page=' + page + '&size=' + recordsPerPage;
    return this._get(url);
  }

  getIndonesiaStatistics(): Observable<any> {
    const endPoint = ENVIRONMENT.service.v2 + '/statistics/ojk';
    return this._get(endPoint);
  }

  getScDefaultRate(): Observable<any> {
    const endPoint = ENVIRONMENT.service.v2 + '/statistics/sc';
    return this._get(endPoint);
  }

  getLocalStatistics(countryCode: string): Observable<any> {
    const endPoint = ENVIRONMENT.service.v2;
    const url = endPoint + '/statistics/' + countryCode + '/default_definition';
    return this._get(url);
  }

  sendSATDisclaimer(body: any): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/v2/investors/me/sat_disclaimer';
    return this._post(url, body);
  }

  getLoanExposure(loanList: any): Observable<any> {
    const url = ENVIRONMENT.service.finance + '/v2/investors/me/loan_exposures?loan_ids=' + loanList;
    return this._get(url);
  }

}
