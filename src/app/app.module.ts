import { ENVIRONMENT } from './../environments/environment.staging';
// ====================
// == MODULES IMPORT ==
// ====================
import * as Raven from 'raven-js';
import { NgModule, ErrorHandler } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AngularFireModule } from 'angularfire2';
import {
  AngularFireDatabase,
  AngularFireDatabaseModule
} from 'angularfire2/database';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  Http,
  HttpModule,
  RequestOptions,
  XHRBackend
} from '@angular/http';
import {
  MatCheckboxModule,
  MatSelectModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { DeviceDetectorModule } from 'ngx-device-detector';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts';
import { ClipboardModule } from 'ngx-clipboard';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import {
  SWIPER_CONFIG,
  SwiperModule,
  SwiperConfigInterface
} from 'ngx-swiper-wrapper';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { CookieService } from 'ngx-cookie-service';
import {
  AccordionModule,
  CalendarModule,
  CarouselModule,
  DropdownModule,
  ProgressBarModule,
} from 'primeng/primeng';
import {
  TwoFaModule
} from './components/two-fa/two-fa.module';
import { AppInterceptor } from './app.interceptor';
import { ROUTES } from './app.routing';
import { NewsletterModule } from '../app/_public/newsletter/newsletter.module';
import {
  ModalModule
} from './components/modal/modal.module';
import { registerLocaleData } from '@angular/common';
import localeID from '@angular/common/locales/id';

// =====================
// == SERVICES IMPORT ==
// =====================
import { ActivityService } from './services/activity.service';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { BaseParameterService } from './services/base-parameter.service';
import { MyInfoMappingService } from './services/myinfo-mapping.service';
import { CryptographyService } from './services/cryptography.service';
import { DialogService } from './services/dialog.service';
import { DocumentService } from './services/document.service';
import { FinanceService } from './services/finance.service';
import { LanguageService } from './services/language.service';
import { ReviewAppService } from './services/review-app.service';
import { LoadingService } from './services/loading.service';
import { LoanService } from './services/loan.service';
import { MemberService } from './services/member.service';
import { MetaService } from './services/meta.service';
import { NoteService } from './services/note.service';
import { NotificationService } from './services/notification.service';
import { ReferralService } from './services/referral.service';
import { SecurityService } from './services/security.service';
import { ScriptInjectorService } from './services/script-injector.service';
import { UserService } from './services/user.service';
import { UtilityService } from './services/utility.service';
import { MathUtilitiesService } from './services/math-utilities.service';
import { ValidatorService } from './services/validator.service';
import { WindowService } from './services/window.service';
import { FormService } from './services/form.service';
import { MaintenanceService } from './services/maintenance.service';
import { ModalService } from './services/modal.service';
import { MyInfoService } from './services/myinfo.service';
import { MenuService } from './services/menu.service';
import { DepositService } from './services/deposit.service';
import { EventService } from './services/event.service';
import { AutoFormatService } from './services/auto-format.service';
import { BaseService } from './services/base.service';
import { TwoFaService } from './services/two-fa.service';
import { CustomPreloading } from './services/preload-strategy.service';
import { CareerService } from './services/career.service';
import { FeatureFlagService } from './services/feature-flag.service';
import { MessageService } from './services/message.service';
// =======================
// == COMPONENTS IMPORT ==
// =======================
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';
import { LoadingComponent } from './components/loading.component';
import { NotificationComponent } from './components/notification.component';
import { NotFoundPageComponent } from './components/not-found-page.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';

// =======================
// == DIRECTIVES IMPORT ==
// =======================

// ====================
// == LOADERS IMPORT ==
// ====================
import { FirebaseTranslationLoader } from './loaders/firebase-translation.loader';

// ===============
// == CONSTANTS ==
// ===============
import CONFIGURATION from '../configurations/configuration';
const Highcharts = require('highcharts');

Highcharts.setOptions({
  lang: {
    thousandsSep: CONFIGURATION.format.thousands_separator,
    decimalPoint: CONFIGURATION.format.decimal_separator,
  }
});
registerLocaleData(localeID, 'id');
// ===============
// == FACTORIES ==
// ===============
export function firebaseTranslationLoaderFactory(angularFireDatabase: AngularFireDatabase) {
  return new FirebaseTranslationLoader(angularFireDatabase);
}

export function highchartsFactory() {
  return highcharts;
}

export function httpFactory(
  authService: AuthService,
  loadingService: LoadingService,
  requestOptions: RequestOptions,
  router: Router,
  xhrBackend: XHRBackend,
  languageService: LanguageService
) {
  return new AppInterceptor(authService, xhrBackend, loadingService, requestOptions, router, languageService);
}

export class CustomMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return '';
  }
}

Raven.config('https://a2d00b80104f4121b9654d9999473e5f@sentry.io/227533').install();
Raven.setEnvironment(ENVIRONMENT.environment_name);
Raven.setRelease(ENVIRONMENT.version);

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    console.log(err);
    Raven.captureException(err.originalError || err);
  }
}

export function provideErrorHandler() {
  if (ENVIRONMENT.sentry_logging) {
    return new RavenErrorHandler();
  } else {
    return new ErrorHandler();
  }
}

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LoadingComponent,
    NotificationComponent,
    NotFoundPageComponent,
    MaintenanceComponent,
  ],
  imports: [
    AccordionModule,
    NewsletterModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(ENVIRONMENT.firebase),
    BrowserAnimationsModule,
    BrowserModule,
    CalendarModule,
    CarouselModule,
    ChartModule,
    ClipboardModule,
    DropdownModule,
    DropzoneModule,
    FormsModule,
    HttpModule,
    MatCheckboxModule,
    MatSelectModule,
    NgxWebstorageModule.forRoot(),
    NoopAnimationsModule,
    ProgressBarModule,
    ReactiveFormsModule,
    DeviceDetectorModule.forRoot(),
    SwiperModule,
    ModalModule,
    TranslateModule.forRoot({
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler },
      loader: {
        provide: TranslateLoader,
        useFactory: firebaseTranslationLoaderFactory,
        deps: [
          AngularFireDatabase
        ]
      }
    }),
    TwoFaModule,
    RouterModule.forRoot(ROUTES, { preloadingStrategy: CustomPreloading })
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    ActivityService,
    AuthGuard,
    AuthService,
    BaseParameterService,
    MyInfoMappingService,
    CryptographyService,
    DecimalPipe,
    DocumentService,
    DialogService,
    FinanceService,
    LanguageService,
    LoadingService,
    LoanService,
    MathUtilitiesService,
    MemberService,
    MetaService,
    NoteService,
    NotificationService,
    ReferralService,
    SecurityService,
    ScriptInjectorService,
    UserService,
    UtilityService,
    ValidatorService,
    WindowService,
    ReviewAppService,
    FormService,
    MaintenanceService,
    ModalService,
    MyInfoService,
    MenuService,
    DepositService,
    EventService,
    AutoFormatService,
    TwoFaService,
    BaseService,
    FeatureFlagService,
    MessageService,
    CookieService,
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    },
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [
        AuthService,
        LoadingService,
        RequestOptions,
        Router,
        XHRBackend,
        LanguageService
      ]
    },
    { provide: ErrorHandler, useFactory: provideErrorHandler },
    CustomPreloading,
    CareerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
