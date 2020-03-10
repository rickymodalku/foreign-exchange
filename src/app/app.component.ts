
import { forkJoin as observableForkJoin, Observable } from 'rxjs';
import {
  Component,
  Renderer2,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  Router
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from './services/auth.service';
import { FinanceService } from './services/finance.service';
import { LanguageService } from './services/language.service';
import { MetaService } from './services/meta.service';
import { MessageService } from './services/message.service';
import { NotificationService } from './services/notification.service';
import { MaintenanceService } from './services/maintenance.service';
import { UserService } from './services/user.service';
import { CareerService } from './services/career.service';
import { CookieService } from 'ngx-cookie-service';
import CONFIGURATION from '../configurations/configuration';
import { ENVIRONMENT } from '../environments/environment';

import LogRocket from 'logrocket';

declare let CryptoJS, HmacSHA256: Function;

@Component({
  selector: 'modalku-app',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  showFooter: boolean;
  currentUrl: string;
  defaultMeta: any;
  isMaintenanceMode: boolean;
  isServiceDownMode: boolean;
  ENVIRONMENT: any;

  public constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _languageService: LanguageService,
    private _localStorageService: LocalStorageService,
    private _metaService: MetaService,
    private messageService: MessageService,
    private _notificationService: NotificationService,
    private _renderer: Renderer2,
    private _router: Router,
    private _translateService: TranslateService,
    private _userService: UserService,
    private _maintenanceService: MaintenanceService,
    private _careerService: CareerService,
    private _cookieService: CookieService
  ) {
    // Maintenance Mode
    this.isMaintenanceMode = false;
    this.isServiceDownMode = false;
    this.ENVIRONMENT = ENVIRONMENT;

  }

  ngOnInit() {
    this.messageService.sendMessage('initializeLdClient');
    if (ENVIRONMENT.environment_name === 'production' && CONFIGURATION.country_code === 'SG') {
      LogRocket.init('e1vw0o/fs');
    }
    this._careerService.logCareerLink();
    this._maintenanceService.onlyGetMaintenanceModeForStagingAndProduction().subscribe(response => {
      this.isMaintenanceMode = response || false;
    });

    this._maintenanceService.onlyGetServiceDownModeForStagingAndProduction().subscribe(response => {
      this.isServiceDownMode = response || false;
    });

    // Default Language
    this._activatedRoute
      .queryParams
      .subscribe((params: Params) => {
        const language = params['lang']
        if (language && language !== this._languageService.getDefaultLanguage()) {
          this._languageService.changeLanguage(language);
        }
        this._translateService.setDefaultLang(this._languageService.getDefaultLanguage());
      });
    // Set the language according to the cookie locale if there is no query params
    // The locale cookie will set zh-CN, id-ID, or en-US
    // Will be mapping the locale cookie to zh, id, and en respectively to
    // support backward compatibility for v3
    let languageLocale = this._cookieService.get('locale');
    let localeMapping = this._languageService.getLocaleMapping();
    let compatibleLocale = null;
    for (let [locale, localeWithCountry] of Object.entries(localeMapping)) {
      if (localeWithCountry === languageLocale) {
        compatibleLocale = locale;
        break;
      }
    }

    let searchParams = new URLSearchParams(location.search);
    if (!searchParams.has('lang') && compatibleLocale && compatibleLocale !== this._languageService.getDefaultLanguage()) {
      this._languageService.changeLanguage(compatibleLocale);
      this._translateService.setDefaultLang(this._languageService.getDefaultLanguage());
    }
    // Default Error Message
    this._translateService
      .get('form')
      .subscribe(response => {
        this._localStorageService.store('error-message', response['error']);
        this._localStorageService.store('unauthorized-message', response['unauthorized']);
        this._localStorageService.store('session-expired-reload', response['session-expired']['reload']);
        this._localStorageService.store('session-expired-relogin', response['session-expired']['relogin']);
        this._localStorageService.store('first-deposit-message', response['first-deposit']);
        this._localStorageService.store('activation-message', response['activation']);
      });

    // Router Event
    this._router
      .events
      .subscribe((e) => {
        if (e instanceof NavigationEnd) {
          window.scrollTo(0, 0);
          this.currentUrl = e.url;
          this.showFooter = this.currentUrl.indexOf('sign-up/forms') > -1
            || this.currentUrl.indexOf('admin-investor/subscription-agreement') > -1 ? true : false;
          this._injectMetaInformation();
          this._authService
            .setDisplayPublicNavigationBar(this.currentUrl.indexOf('admin-') < 0);
        }
      });

    // Refresh LogIn
    const expiryTime = this._authService.getExpiryTime();
    if (expiryTime !== '') {
      this._refreshLogIn(expiryTime);
    }
    this._localStorageService
      .observe(this._authService.getExpiryTimeKey())
      .subscribe((data) => {
        if (data) {
          this._refreshLogIn(this._authService.getExpiryTime());
        }
      });
    this.initializeGoogleTagManager();
    if (CONFIGURATION.zendesk.enable) {
      this.initializeZendesk();
    }
    if (CONFIGURATION.intercom.enable) {
      if (this._authService.getMemberId()) {
        const hash = CryptoJS.HmacSHA256(this._authService.getMemberId().toString(), CONFIGURATION.intercom.hashCode);
        const hashInHex = CryptoJS.enc.Hex.stringify(hash);
        window['Intercom']("boot", {
          app_id: CONFIGURATION.intercom.appId,
          email: this._authService.getUserName().toString(),
          user_id: this._authService.getMemberId().toString(),
          user_hash: hashInHex
        });
      } else {
        window['Intercom']("boot", { app_id: CONFIGURATION.intercom.appId });
        window['Intercom']("update");
      }
    }
  }
  private _injectMetaInformation(): void {
    let baseUrl = 'meta';
    if (this.currentUrl !== '/') {
      baseUrl += this.currentUrl.replace(/\//g, '.');
    } else {
      baseUrl += '.default';
    }
    observableForkJoin(
      this._translateService.get('meta.default'),
      this._translateService.get(baseUrl)
    ).subscribe(response => {
      this.defaultMeta = response[0];
      let meta = response[1];
      this._metaService.setTitle(typeof meta.title !== 'undefined' ? meta.title : this.defaultMeta.title);
      this._metaService.setKeyword(this._renderer, typeof meta.keyword !== 'undefined'
        ? meta.keyword : this.defaultMeta.keyword);
      this._metaService.setDescription(this._renderer, typeof meta.description !== 'undefined'
        ? meta.description : this.defaultMeta.description);
      this._metaService.setOgTitle(this._renderer, typeof meta.title !== 'undefined'
        ? meta.title : this.defaultMeta.title);
      this._metaService.setOgUrl(this._renderer, typeof meta.title !== 'undefined'
        ? meta.url : this.defaultMeta.url);
      this._metaService.setOgDescription(this._renderer, typeof meta.description !== 'undefined'
        ? meta.description : this.defaultMeta.description);
      this._metaService.setTwitterDescription(this._renderer, typeof meta.description !== 'undefined'
        ? meta.description : this.defaultMeta.description);
    });
  }

  private _refreshLogIn(curExpiryTime: string): void {
    const now = new Date();
    const end = new Date(curExpiryTime);
    const difference = end.getTime() - now.getTime();
    const userName = this._authService.getUserName();
    setTimeout(() => {
      const expiryTime = this._authService.getExpiryTime();
      if (expiryTime !== '' && this._authService.getRememberMe()) {
        this._userService.refreshLoginCall();
      } else {
        this._notificationService.info('Your session has expired, you are auto logged out.');
        this._authService.logOut();
      }
    }, difference);
  }

  private initializeGoogleTagManager() {
    const dataLayerLabel = 'dataLayer';
    const gtmID = CONFIGURATION.google_tag_manager_id;
    const dataLayerParam = dataLayerLabel !== 'dataLayer' ? '&l=' + dataLayerLabel : '';

    window['dataLayer'] = window['dataLayer'] || [];
    window[dataLayerLabel].push({
      'gtm.start': new Date().getTime(),
      'event': 'gtm.js'
    });
    const firstScript = document.getElementsByTagName('script')[0];
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmID}${dataLayerParam}`;
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    firstScript.parentNode.insertBefore(script, firstScript);
  }

  private initializeZendesk() {
    const zendeskKey = CONFIGURATION.zendesk.key;
    const firstScript = document.getElementsByTagName('script')[0];
    const script = document.createElement('script');
    script.src = `https://static.zdassets.com/ekr/snippet.js?key=${zendeskKey}`;
    script.type = 'text/javascript';
    script.id = 'ze-snippet';
    script.async = true;
    script.defer = true;
    firstScript.parentNode.insertBefore(script, firstScript);
  }

}
