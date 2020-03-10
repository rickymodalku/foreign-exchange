import {
  RouterModule,
  Routes
} from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';
import { NotFoundPageComponent } from './components/not-found-page.component';

export const ROUTES: Routes = [
  {
    path: 'admin-borrower',
    loadChildren: './_borrower/admin.module#AdminBorrowerModule',
    canActivate: [
      AuthGuard
    ],
    data: { preload: true }
  },
  {
    path: 'admin-investor',
    loadChildren: './_investor/admin.module#AdminInvestorModule',
    canActivate: [
      AuthGuard
    ],
    data: { preload: true }
  },
  {
    path: 'myinfo_callback',
    loadChildren: './_public/myinfo-callback/myinfo-callback.module#MyInfoCallbackModule'
  },
  {
    path: 'career',
    loadChildren: './_public/career/career.module#CareerModule'
  },
  {
    path: 'faq',
    loadChildren: './_public/faq/faq.module#FaqModule'
  },
  {
    path: 'log-in',
    loadChildren: './_public/log-in/log-in.module#LogInModule'
  },
  {
    path: 'about',   redirectTo: '/about-us', pathMatch: 'full'
  },
  {
    path: 'about-us',
    loadChildren: './_public/about-us/about-us.module#AboutUsModule',
  },
  {
    path: 'password',
    loadChildren: './_public/password/password.module#PasswordModule'
  },
  {
    path: 'privacy-notice',
    loadChildren: './_public/privacy-notice/privacy-notice.module#PrivacyNoticeModule'
  },
  {
    path: 'rdp2p-notice',
    loadChildren: './_public/rdp2p-term-condition/rdp2p-term-condition.module#Rdp2pTermConditionModule'
  },
  {
    path: 'privacy-notice/:version',
    loadChildren: './_public/privacy-notice/privacy-notice.module#PrivacyNoticeModule'
  },
  {
    path: 'privacy-notice-invoice-financing',
    loadChildren: './_public/privacy-notice-invoice-financing/privacy-notice-invoice-financing.module#PrivacyNoticeInvoiceFinancingModule'
  },
  {
    path: 'sme-referral-agreement',
    loadChildren: './_public/sme-referral-agreement/sme-referral-agreement.module#SMEReferrealAgreementModule'
  },
  {
    path: 'statistics',
    redirectTo: 'progress',
    pathMatch: 'full'
  },
  {
    path: 'investor-loyalty',
    loadChildren: './_public/loyalty/loyalty.module#LoyaltyModule'
  },
  {
    path: 'progress',
    loadChildren: './_public/progress/progress.module#ProgressModule'
  },
  {
    path: 'response',
    loadChildren: './_public/response/response.module#ResponseModule'
  },
  {
    path: 'sign-up/forms/borrower',
    loadChildren: './_public/signup-form-borrower/signup-form-borrower.module#SignupFormBorrowerModule'
  },
  {
    path: 'sign-up/forms/investor',
    loadChildren: './_public/signup-form-investor/signup-form-investor.module#SignupFormInvestorModule'
  },
  {
    path: 'forgot-password',
    loadChildren: './_public/forgot-password/forgot-password.module#ForgotPasswordModule'
  },
  {
    path: 'tos', redirectTo: '/terms-of-service', pathMatch: 'full'
  },
  {
    path: 'term-condition',
    loadChildren: './_public/term-condition/term-condition.module#TermConditionModule'
  },
  {
    path: 'term-condition-referral',
    loadChildren: './_public/term-condition-referral/term-condition-referral.module#TermConditionReferralModule'
  },
  {
    path: 'term-condition-loyalty',
    loadChildren: './_public/term-condition-loyalty/term-condition-loyalty.module#TermConditionLoyaltyModule'
  },
  {
    path: 'terms-of-service',
    loadChildren: './_public/terms-of-service/terms-of-service.module#TermsOfServiceModule'
  },
  {
    path: 'platform-agreement',
    loadChildren: './_public/platform-agreement/platform-agreement.module#PlatformAgreementModule'
  },
  {
    path: 'user-agreement',
    loadChildren: './_public/platform-agreement/platform-agreement.module#PlatformAgreementModule'
  },
  {
    path: 'website-terms',
    loadChildren: './_public/website-terms/website-terms.module#WebsiteTermsModule'
  },
  {
    path: 'borrow/check-eligibility',
    loadChildren: './_public/check-eligibility/check-eligibility.module#CheckEligibilityModule'
  },
  {
    path: 'borrow/eligibility-results',
    loadChildren: './_public/check-eligibility/check-eligibility.module#CheckEligibilityModule'
  },
  {
    path: 'borrow',
    loadChildren: './_public/dashboard/borrower/borrower-dashboard.module#BorrowerDashboardModule'
  },
  {
    path: 'invest',
    loadChildren: './_public/dashboard/investor/investor-dashboard.module#InvestorDashboardModule'
  },
  {
    path: 'refer',
    loadChildren: './_public/dashboard/referral/referral-dashboard.module#ReferralDashboardModule'
  },
  {
    path: 'virtual-account',
    loadChildren: './_public/virtual-account/virtual-account.module#VirtualAccountModule'
  },
  {
    path: 'investor-loyalty',
    loadChildren: './_public/loyalty/loyalty.module#LoyaltyModule'
  },
  {
    path: 'refer/:section',
    loadChildren: './_public/dashboard/referral/referral-dashboard.module#ReferralDashboardModule'
  },
  {
    path: 'allocation-policy',
    loadChildren: './_public/allocation-policy/allocation-policy.module#AllocationPolicyModule'
  },
  {
    path: 'complaint-handling',
    loadChildren: './_public/complaint-handling/complaint-handling.module#ComplaintHandlingModule'
  },
  {
    path: 'risk-disclosure',
    loadChildren: './_public/risk-disclosure/risk-disclosure.module#RiskDisclosureModule'
  },
  {
    path: 'sign-up',
    loadChildren: './_public/sign-up/sign-up.module#SignUpModule'
  },
  {
    path: 'sign-up/investor',
    redirectTo: 'sign-up-investor',
    pathMatch: 'full'
  },
  {
    path: 'sign-up/borrower',
    redirectTo: 'sign-up-borrower',
    pathMatch: 'full'
  },
  {
    path: 'sign-up-investor',
    loadChildren: './_public/sign-up/sign-up.module#SignUpModule'
  },
  {
    path: 'sign-up-borrower',
    loadChildren: './_public/sign-up/sign-up.module#SignUpModule'
  },
  // Disable sbn retail until needed again, search sbn-retail to find all related codes
  {
    path: 'sbn-info',
    loadChildren: './_public/sbn-info/sbn-info.module#SbnInfoModule'
  },
  {
    path: 'xero',
    loadChildren: './_public/xero/xero.module#XeroModule'
  },
  {
    path: '',
    loadChildren: './_public/home/home.module#HomeModule'
  },
  { path: 'not-found-page', component: NotFoundPageComponent },
  { path: '**', redirectTo: '/not-found-page' },

];
