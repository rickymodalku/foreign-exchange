
import { forkJoin as observableForkJoin, Observable } from 'rxjs';
import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Activity } from '../../models/finance.class';
import { AuthService } from '../../services/auth.service';
import { FinanceService } from '../../services/finance.service';
import { MemberService } from '../../services/member.service';
import { BaseParameterService } from '../../services/base-parameter.service'
import { NotificationService } from '../../services/notification.service'
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from '../../services/utility.service';
import { MenuService } from '../../services/menu.service';
import CONFIGURATION from '../../../configurations/configuration';
import { LocalStorageService } from 'ngx-webstorage';
import { ModalService } from '../../services/modal.service';
import { ENVIRONMENT } from '../../../environments/environment';
import { FeatureFlagService } from '../../services/feature-flag.service';
import { BaseService } from '../../services/base.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { HttpParams } from '@angular/common/http';
import { capitalize } from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.html'
})

export class DashboardComponent implements OnInit {
  accountSummary: any;
  accountOverview: any;
  activityModel: any;
  activityTabs: any;
  appLink: any;
  annualisedPortfolioPerformance: any;
  chartModel: any;
  countryCode: string;
  currency: string;
  decimalFormat: string;
  deviceDetail: any;
  localeDecimalFormat: string;
  investorLabel: Array<any>;
  mobileSwiperConfiguration: SwiperConfigInterface;
  accountOverviewKeyMapping: any;
  accountOverviewMetrics: any;
  isInvestorOverviewDataReady: boolean;
  listOfMobileOperatingSystem: any;
  showGst: boolean;
  showAppBanner: boolean;
  accountActivated: boolean;
  showLegalPopup: boolean;
  activationStepCode: any;
  isUserActivated: boolean;
  memberActivationStatuses: any;
  CONFIGURATION: any;
  showRDNBanner: boolean;
  showYearInReviewBanner: boolean;
  ENVIRONMENT: any;
  yearInReviewLink: string;
  enableLoyaltyProgram: boolean;
  institutionalFlag: boolean;
  loyaltyDetailPoint: any;
  showInvestorAccreditedDeclarationBanner: boolean;
  userAtActivatedStep: boolean;
  featureFlagObservable: Observable<any>;

  public constructor(
    private _authService: AuthService,
    private _financeService: FinanceService,
    private featureFlagService: FeatureFlagService,
    private _baseParameterService: BaseParameterService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _localStorageService: LocalStorageService,
    private _utilityService: UtilityService,
    private _menuService: MenuService,
    private _memberService: MemberService,
    private _modalService: ModalService,
    private _baseService: BaseService,
    private _router: Router
  ) {
    this.ENVIRONMENT = ENVIRONMENT;
    this.CONFIGURATION = CONFIGURATION;
    this.appLink = {
      appStore: CONFIGURATION.mobileAppUrl.investor.appStore,
      googlePlay: CONFIGURATION.mobileAppUrl.investor.googlePlay
    };
    this.activationStepCode = CONFIGURATION.activation_step_code;
    this.accountSummary = null;
    this.accountOverview = null;
    this.activityModel = {
      page: 1,
      recordsPerPage: 10,
      investment_activity_filter: 'SUCCESS',
      deposits: new Array<Activity>(),
      investments: new Array<Activity>(),
      withdrawals: new Array<Activity>()
    };
    this.activityTabs = {
      deposit: true,
      investment: false,
      withdrawal: false
    };
    this.currency = CONFIGURATION.currency_symbol;
    this.showGst = CONFIGURATION.country_code === 'MY';
    this.isInvestorOverviewDataReady = false;
    this.chartModel = {
      chart: null,
      data: {
        autobot: {
          investmentReturn: 0,
          investmentPercentage: 0
        },
        bestInvestor: {
          investmentReturn: 0,
          investmentPercentage: 0
        },
        netincome: 0,
        label: '',
        yourInvestment: {
          investmentReturn: 0,
          investmentPercentage: 0
        }
      },
      labels: {
        autobot: 2,
        bestInvestor: 1,
        yourInvestment: 0
      },
      options: {
        chart: {
          type: 'line'
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: []
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          line: {
            marker: {
              radius: 4,
              fillColor: '#FFFFFF',
              lineColor: null,
              lineWidth: 2,
              symbol: 'circle',
              states: {
                hover: {
                  fillColor: '#9012fe',
                }
              }
            }
          }
        },
        legend: {
          enabled: false,
        },
        yAxis: {
          title: {
            text: ""
          }
        },
        series: [
          {
            name: 'Your investment',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            color: '#3d7eff'
          },
          {
            name: 'Best investor',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            color: '#19c0a6'
          },
          {
            name: 'Autobot',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            color: '#9012fe'
          }
        ],
        tooltip: {
          pointFormat: CONFIGURATION.currency_symbol + '{point.y:,.2f}'
        },
      },
      months: new Array<string>(),
      periods: new Array<any>(),
      shortMonths: new Array<string>(),
      selectedPeriod: '12'
    };
    this.decimalFormat = CONFIGURATION.format.decimal;
    this.localeDecimalFormat = CONFIGURATION.format.locale;
    this.countryCode = CONFIGURATION.country_code;
    this.investorLabel = new Array();
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
      slidesPerView: 2,
      slidesPerGroup: 2,
      autoplay: 2500
    };

