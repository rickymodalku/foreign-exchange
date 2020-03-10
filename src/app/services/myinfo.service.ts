
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
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
import { ENVIRONMENT } from '../../environments/environment';
import CONFIGURATION from '../../configurations/configuration';
import { EventEmitter } from '@angular/core';
import { UUID } from 'angular2-uuid';

@Injectable()
export class MyInfoService {
  hideMyInfoAndManualSelectionEventEmitter: EventEmitter<any>;
  constructor(
    private _http: Http
  ) {
    this.hideMyInfoAndManualSelectionEventEmitter = new EventEmitter(true);
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
      catchError(this._errorHandler),);
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

  private _put(url: string, body: any): Observable<any> {
    return this._http
      .put(url, body, this._generateRequestOptions()).pipe(
      map(this._mapResponse),
      catchError(this._errorHandler),);
  }

  private _post(url: string, body: any): Observable<any> {
    return this._http
      .post(url, body, this._generateRequestOptions()).pipe(
      map(this._mapResponse),
      catchError(this._errorHandler),);
  }

  getAuthoriseUrl(memberType: string, attributes: string): string {
    let clientId = '';
    if (memberType === CONFIGURATION.member_type_code.borrower) {
      clientId = ENVIRONMENT.myinfo.borrower.clientId;
    } else if (memberType === CONFIGURATION.member_type_code.investor) {
      clientId = ENVIRONMENT.myinfo.investor.clientId;
    }
    const redirect_uri = ENVIRONMENT.myinfo.callbackUrl;
    const uuid = UUID.UUID();
    const authoriseUrl = ENVIRONMENT.service.myinfo + '/authorise'
      + '?client_id=' + clientId
      + '&attributes=' + attributes
      + '&purpose=' + 'borrowerSignUp'
      + '&state=' + uuid
      + '&redirect_uri=' + redirect_uri;

    return authoriseUrl;
  }

}
