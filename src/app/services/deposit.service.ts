
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
    Headers,
    Http,
    Response,
    RequestOptions,
    RequestOptionsArgs,
    URLSearchParams
} from '@angular/http';
import { ENVIRONMENT } from '../../environments/environment';

@Injectable()
export class DepositService {
    constructor(
        private _http: Http
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
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Accept', 'application/json');
        options.headers.append('Content-Type', 'application/json');

        return options;
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

    getBankList(): Observable<Array<any>> {
        const url = ENVIRONMENT.service.payment_service + '/fpx/bank_list';
        return this._http
                .get(url, this._generateRequestOptions()).pipe(
                map(this._mapResponse),
                catchError(this._errorHandler),);
    }

    createFPXTransaction(txnData: object, username: string): Observable<object> {
      const url = ENVIRONMENT.service.payment_service + '/transaction/new';
      const options = this._generateRequestOptions();
      return this._http
        .post(url, txnData, options).pipe(
        map(this._mapResponse),
        catchError(this._errorHandler),);
    }

    startFPXTransaction(txnData, username) {
      const url = ENVIRONMENT.service.payment_service + '/transaction/start';
      const options = this._generateRequestOptions();
      return this._http
        .post(url, txnData, options).pipe(
        map(this._mapResponse),
        catchError(this._errorHandler),);
    }
}
