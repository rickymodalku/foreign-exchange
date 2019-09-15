
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { environment } from '../../environments/environment';

@Injectable()
export class ForeignExchangeService {
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

  private _get(url: string): Observable<any> {
    return this._http
      .get(url).pipe(
        map(this._mapResponse),
        catchError(this._errorHandler));
  }

  getCurrencyRate(): Observable<any> {
    const url = environment.service.exchangeRate + '/latest';
    return this._get(url);
  }
}
