
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  Response,
  ResponseContentType,
  RequestOptions,
  RequestOptionsArgs
} from '@angular/http';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
const snakeCase = require('lodash');
@Injectable()
export class BaseService {
  myInfoData: any;
  constructor(
    private _authService: AuthService,
    private _http: Http,
    private _router: Router
  ) {
  }

  protected _errorHandler(error: any): Observable<any> {
    let json;
    try {
      json = error.json();
    } catch (e) {
      return observableThrowError(error);
    }

    return observableThrowError(json);
  }

  protected _generateRequestOptions(): RequestOptionsArgs {
    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Accept', 'application/json');
    options.headers.append('Content-Type', 'application/json');
    return options;
  }

  protected _mapResponse(response: Response): any {
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

  getUrlWithParams(url: string, httpParams: HttpParams): string {
    let urlWithParams = url;
    if ( urlWithParams && httpParams) {
      if (httpParams.keys().length > 0) {
        urlWithParams = `${urlWithParams}?${httpParams.toString()}`;
      }
      return urlWithParams;
    }
    return null;
  }

  get(url: string): Observable<any> {
    return this._http
      .get(url, this._generateRequestOptions()).pipe(
      map(this._mapResponse),
      catchError(this._errorHandler),);
  }

  put(url: string, body: any): Observable<any> {
    return this._http
      .put(url, body, this._generateRequestOptions()).pipe(
      map(this._mapResponse),
      catchError(this._errorHandler),);
  }

  post(url: string, body: any): Observable<any> {
    return this._http
      .post(url, body, this._generateRequestOptions()).pipe(
      map(this._mapResponse),
      catchError(this._errorHandler),);
  }

  delete(url: string): Observable<any> {
    return this._http
      .delete(url, this._generateRequestOptions()).pipe(
      map(this._mapResponse),
      catchError(this._errorHandler),);
  }

  toSnakeCaseRequestBody(body: object): object {
    let requestBody = {};
    const keys = Object.keys(body);
    if (keys.length > 0 ) {
      keys.forEach( key => {
        requestBody[snakeCase(key)] = body[key]
      });
    } 
    return requestBody;
  }
  
}


