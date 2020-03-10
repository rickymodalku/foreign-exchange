
import {throwError as observableThrowError,  Observable ,  Subject } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import {
    Headers,
    Http,
    Response,
    RequestOptions,
    RequestOptionsArgs
} from "@angular/http";
import { ENVIRONMENT } from '../../environments/environment';
import CONFIGURATION from '../../configurations/configuration';
import { EventEmitter } from '../models/generic.class';
import { Rating } from '../models/feedback.class';
import { HttpParams } from '@angular/common/http';
import { BaseService } from '../services/base.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class UserService {
  userLoginServiceEventEmitter: Subject<any>;
  userOnLoginServiceEventEmitter: EventEmitter;
    constructor(
      private _http: Http,
      private _baseService: BaseService,
      private _authService: AuthService,
      private _notificationService: NotificationService,
      private _localStorageService: LocalStorageService,
      ) {
      this.userLoginServiceEventEmitter = new Subject();
      this.userOnLoginServiceEventEmitter = new EventEmitter();
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
            catchError(this._errorHandler),);
    }

    private _mapResponse(response: Response): any {
        let json;
        try {
            json = response.json();
        } catch (e) {
            throw new Error(response.toString());
        }

        if (typeof json.status !== 'undefined' && json.status === 'error') {
            throw new Error(json);
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

    // Cryptography
    getPublicKey(): Observable<any> {
        let url = ENVIRONMENT.service.v2 + '/security/public_key';
        return this._get(url);
    }

    logIn(userName: string, password: string, uuid: string, otpChannel?: string): Observable<any> {
        let url = ENVIRONMENT.service.authentication + '/mobile_login/oauth/token';
        const formData = new FormData();
        let params = new HttpParams();
        formData.append('client_id', 'x_mobile_api_client');
        formData.append('country_id', CONFIGURATION.country_code);
        formData.append('grant_type', 'password');
        formData.append('password', password);
        formData.append('scope', 'read');
        formData.append('username', userName);
        formData.append('uuid', uuid);
        params = params.set('auth_type', '2fa');
        params = params.set('biometric_login_enabled', 'false');
        if (otpChannel) {
          params = params.set('otp_channel', otpChannel);
        }
        url = this._baseService.getUrlWithParams(url, params);
        return this._http
            .post(url, formData).pipe(
            map(response => response.json()),
            catchError(this._errorHandler),);
    }

    logInWithOtp(userName: string, uuid: string, refreshToken: string, otp: string): Observable<any> {
      let url = ENVIRONMENT.service.authentication + '/mobile_login/oauth/token';
      const formData = new FormData();
      let params = new HttpParams();
      formData.append('client_id', 'x_mobile_api_client');
      formData.append('country_id', CONFIGURATION.country_code);
      formData.append('grant_type', 'refresh_token');
      formData.append('scope', 'read');
      formData.append('username', userName);
      formData.append('uuid', uuid);
      formData.append('refresh_token', refreshToken);
      formData.append('2fa', otp);
      params = params.set('auth_type', '2fa');
      // For mobile backward compatibility
      params = params.set('biometric_login_enabled', 'false');
      url = this._baseService.getUrlWithParams(url, params);
      return this._http
          .post(url, formData).pipe(
          map(response => response.json()),
          catchError(this._errorHandler),);
  }

    refreshLogIn(refreshToken: string): Observable<any> {
        let url = ENVIRONMENT.service.authentication + '/mobile_login/oauth/token';
        let formData = new FormData();
        formData.append('client_id', 'x_mobile_api_client');
        formData.append('country_id', CONFIGURATION.country_code);
        formData.append('grant_type', 'refresh_token');
        formData.append('refresh_token', refreshToken);
        formData.append('scope', 'read');

        return this._http
            .post(url, formData).pipe(
            map(response => response.json()),
            catchError(this._errorHandler),);
    }

    logOut(): Observable<any> {
        let url = ENVIRONMENT.service.authentication + '/mobile_login/user/logout';
        return this._post(url, null);
    }

    saveQuestionnaires(feedbacks: Array<any>) {
        const endPoint = ENVIRONMENT.service.authentication + '/questionnaires';
        return this._post(endPoint,{ feedbacks: feedbacks });
    }

    refreshLoginCall(isReload = false) {
      this.refreshLogIn(this._authService.getRefreshToken())
      .subscribe(
      response => {
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (response.expires_in * 1000));
        this._authService.setExpiryTime(expiryDate);
        this._authService.setBearerToken(response.access_token);
        this._authService.setRefreshToken(response.refresh_token);
        if (isReload) {
          const reload = this._localStorageService.retrieve('session-expired-reload');
          this._notificationService.info(reload);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      },
      error => {
        const relogin = this._localStorageService.retrieve('session-expired-relogin');
        this._notificationService.info(relogin);
        this._authService.logOut();
      });
    }

    sendFeedback(authenticated: boolean, ratings: Array<Rating>, comments: string, country: string, email: string = null) {
        const endPoint = `${ENVIRONMENT.service.v2}/users/send-feedback${authenticated ? '' : '/logout'}`;
        const payload = {
            comments,
            country,
            email,
            ratings,
        };
        return this._post(endPoint, payload);
    }
}