    this.showAppBanner = true;
    this.showRDNBanner = false;
    this.showYearInReviewBanner = false;
    this.enableLoyaltyProgram = CONFIGURATION.enableLoyaltyProgram;
    this.institutionalFlag = false;

    this.showInvestorAccreditedDeclarationBanner = false;

    // Mapping from internal to api key, maintain this mapping here or move to shared if reusable
    this.accountOverviewKeyMapping = {
      'total-deposit': 'deposit_Amount',
      'total-withdrawal': 'withdrawal_Amount',
      'yearly-interest-earned': 'yearly_interest_earned',
      'total-investment': '',
    };
    // Overview metrics to be shown, will use the format later
    // Keys are based on firebase
    this.accountOverviewMetrics = [
      {
        key: 'total-deposit',
        format: 'currency'
      },
      {
        key: 'total-withdrawal',
        format: 'currency'
      },
      {
        key: 'total-investment',
        format: 'currency'
      },
      {
        key: 'yearly-interest-earned',
        format: 'decimal'
      }
    ];
    this.accountActivated = this._authService.getActivationStepCode() === CONFIGURATION.activation_step_code.activated;
    this.userAtActivatedStep = false;
  }

  ngOnInit() {
    const twoFaNextStep = this._authService.getTwoFaNextStep();
    const needRdnOpening = this._authService.getNeedsRDNOpening() === 'true';
    this.showRDNBanner = needRdnOpening && this.countryCode === 'ID';
    this.showInvestorAccreditedDeclarationBanner = this._utilityService.onShowInvestorAccreditedDeclarationBanner();
    if (!this._localStorageService.retrieve('hideLegal') && CONFIGURATION.showLegalPopup) {
      this.showLegalPopup = true;
      this._localStorageService.store('hideLegal', true);
    } else {
      this.showLegalPopup = false;
    }
    this.institutionalFlag = (this._authService.getIsInstitutional() === 'true');
    this.showAppBanner = this._localStorageService.retrieve('showappbanner');
    this.deviceDetail = this._utilityService.getDeviceDetail();
    this.listOfMobileOperatingSystem = this._baseParameterService.getMobileOperatingSystem();
    this._memberService.getMemberDetail()
      .subscribe(
        memberDetail => {
          let isUserAtRegisteredStatus = false;
          let isUserAccountActivated = false;
          let isUserAtActivatedStep = false;
          if (memberDetail) {
            const memberStatuses = this._baseParameterService.getMemberStatuses();
            const memberStatus = memberStatuses.find(curMemberStatus => {
              return curMemberStatus.id === memberDetail.memberStatus.id;
            });
            if (memberStatus && memberStatus.code === CONFIGURATION.member_status.registered) {
              isUserAtRegisteredStatus = true;
            }
            if (memberDetail.memberActivationStatus['name'] === 'Active') {
              isUserAccountActivated = true;
            }
            if (memberDetail.activationStep &&
              memberDetail.activationStep.code === CONFIGURATION.activation_step_code.activated) {
              isUserAtActivatedStep = true;
            }
            this.isUserActivated = isUserAtRegisteredStatus && isUserAccountActivated && isUserAtActivatedStep;
            this.userAtActivatedStep = isUserAtActivatedStep;
          }
        },
        error => {
          console.error('Unable to set up wootric');
        }
      );
    this._memberService.getMemberRoyaltyDetail().subscribe(
      memberRoyaltyDetail => {
        this.loyaltyDetailPoint = memberRoyaltyDetail.data;
        this.loyaltyDetailPoint.next_tier_required_qualifying_points =
          parseInt(this.loyaltyDetailPoint.next_tier_required_qualifying_points, 10);
        this.loyaltyDetailPoint.qualifying_points =
          parseInt(this.loyaltyDetailPoint.qualifying_points, 10);
        this.loyaltyDetailPoint.redeemable_points =
          parseInt(this.loyaltyDetailPoint.redeemable_points, 10);
        this.loyaltyDetailPoint.tier = capitalize(this.loyaltyDetailPoint.tier);
        this.loyaltyDetailPoint.next_tier = this.loyaltyDetailPoint.next_tier != null ?
          capitalize(this.loyaltyDetailPoint.next_tier) : '';
      },
      error => {
        this._notificationService.error();
      });
    this._financeService
      .getActivities(this.activityModel.page, this.activityModel.recordsPerPage)
      .subscribe(
        response => {
          const deposits_activity = response.deposits.map(deposit => {
            return <Activity>{
              amount: this._utilityService.formatDecimal(deposit.amount),
              currency: CONFIGURATION.currency_symbol,
              currencyFormat: CONFIGURATION.format.decimal,
              dateTime: new Date(deposit.date),
              dateTimeFormat: CONFIGURATION.format.activity_date_time,
              status: deposit.status
            }
          });
          const investments_activity = response.investments.filter(data =>
            (this.activityModel.investment_activity_filter).includes(data.status)).map(investment => {
              return <Activity>{
                amount: this._utilityService.formatDecimal(investment.amount),
                currency: CONFIGURATION.currency_symbol,
                currencyFormat: CONFIGURATION.format.decimal,
                dateTime: new Date(investment.date),
                dateTimeFormat: CONFIGURATION.format.activity_date_time,
                status: investment.status
              }
            });
          const withdrawals_activity = response.withdrawals.map(withdrawal => {
            return <Activity>{
              amount: this._utilityService.formatDecimal(withdrawal.amount),
              currency: CONFIGURATION.currency_symbol,
              currencyFormat: CONFIGURATION.format.decimal,
              dateTime: new Date(withdrawal.date),
              dateTimeFormat: CONFIGURATION.format.activity_date_time,
              status: withdrawal.status
            }
          });
          this.activityModel = {
            deposits: deposits_activity,
            investments: investments_activity,
            withdrawals: withdrawals_activity
          };
        },
        error => {
          this._notificationService.error();
        });

    observableForkJoin( // NEED TO INVESTIGATE THIS getInvestorOverview(), THE CALL SEEMS NOT ENDED THE LOADING QUEUE WHEN IT GOT ERROR 401
      this._financeService.getInvestorOverview(),
      this._financeService.getInvestorSummary(),
      this._translateService.get('investor-dashboard.label')
    ).subscribe(responses => {
      this.accountOverview = Object.assign(responses[0].value, responses[1].value.summary);
      const { yearInReview } = this.featureFlagService.getFeatureFlagKeys();
      this.featureFlagObservable = this.featureFlagService.getFeatureFlagObservable();
      this.featureFlagObservable.subscribe((flags) => {
        const yearInReviewLink = ENVIRONMENT.yearInReviewLink;
        let params = new HttpParams();
        params = params.set('access_token', this._authService.getBearerToken());
        this.yearInReviewLink = this._baseService.getUrlWithParams(yearInReviewLink, params);
        const yearInReviewBannerToggle = flags[yearInReview];
        // ENABLE YEAR END REVIEW --- START //
        // this.showYearInReviewBanner = this.countryCode === 'SG' ?
        //   yearInReviewBannerToggle ? this.accountOverview.funds_invested > 0 : false : false;
        // ENABLE YEAR END REVIEW --- END //

      });
      this.annualisedPortfolioPerformance =
        isNaN(this.accountOverview.yearly_interest_earned) ?
          this.accountOverview.yearly_interest_earned : this._utilityService.formatDecimal(parseFloat((this.accountOverview.yearly_interest_earned).toFixed(2))) + '%';
      this._getFormattedAccountOverviewMetrics(this.accountOverviewMetrics, this.accountOverviewKeyMapping, responses[2]);
      this.isInvestorOverviewDataReady = true;
    },
      error => {
        this._notificationService.error();
      });


    this._translateService
      .get('master.tenors')
      .subscribe(
        tenors => {
          for (let key in tenors) {
            this.chartModel.periods.push({
              key: key,
              value: tenors[key]
            });
          }
          this.chartModel.periods.splice(4);
        }
      );
  }

  private _getFormattedAccountOverviewMetrics(accountOverviewMetrics, accountOverviewKeyMapping, tenors): [any] {
    return accountOverviewMetrics.map(async accountOverviewMetric => {
      let value = this.accountOverview[accountOverviewKeyMapping[accountOverviewMetric.key]];
      if (accountOverviewMetric.key === 'total-deposit' || accountOverviewMetric.key === 'total-withdrawal') {
        value = this.currency +
          this._utilityService.formatDecimal(value);
      } else if (accountOverviewMetric.key === 'total-investment') {
        value = this.currency +
          this._utilityService.formatDecimal(this.accountOverview.funds_invested);
      } else if (accountOverviewMetric.key === 'yearly-interest-earned') {
        value = isNaN(value) ? value : parseFloat(value).toFixed(2) + '%';
      }
      this.investorLabel.push({
        'key': tenors[accountOverviewMetric.key], // label for overview
        'value': value
      });
    });
  }

  closeAppBanner() {
    this._localStorageService.store('showappbanner', false);
    this.showAppBanner = this._localStorageService.retrieve('showappbanner');
  }

  changeActivityTab(tabName: string): void {
    for (let tab in this.activityTabs) {
      this.activityTabs[tab] = (tab === tabName);
    }
  }

  openMobileAppLink() {
    if (this.deviceDetail.os !== this.listOfMobileOperatingSystem.android) {
      window.open(this.appLink.appStore, '_blank');
    } else {
      window.open(this.appLink.googlePlay, '_blank');
    }
  }

  hideGraph(index: number): void {
    this.chartModel.chart.series[index].update({
      visible: !this.chartModel.chart.series[index].visible
    });
  }

  initializeChartData(): void {
    this._financeService
      .getInvestorReturnsChart(this.chartModel.selectedPeriod)
      .subscribe(
        response => {
          let autobotData = new Array<number>();
          let bestInvestorData = new Array<number>();
          let shortMonths = new Array<string>();
          let yourInvestmentData = new Array<number>();
          if (response.value.bot.length >= this.chartModel.selectedPeriod) {
            for (let index = 0; index < this.chartModel.selectedPeriod; index++) {
              autobotData.push(response.value.bot[index].returns);
              bestInvestorData.push(response.value.best[index].returns);
              yourInvestmentData.push(response.value.history[index].returns);
              shortMonths.push(this.chartModel.shortMonths[response.value.history[index].month - 1] + ' ' + response.value.history[index].year);
            }
            this.chartModel.data.label = this.chartModel.months[response.value.history[this.chartModel.selectedPeriod - 1].month - 1] + ' ' + response.value.history[this.chartModel.selectedPeriod - 1].year;
            // X Axis
            this.chartModel.chart.xAxis[0].setCategories(shortMonths);

            // Your Investment
            this.chartModel.data.yourInvestment = {
              investmentReturn: parseFloat(response.value.history[this.chartModel.selectedPeriod - 1].returns.toFixed(2)),
              investmentPercentage: response.value.history[this.chartModel.selectedPeriod - 1].percentage
            };
            if (this.accountSummary) {
              this.accountSummary.totalIncome = this.chartModel.data.yourInvestment.investmentReturn + this.accountSummary.bonus_Received;
              this.chartModel.data.netincome = this.accountSummary.totalIncome -
                (this.accountSummary.service_Fees + this.accountSummary.litigation_Fees +
                  this.accountSummary.write_off + this.accountSummary.witholding_Tax);
            }

            this.chartModel.chart.series[this.chartModel.labels.yourInvestment].update({
              data: yourInvestmentData
            });

            // Best Investor
            const bestInvestor = response.value.best[this.chartModel.selectedPeriod - 1];
            this.chartModel.data.bestInvestor = {
              investmentReturn: bestInvestor.returns,
              investmentPercentage: bestInvestor.percentage,
              numberOfInvestedLoans: bestInvestor.numLoans
            };
            this.chartModel.chart.series[this.chartModel.labels.bestInvestor].update({
              data: bestInvestorData
            });

            // Autobot
            const autobot = response.value.bot[this.chartModel.selectedPeriod - 1]
            this.chartModel.data.autobot = {
              investmentReturn: autobot.returns,
              investmentPercentage: autobot.percentage,
              numberOfInvestedLoans: autobot.numLoans
            };
            this.chartModel.chart.series[this.chartModel.labels.autobot].update({
              data: autobotData
            });
          }
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  onChartPeriodChange(): void {
    if (this.chartModel.shortMonths.length === 0 || !this.accountSummary) {
      const getMonthsTranslation = new Promise((resolve, reject) => {
        this._translateService
          .get('master')
          .subscribe(
            masterData => {
              this.chartModel.months = masterData['months'];
              this.chartModel.shortMonths = masterData['short-months'];
              resolve(masterData);
            },
            error => {
              reject(error);
            }
          );
      });
      // TODO: accountOverviewMetric is used for mobile and accountSummary is used for for desktop
      // We have to create a loop to display the same overview metrics for the account summary
      const getAccountSummary = new Promise((resolve, reject) => {
        this._financeService
          .getInvestorSummary()
          .subscribe(
            response => {
              this.accountSummary = response.value.summary;
              resolve(response);
            },
            error => {
              reject(error);
            }
          );
      });

      const getBaseChartData = Promise.all([getMonthsTranslation, getAccountSummary])
        .then((values) => {
          const masterData = values[0];
          this.chartModel.months = masterData['months'];
          this.chartModel.shortMonths = masterData['short-months'];
          const accountSummary: any = values[1];
          this.accountSummary = accountSummary.value.summary;
          this.initializeChartData();
        }).catch((error) => {
          this._notificationService.error();
        });
    } else {
      this.initializeChartData();
    }
  }

  onLoadChart(chart: any): void {
    this.chartModel.chart = chart;
    this._translateService
      .get('investor-dashboard.portfolio-label')
      .subscribe(
        portfolioLabels => {
          // Your Investment
          this.chartModel.chart.series[this.chartModel.labels.yourInvestment].update({
            name: portfolioLabels['your-investment']
          });

          // Best Investor
          this.chartModel.chart.series[this.chartModel.labels.bestInvestor].update({
            name: portfolioLabels['best-investor']
          });

          // Autobot
          this.chartModel.chart.series[this.chartModel.labels.autobot].update({
            name: portfolioLabels['autobot']
          });

          this.chartModel.chart.series[this.chartModel.labels.bestInvestor].update({
            visible: false
          });
          this.chartModel.chart.series[this.chartModel.labels.autobot].update({
            visible: false
          });
        }
      );
    this.onChartPeriodChange();

  }

  openMenu() {
    this._menuService.displayMenu();
  }

  openModal(id: string): void {
    this._modalService.open(id);
  }

  closeModal(id: string): void {
    this._modalService.close(id);
  }

  closeLegalNotification() {
    this.showLegalPopup = false;
  }

  goToAccreditedDeclaration() {
    this._router.navigate(['/admin-investor/setting/accredited-declaration']);
  }
}
