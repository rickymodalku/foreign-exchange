
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import {
    Headers,
    Http,
    Response,
    RequestOptions,
    RequestOptionsArgs
} from "@angular/http";
import { ENVIRONMENT } from '../../environments/environment';

@Injectable()
export class NoteService {
    constructor(
        private _http: Http
    ) {
    }

    private _errorHandler(error: any): Observable<any> {
        let json;
        try {
            json = error.json();
        } catch(e) {
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
                catchError(this._errorHandler),);
    }

    private _mapResponse(response: Response): any {
        let json;
        try {
            json = response.json();
        } catch(e) {
            throw new Error(response.toString());
        }

        if(typeof json.status !== 'undefined' && json.status === 'error') {
            throw new Error(json.message);
        }

        return json;
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

    // Note
    getRepaymentNotes(loanId: number): Observable<any>{
        let url = ENVIRONMENT.service.note + "/notes/repayments/loan/" + loanId + "?sort=desc";
        return this._get(url);
    }

    getRepaymentsNotes(loanIds: Array<number>): Observable<any>{
        let url = ENVIRONMENT.service.note + "/notes/available/collection_ids?collection_ids=" + loanIds.join(',') + "&note_type=REPAYMENT";
        return this._get(url);
    }
}
