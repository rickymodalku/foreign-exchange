import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { TwoFaModule } from './../components/two-fa/two-fa.module';
import { AccountActivationComponent } from './account-activation/account-activation.component';
import { SignupFormInvestorComponent } from './sign-up/sign-up.component';
import { ActivityComponent } from './activity/activity.component';
import { AgreementComponent } from './agreement/agreement.component';
import { BrowseLoanComponent } from './browse-loan/browse-loan.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepositComponent } from './deposit/deposit.component';
import { RdnActivationComponent } from './rdn-activation/rdn-activation.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ReferralInvestorComponent } from './referral/referral.component';
import { SbnRetailComponent } from './sbn-retail/sbn-retail.component';
import { StatementInvestorComponent } from './statement/statement.component';
import { SettingComponent } from './setting/setting.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { AuthGuard } from '../services/auth-guard.service';

const ROUTES: Routes = [
  {
    path: '',
    canActivate: [
      AuthGuard
    ],
    children: [
      {
        path: 'sign-up',
        canActivate: [
          AuthGuard
        ],
        component: SignupFormInvestorComponent
      },
      {
        path: 'activity',
        canActivate: [
          AuthGuard
        ],
        component: ActivityComponent
      },
      {
        path: 'browse-loan',
        canActivate: [
          AuthGuard
        ],
        component: BrowseLoanComponent
      },
      {
        path: 'deposit',
        canActivate: [
          AuthGuard
        ],
        component: DepositComponent
      },
      {
        path: 'overview',
        canActivate: [
          AuthGuard
        ],
        component: DashboardComponent
      },
      {
        path: 'portfolio',
        canActivate: [
          AuthGuard
        ],
        component: PortfolioComponent
      },
      {
        path: 'referral',
        canActivate: [
          AuthGuard
        ],
        component: ReferralInvestorComponent
      },
      {
        path: 'statement',
        canActivate: [
          AuthGuard
        ],
        component: StatementInvestorComponent
      },
      {
        path: 'setting',
        canActivate: [
          AuthGuard
        ],
        component: SettingComponent
      },
      {
        path: 'setting/:tab',
        canActivate: [
          AuthGuard
        ],
        component: SettingComponent
      },
      {
        path: 'subscription-agreement',
        canActivate: [
          AuthGuard
        ],
        component: AgreementComponent
      },
      {
        path: 'withdrawal',
        canActivate: [
          AuthGuard
        ],
        component: WithdrawalComponent
      },
      {
        path: 'sbn-retail',
        canActivate: [
          AuthGuard
        ],
        component: SbnRetailComponent
      },
      {
        path: 'rdn-activation',
        canActivate: [
          AuthGuard
        ],
        component: RdnActivationComponent
      },
      {
        path: '',
        component: AccountActivationComponent
      },
      // {
      //   path: '**',
      //   component: AccountActivationComponent
      // }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES)
  ],
  exports: [
    RouterModule,
    TwoFaModule
  ]
})
export class AdminRouting { }
