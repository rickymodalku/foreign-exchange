
import { forkJoin as observableForkJoin, Observable } from 'rxjs';
import {
  Component,
  OnInit
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { MemberService } from '../../services/member.service';
import { FinanceService } from '../../services/finance.service';
import { NotificationService } from '../../services/notification.service';
import { UtilityService } from '../../services/utility.service';
import { TranslateService } from '@ngx-translate/core';
import CONFIGURATION from '../../../configurations/configuration';
import {
  SwiperComponent,
  SwiperConfigInterface
} from 'ngx-swiper-wrapper';
import { DecimalPipe } from '@angular/common';
import { ENVIRONMENT } from '../../../environments/environment';
import * as moment from 'moment';
import { Router } from '@angular/router';
@Component({
  templateUrl: './dashboard.html'
})

export class DashboardComponent implements OnInit {
  currency: string;
  decimalFormat: string;
  localeDecimalFormat: string;
  summary: any;
  today: any;
  borrowerOverviews: Array<any>;
  summaryRepaymentPeriods: Array<any>;
  borrowerOverviewsBaseConfiguration: Array<any>;
  mobileSwiperConfiguration: SwiperConfigInterface;
  borrowerSwiperPeriodConfiguration: SwiperConfigInterface;
  isBorrowerOverviewDataReady: boolean;
  currentlySelectedLoan: object;
  repaymentIndex: number;
  upcomingRepayments: Array<any>;
  ENVIRONMENT: any;
  masterData: any;

  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _financeService: FinanceService,
    private memberService: MemberService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _utilityService: UtilityService,
    private router: Router,
    private decimalPipe: DecimalPipe
  ) {
    this.currency = CONFIGURATION.currency_symbol;
    this.decimalFormat = CONFIGURATION.format.decimal;
    this.ENVIRONMENT = ENVIRONMENT;
    this.localeDecimalFormat = CONFIGURATION.format.locale;
    this.summary = null;
    this.today = new Date();
    this.isBorrowerOverviewDataReady = false;
    this.summaryRepaymentPeriods = [];
    this.upcomingRepayments = [];
    this.currentlySelectedLoan = {};
    this.repaymentIndex = null;
    this.mobileSwiperConfiguration = {
      direction: 'horizontal',
      keyboardControl: true,
      loop: true,
      mousewheelControl: false,
      pagination: '.swiper-pagination',
      paginationClickable: true,
      scrollbar: null,
      scrollbarDraggable: true,
      scrollbarHide: false,
      scrollbarSnapOnRelease: true,
      slidesPerView: 2
    };

    this.borrowerSwiperPeriodConfiguration = {
      direction: 'horizontal',
      mousewheelControl: false,
      paginationClickable: true,
      centeredSlides: true,
      scrollbar: null,
      scrollbarDraggable: true,
      scrollbarHide: false,
      scrollbarSnapOnRelease: true,
      pagination: '.swiper-pagination',
      prevButton: '.swiper-button-prev',
      nextButton: '.swiper-button-next',
      spaceBetween: 40,
      slidesPerView: 4,
      breakpoints: {
        // when window width is <= 480px
        420: {
          slidesPerView: 1,
          spaceBetween: 30
        },
        // when window width is <= 640px
        750: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        // when window width is <= 640px
        1024: {
          slidesPerView: 4,
          spaceBetween: 30
        }
      }
    };

    this.borrowerOverviewsBaseConfiguration = [
      {
        'key': 'total-loan-applied',
        'apiKey': 'total_loan_applied',
        'value': '0',
        'label': '',
        formatter: function (value) {
          return value;
        },
      },
      {
        'key': 'total-outstanding-balance',
        'apiKey': 'total_unpaid_amount',
        'value': '0',
        'label': '',
        formatter: function (value) {
          return `${this.currency} ${this.decimalPipe.transform(value, this.decimalFormat)}`;
        }.bind(this),
      },
      {
        'key': 'total-loan-approved',
        'apiKey': 'total_loan_approved',
        'value': '0',
        'label': '',
        formatter: function (value) {
          return value;
        },
      },
      {
        'key': 'current-month-due-amount',
        'apiKey': 'current_month_due_amount',
        'value': '0',
        'label': '',
        formatter: function (value) {
          return `${this.currency} ${this.decimalPipe.transform((value > 0 ? value : 0), this.decimalFormat)}`;
        }.bind(this),
      },
    ];
    this.masterData = {
      lastSignUpWebStatus: CONFIGURATION.last_sign_up_web_status,
    };
  }

  ngOnInit() {
    this.memberService.getMemberDetail().subscribe(
      response => {
        this._authService.setLastSignUStepWeb(response.lastSignUpStepWeb);
        switch (this._authService.getlastSignUpStepWeb()) {
          case this.masterData.lastSignUpWebStatus['accountVerification']:
          case this.masterData.lastSignUpWebStatus['borrowerPersonalInformation']:
          case this.masterData.lastSignUpWebStatus['borrowerBusinessInformation']:
          case this.masterData.lastSignUpWebStatus['borrowerFinancialInformation']:
            setTimeout(() => {
              this.router.navigate(['/admin-borrower/sign-up']);
            }, 0);
            break;
          default:
            setTimeout(() => {
              this.router.navigate(['/admin-borrower/overview']);
            }, 0);
            break;
        }
      },
      error => {
        this._notificationService.error();
      }
    );
    const today = new Date();
    const month = today.getMonth();
    const monthsAhead = 3
    const newEndMonth = (month + monthsAhead) % 12;
    const endMonth = newEndMonth === 0 ? 12 : newEndMonth;
    const endYear = month + 3 > 12 ? today.getFullYear() + 1 : today.getFullYear();

    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(endYear, endMonth, 0);
    observableForkJoin(
      this._translateService.get(`borrower-dashboard`),
      this._financeService.getBorrowerSummary()
    ).subscribe(responses => {
      const summaryTranslation = responses[0];
      this.summary = responses[1]['data'];

      this.borrowerOverviews = this.borrowerOverviewsBaseConfiguration.map(borrowerOverview => {
        return {
          value: this.summary ? borrowerOverview.formatter(this.summary[borrowerOverview.apiKey]) : '',
          label: summaryTranslation[borrowerOverview.key]
        };
      });
      this.isBorrowerOverviewDataReady = true;
    },
      error => {
        this._notificationService.error();
      });

    this._financeService.getBorrowerRepayments(startDate, endDate).subscribe(response => {
      const paymentStatusesList = this._baseParameterService.getPaymentStatusesList();
      this._utilityService.sortByKey(response.data, 'date', 'payment_deadline');
      this.upcomingRepayments = response.data.filter(function (value) {
        return (value.payment_status !== paymentStatusesList['paid']) && value.payment_status !== paymentStatusesList['late-repaid'];
      });
      this.currentlySelectedLoan = response.data[0];
    },
      error => {
        this._notificationService.error();
      });
  }

  selectRepayment(id) {
    this.currentlySelectedLoan = this.upcomingRepayments.find((loan, index) => {
      if (loan.id === id) {
        this.repaymentIndex = index;
        return true;
      }
    });
  }

  onRepaymentIndexChange(index) {
    this.currentlySelectedLoan = this.upcomingRepayments[index];
  }

}
