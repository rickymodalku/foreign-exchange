// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  MatSelectModule,
  MatTabsModule,
  MatCheckboxModule,
  MatRadioModule,
  MatButtonToggleModule,
  MatButtonModule,
  MatIconModule
} from '@angular/material';
import {
  AccordionModule,
  DropdownModule
} from 'primeng/primeng';
import { ClipboardModule } from 'ngx-clipboard';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { ChartModule } from 'angular2-highcharts';
import { AdminRouting } from './admin.routing';
import { SharedModule } from '../shared.module';
import { TwoFaModule } from '../components/two-fa/two-fa.module';

import { AutoFormatDirective } from '../directives/auto-format.directive';
// =======================
// == COMPONENTS IMPORT ==
// =======================
import { AccountActivationComponent } from './account-activation/account-activation.component';
import { AccountActivationSGComponent } from './account-activation/account-activation-sg.component';
import { AccountActivationIDComponent } from './account-activation/account-activation-id.component';
import { AccountActivationMYComponent } from './account-activation/account-activation-my.component';
import { AccountActivationVNComponent } from './account-activation/account-activation-vn.component';
import { ActivityComponent } from './activity/activity.component';
import { AgreementComponent } from './agreement/agreement.component';
import { AgreementIDComponent } from './agreement/agreement-id.component';
import { AgreementMYComponent } from './agreement/agreement-my.component';
import { AgreementSGComponent } from './agreement/agreement-sg.component';
import { AgreementVNComponent } from './agreement/agreement-vn.component';
import { SignupFormInvestorIDComponent } from './sign-up/sign-up-id.component';
import { SignupFormInvestorSGComponent } from './sign-up/sign-up-sg.component';
import { SignupFormInvestorMYComponent } from './sign-up/sign-up-my.component';
import { SignupFormInvestorComponent } from './sign-up/sign-up.component';
import { BrowseLoanComponent } from './browse-loan/browse-loan.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepositComponent } from './deposit/deposit.component';
import { DepositIDComponent } from './deposit/deposit-id.component';
import { DepositMYSGComponent } from './deposit/deposit-mysg.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { RdnActivationComponent } from './rdn-activation/rdn-activation.component';
import { ReferralInvestorComponent } from './referral/referral.component';
import { SbnRetailComponent } from './sbn-retail/sbn-retail.component';
import { StatementInvestorComponent } from './statement/statement.component';
import { SettingComponent } from './setting/setting.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';


import { WootricSurveyDirective } from '../directives/wootric-survey.directive';

@NgModule({
  declarations: [
    AccountActivationComponent,
    AccountActivationSGComponent,
    AccountActivationMYComponent,
    AccountActivationIDComponent,
    AccountActivationVNComponent,
    ActivityComponent,
    AgreementComponent,
    AgreementIDComponent,
    AgreementMYComponent,
    AgreementSGComponent,
    AgreementVNComponent,
    BrowseLoanComponent,
    BrowseLoanComponent,
    DashboardComponent,
    DepositComponent,
    DepositIDComponent,
    DepositMYSGComponent,
    PortfolioComponent,
    RdnActivationComponent,
    ReferralInvestorComponent,
    SbnRetailComponent,
    StatementInvestorComponent,
    SignupFormInvestorMYComponent,
    SignupFormInvestorIDComponent,
    SignupFormInvestorSGComponent,
    SignupFormInvestorComponent,
    SettingComponent,
    WithdrawalComponent,
    AutoFormatDirective,
    WootricSurveyDirective,
  ],
  imports: [
    AccordionModule,
    ClipboardModule,
    DropdownModule,
    AdminRouting,
    ChartModule,
    DropzoneModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTabsModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    SharedModule,
    SwiperModule,
    TwoFaModule
  ],
  providers: [
    DatePipe
  ]
})

export class AdminInvestorModule { }
