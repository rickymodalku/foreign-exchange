
import { forkJoin as observableForkJoin, throwError as observableThrowError, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import {
  Headers,
  Http,
  Response,
  RequestOptions,
  ResponseContentType,
  RequestOptionsArgs
} from "@angular/http";
import { ENVIRONMENT } from '../../environments/environment';
import CONFIGURATION from '../../configurations/configuration';
import { HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class LoanService {
  constructor(
    private _http: Http,
    private _authService: AuthService
  ) {
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

  // Loan
  acceptLoanOffer(loanId: number, status: string): Observable<any> {
    let url = ENVIRONMENT.service.loan + '/loan/accept/me/' + loanId;
    return this._put(url, {
      loan_status: status
    });
  }

  getLoans(): Observable<any> {
    let url = ENVIRONMENT.service.loan + '/loan/user/me';
    return this._get(url);
  }

  getLoanTypes(): Observable<any> {
    let url = ENVIRONMENT.service.loan + '/type?showed=1&country_id=' + CONFIGURATION.country_code;
    return this._get(url);
  }

  getLoanTypeDetail(loanTypeId: number): Observable<any> {
    let url = ENVIRONMENT.service.loan + '/type/' + loanTypeId + '?country_id=' + CONFIGURATION.country_code;
    return this._get(url);
  }

  getLoanStatuses(): Observable<any> {
    let url = ENVIRONMENT.service.look_up + ENVIRONMENT.service.public_identifier + '/loan_statuses/all/public/' + CONFIGURATION.country_code;
    return this._get(url);
  }

  getLoanPurposes(): Observable<any> {
    let url = ENVIRONMENT.service.look_up + ENVIRONMENT.service.public_identifier + '/loan_purposes/all/public/' + CONFIGURATION.country_code;
    return this._get(url);
  }

  submitLoan(body: any): Observable<any> {
    let url = ENVIRONMENT.service.loan + '/loan/simple_loan';
    return this._post(url, body);
  }

  submitLoanRecourses(data: Array<any>, loanId: number): Observable<any> {
    let url = ENVIRONMENT.service.loan + '/loan/loan_recourse/' + loanId;
    let observableBatch = new Array<any>();
    data.forEach(body => {
      observableBatch.push(
        this._post(url, body)
      );
    });
    return observableForkJoin(observableBatch);
  }

  getBorrowerLoans(): Observable<any> {
    const url = `${ENVIRONMENT.service.loanV2}/borrower/me/loans`;
    return this._get(url);
  }

  getLoanAmountRange(countryId: string, group: string = ''): Observable<any> {
    const url = ENVIRONMENT.service.loanV2 + '/master/enums/loan_amount_range?country_code=' + countryId + '&group=' + group;
    return this._get(url);
  }

  getLoanCbsRating(): Observable<any> {
    const url = ENVIRONMENT.service.loanV2 + '/master/enums/cbs_rating';
    return this._get(url);
  }

  getAutoInvestmentDefaultSetting(): Observable<any> {
    const url = ENVIRONMENT.service.v2 + '/auto_investment_settings/default';
    return this._get(url);
  }

  getDocumentToSign(loanId: string, productId: string = ''): Observable<any> {
    let params = new HttpParams();
    params = params.append('offering_id', loanId);
    params = params.append('offering_type', 'LOAN');
    if (productId) {
      params = params.append('offering_product_id', productId);
    }
    const url = `${ENVIRONMENT.service.v2}/me/kyc/documents_to_sign?${params.toString()}`;
    return this._http.get(url).pipe(map(this._mapResponse), catchError(this._errorHandler));
  }

  getDocumentStatus(documentId: string) {
    const body = {};
    const url = `${ENVIRONMENT.service.v2}/me/kyc/documents_to_sign/${documentId}`;
    return this._put(url, body);
  }

  getPowerOfAttorneyDocument(loanId: string) {
    const token = this._authService.getBearerToken();
    const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token, 'Accept': 'text/html' });
    const options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Text });
    const url = `${ENVIRONMENT.service.v2}/me/power_of_attorneys/${loanId}`;
    return this._http.get(url, options).pipe(catchError(this._errorHandler));
  }

}
