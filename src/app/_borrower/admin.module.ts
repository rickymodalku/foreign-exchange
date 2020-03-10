import { TwoFaModule } from './../components/two-fa/two-fa.module';
// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import {
  CheckboxModule,
  ScheduleModule
} from 'primeng/primeng';
import {
  MatSelectModule,
  MatTabsModule
} from '@angular/material';
import { AdminRouting } from './admin.routing';
import { SharedModule } from '../shared.module';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { SwiperModule } from 'ngx-swiper-wrapper';
// =======================
// == COMPONENTS IMPORT ==
// =======================
import { ActivityComponent } from './activity/activity.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { NewLoanComponent } from './new-loan/new-loan.component';
import { PartnerComponent } from './partner/partner.component';
import { SignupFormBorrowerIDComponent } from './sign-up/sign-up-id.component';
import { SignupFormBorrowerSGComponent } from './sign-up/sign-up-sg.component';
import { SignupFormBorrowerMYComponent } from './sign-up/sign-up-my.component';
import { SignupFormBorrowerComponent } from './sign-up/sign-up.component';
import { ReferralBorrowerComponent } from './referral/referral.component';
import { RepaymentComponent } from './repayment/repayment.component';
import { SettingComponent } from './setting/setting.component';
import { StatementBorrowerComponent } from './statement/statement.component';
import { DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    ActivityComponent,
    DashboardComponent,
    GettingStartedComponent,
    NewLoanComponent,
    PartnerComponent,
    ReferralBorrowerComponent,
    RepaymentComponent,
    SettingComponent,
    StatementBorrowerComponent,
    SignupFormBorrowerIDComponent,
    SignupFormBorrowerSGComponent,
    SignupFormBorrowerMYComponent,
    SignupFormBorrowerComponent
  ],
  imports: [
    AdminRouting,
    CheckboxModule,
    DropzoneModule,
    MatSelectModule,
    MatTabsModule,
    ScheduleModule,
    SharedModule,
    SwiperModule,
    TwoFaModule,
    MatCheckboxModule
  ],
  providers: [
    DatePipe
  ]
})

export class AdminBorrowerModule { }
