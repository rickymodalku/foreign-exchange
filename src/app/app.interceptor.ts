
import {throwError as observableThrowError, 
    Observable
} from 'rxjs';

import {finalize, tap, catchError} from 'rxjs/operators';
import {
    ConnectionBackend,
    Headers,
    Http,
    Response,
    Request,
    RequestOptions,
    RequestOptionsArgs
} from "@angular/http";
import { UUID } from 'angular2-uuid';
import {
    Router
} from "@angular/router";
import {
  AuthService
} from './services/auth.service';
import {
  LoadingService
} from './services/loading.service';

import { LanguageService } from './services/language.service';
export class AppInterceptor extends Http {
    private _url: string;

    constructor(
        private _authService: AuthService,
        private _connectionBackend: ConnectionBackend,
        private _loadingService: LoadingService,
        private _requestOptions: RequestOptions,
        private _router: Router,
        private _languageService: LanguageService
    ) {
        super(_connectionBackend, _requestOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this._intercept(super.request(url, options));
    }

    get(url: string, options?: RequestOptionsArgs): Observable<any> {
        this._url = url;
        this._requestInterceptor();
        return this._intercept(
            super.get(url, this._generateRequestOptions(options, url.indexOf("/p/") >= 0)).pipe(
                catchError(this._onCatch),
                tap((res: Response) => {
                    this._onSuccess(res);
                }, (error: any) => {
                    this._onError(error);
                }),
                finalize(() => {
                    this._onFinally();
                }),)
        );
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        this._url = url;
        this._requestInterceptor();
        return this._intercept(
            super.post(url, body, this._generateRequestOptions(options, url.indexOf("/p/") >= 0)).pipe(
                catchError(this._onCatch),
                tap((res: Response) => {
                    this._onSuccess(res);
                }, (error: any) => {
                    this._onError(error);
                }),
                finalize(() => {
                    this._onFinally();
                }),)
        );
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<any> {
        this._url = url;
        this._requestInterceptor();
        return this._intercept(
            super.put(url, body, this._generateRequestOptions(options, url.indexOf("/p/") >= 0)).pipe(
                catchError(this._onCatch),
                tap((res: Response) => {
                    this._onSuccess(res);
                }, (error: any) => {
                    this._onError(error);
                }),
                finalize(() => {
                    this._onFinally();
                }),)
        );
    }

    patch(url: string, body: string, options?: RequestOptionsArgs): Observable<any> {
        this._url = url;
        this._requestInterceptor();
        return this._intercept(
            super.patch(url, body, this._generateRequestOptions(options, url.indexOf("/p/") >= 0)).pipe(
                catchError(this._onCatch),
                tap((res: Response) => {
                    this._onSuccess(res);
                }, (error: any) => {
                    this._onError(error);
                }),
                finalize(() => {
                    this._onFinally();
                }),)
        );
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<any> {
        this._url = url;
        this._requestInterceptor();
        return this._intercept(
            super.delete(url, this._generateRequestOptions(options, url.indexOf("/p/") >= 0)).pipe(
                catchError(this._onCatch),
                tap((res: Response) => {
                    this._onSuccess(res);
                }, (error: any) => {
                    this._onError(error);
                }),
                finalize(() => {
                    this._onFinally();
                }),)
        );
    }

    options(url: string, options?: RequestOptionsArgs): Observable<any> {
        this._requestInterceptor();
        return this._intercept(
            super.options(url, options).pipe(
                catchError(this._onCatch),
                tap((res: Response) => {
                    this._onSuccess(res);
                }, (error: any) => {
                    this._onError(error);
                }),
                finalize(() => {
                    this._onFinally();
                }),)
        );
    }

    private _generateRequestOptions(options?: RequestOptionsArgs, omitHeader?: boolean): RequestOptionsArgs {
        if(!options) {
            options = new RequestOptions();
        }
        if(!options.headers) {
            options.headers = new Headers();
        }

        if(!omitHeader) {
            this._addDefaultHeaders(options.headers);
        }

        return options;
    }

    private _addDefaultHeaders(headers: Headers): void {
        if (!headers.has("Authorization")) {
            let bearerToken = this._authService.getBearerToken();
            if (bearerToken !== "") {
                headers.append('Authorization', 'Bearer ' + bearerToken);
            }
        };

        if (!headers.has('accept-language')) {
          const defaultLanguage = this._languageService.getDefaultLanguage();
          this.setAcceptLanguage(headers, defaultLanguage);
        }
    }

    private setAcceptLanguage (headers: Headers, language: string) {
      if (language === 'en') {
        headers.set('accept-language', 'en;q=0.9,en-US,en;q=0.8,zh-TW;q=0.6');
      } else if (language === 'id') {
        headers.set('accept-language', 'id;q=0.9,en-US,en;q=0.8,zh-TW;q=0.6');
      } else if (language === 'zh') {
        headers.set('accept-language', 'zh;q=0.9,en-US,en;q=0.8,zh-TW;q=0.6');
      }
    }

    private _intercept(observable: Observable<Response>): Observable<Response> {
        let uuid = UUID.UUID();
        this._loadingService.beforeRequest.emit(uuid);
        return observable.pipe(tap(
            () => {
                this._loadingService.afterRequest.emit(uuid);
            },
            error => {
                this._loadingService.afterRequest.emit(uuid);
            }
        ));
    }

    private _requestInterceptor(): void {
    }

    private _responseInterceptor(): void {
    }

    private _onCatch(error: any, caught: Observable<any>): Observable<any> {
        return observableThrowError(error);
    }

    private _onSuccess(res: Response): void {
    }

    private _onError(error: any): void {
        const expiryTime = this._authService.getExpiryTime();
        const sessionAbleToRefresh = expiryTime !== '' && this._authService.getRememberMe();
        const omitError = (this._url.indexOf('/mobile_login/oauth/token') >= 0);
        if (!omitError && (error.status === 401 || error.status === 403) && !sessionAbleToRefresh) {
            this._authService.logOut();
            this._router.navigate(['/log-in']);
            this._loadingService.clearRequest.emit(true);
        }
    }

    private _onFinally(): void {
        this._responseInterceptor();
    }
}
