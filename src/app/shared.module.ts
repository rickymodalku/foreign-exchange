// ====================
// == MODULES IMPORT ==
// ====================
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatCheckboxModule, MatSelectModule, MatRadioModule } from '@angular/material';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard';
import {
  CalendarModule,
  ProgressBarModule,
  RadioButtonModule
} from 'primeng/primeng';
import { SliderModule } from 'primeng/slider';

import { DatePipe } from '@angular/common';
import {
  ModalModule
} from './components/modal/modal.module';

// =====================
// == SERVICES IMPORT ==
// =====================

// =======================
// == COMPONENTS IMPORT ==
// =======================
import { ReferralComponent } from './components/shared/referral.component';
import { SettingAutoInvestmentComponent } from './components/shared/setting-auto-investment.component';
import { SettingBankComponent } from './components/shared/setting-bank.component';
import { SettingAccreditedDeclarationComponent } from './components/shared/setting-accredited-declaration.component';
import { SettingPasswordComponent } from './components/shared/setting-password.component';
import { SettingPersonalComponent } from './components/shared/setting-personal.component';
import { SettingSubscriptionAgreementComponent } from './components/shared/setting-subscription-agreement.component';
import { SettingPriorityInvestmentComponent } from './components/shared/setting-priority-investment.component';
import { StatementListComponent } from './components/shared/statement-list.component';
import { InvoiceListComponent } from './components/shared/invoice-list.component';
import { SGRiskDisclosureComponent } from './components/risk-disclosure/risk-disclosure.component';
import { SGSuitabilityAssessmentComponent } from './components/suitability-assessment/suitability-assessment.component';
import { SGReverificationBannerComponent } from './components/reverification-banner/reverification-banner.component';
import { FsProgressBar } from './components/shared/fs-prime-progressbar';
import { TwoFaModule } from './components/two-fa/two-fa.module';
import { OnboardingTestimonialSwiperComponent } from './components/onboarding-testimonial-swiper/onboarding-testimonial-swiper.component';

@NgModule({
  declarations: [
    ReferralComponent,
    SettingAutoInvestmentComponent,
    SettingBankComponent,
    SettingAccreditedDeclarationComponent,
    SettingPasswordComponent,
    SettingPersonalComponent,
    StatementListComponent,
    InvoiceListComponent,
    FsProgressBar,
    SettingSubscriptionAgreementComponent,
    SettingPriorityInvestmentComponent,
    SGRiskDisclosureComponent,
    SGReverificationBannerComponent,
    SGSuitabilityAssessmentComponent,
    OnboardingTestimonialSwiperComponent,
  ],
  imports: [
    CalendarModule,
    ClipboardModule,
    CommonModule,
    DropzoneModule,
    FormsModule,
    HttpModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    RadioButtonModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    ProgressBarModule,
    SliderModule,
    SwiperModule,
    TwoFaModule,
    RouterModule,
  ],
  exports: [
    CalendarModule,
    CommonModule,
    FormsModule,
    HttpModule,
    ProgressBarModule,
    RadioButtonModule,
    ReactiveFormsModule,
    ReferralComponent,
    SettingAutoInvestmentComponent,
    SettingAccreditedDeclarationComponent,
    SettingBankComponent,
    SettingPasswordComponent,
    SettingPersonalComponent,
    TranslateModule,
    ModalModule,
    StatementListComponent,
    InvoiceListComponent,
    FsProgressBar,
    SettingSubscriptionAgreementComponent,
    SettingPriorityInvestmentComponent,
    SGRiskDisclosureComponent,
    SGReverificationBannerComponent,
    SGSuitabilityAssessmentComponent,
    OnboardingTestimonialSwiperComponent,
  ],
  providers: [
    DatePipe
  ]
})
export class SharedModule { }
