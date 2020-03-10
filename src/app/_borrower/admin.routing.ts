import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { SignupFormBorrowerComponent } from './sign-up/sign-up.component';
import { NewLoanComponent } from './new-loan/new-loan.component';
import { PartnerComponent } from './partner/partner.component';
import { ReferralBorrowerComponent } from './referral/referral.component';
import { RepaymentComponent } from './repayment/repayment.component';
import { SettingComponent } from './setting/setting.component';
import { StatementBorrowerComponent } from './statement/statement.component';
import { AuthGuard } from '../services/auth-guard.service';

const ROUTES: Routes = [
  {
    path: 'sign-up',
    canActivate: [
      AuthGuard
    ],
    component: SignupFormBorrowerComponent
  },
  {
    path: '',
    canActivate:[
      AuthGuard
    ],
    children: [
      {
        path: 'activity',
        canActivate:[
          AuthGuard
        ],
        component: ActivityComponent
      },
      {
        path: 'new-loan',
        canActivate:[
          AuthGuard
        ],
        component: NewLoanComponent
      },
      {
        path: 'overview',
        canActivate:[
          AuthGuard
        ],
        component: DashboardComponent
      },
      {
        path: 'referral',
        canActivate:[
          AuthGuard
        ],
        component: ReferralBorrowerComponent
      },
      {
        path: 'repayment',
        canActivate:[
          AuthGuard
        ],
        component: RepaymentComponent
      },
      {
        path: 'partner',
        canActivate:[
          AuthGuard
        ],
        component: PartnerComponent
      },
      {
        path: 'setting',
        canActivate:[
          AuthGuard
        ],
        component: SettingComponent
      },
      {
        path: 'statement',
        canActivate:[
          AuthGuard
        ],
        component: StatementBorrowerComponent
      },
      {
        path: '',
        component: GettingStartedComponent
      },
      {
        path: '**',
        component: GettingStartedComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRouting {}
