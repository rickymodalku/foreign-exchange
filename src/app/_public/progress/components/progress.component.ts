import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { FinanceService } from '../../../services/finance.service';
import { NotificationService } from '../../../services/notification.service';
import { UtilityService } from '../../../services/utility.service';
import CONFIGURATION from '../../../../configurations/configuration';
import { FeatureFlagService } from '../../../services/feature-flag.service';
import { Observable } from 'rxjs/Rx';
import { BaseParameterService } from '../../../services/base-parameter.service';

@Component({
  selector: 'progress-page',
  templateUrl: './progress.html'
})
export class ProgressComponent implements OnInit {
  asOfDate: string;
  charts: any;
  currency: string;
  mediaPressLink: string;
  mobileSwiperConfiguration: SwiperConfigInterface;
  months: Array<string>;
  overview: Array<any>;
  swiperConfiguration: SwiperConfigInterface;
  tabs: Array<any>;
  statisticTabIndex: any;
  showLocalPerformance: boolean;
  countryCode: string;
  featureFlagObservable: Observable<any>;


  constructor(
    private baseParameterService: BaseParameterService,
    private _financeService: FinanceService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _utilityService: UtilityService,
    private featureFlagService: FeatureFlagService,
  ) {
    this.asOfDate = '';
    this.charts = null;
    this.currency = CONFIGURATION.currency_symbol;
    this.mediaPressLink = CONFIGURATION.mediapress;
    this.mobileSwiperConfiguration = null;
    this.months = new Array<string>();
    this.overview = new Array<any>();
    this.statisticTabIndex = baseParameterService.statistic_tabs;
    this.swiperConfiguration = null;
    this.tabs = new Array<any>();
    this.showLocalPerformance = false;
    this.countryCode = CONFIGURATION.country_code;
  }

  ngOnInit() {
    this.initializeChart();
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
      slidesPerView: 1
    };
    this.swiperConfiguration = {
      direction: 'horizontal',
      loop: true,
      mousewheelControl: false,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      scrollbarDraggable: false,
      scrollbarSnapOnRelease: false,
      slidesPerView: 1
    };

    this._translateService
      .get('master.months')
      .subscribe(
        months => {
          months.forEach(month => {
            this.months.push(month);
          });

          let today = new Date();
          this.asOfDate = this.months[today.getMonth()] + ' ' + today.getFullYear();
        }
      );

    this.featureFlagObservable = this.featureFlagService.getFeatureFlagObservable();
    this.featureFlagObservable.subscribe((flags) => {
      this.showLocalPerformance = flags[this.countryCode.toLowerCase() + '-local-performance'];
    });
  }

  changeTab(label: string): void {
    this.tabs.forEach(tab => {
      tab.display = (tab.label === label);
    });
  }

  openMediaPressPage() {
    window.open(this.mediaPressLink, '_blank');
  }

  getProgressColor(index: number): string {
    var color = '';
    switch (index) {
      case 0:
        color = 'purple';
        break;
      case 1:
        color = 'orange';
        break;
      case 2:
        color = 'light-blue';
        break;
      case 3:
        color = 'blue';
        break;
    }

    return color;
  }

  getProgressColorCode(index: number): string {
    var color = '';
    switch (index) {
      case 0:
        color = '#3b03a8';
        break;
      case 1:
        color = '#ffb50d';
        break;
      case 2:
        color = '#08c0a6';
        break;
      case 3:
        color = '#2c50ff';
        break;
    }

    return color;
  }

  initializeChart(): void {
    this._financeService
      .getStatistics(CONFIGURATION.country_code)
      .subscribe(
        response => {
          let statistics = response.value;
          this._translateService
            .get('statistics.tabs')
            .subscribe(
              tabs => {
                for (let key in tabs) {
                  switch (key) {
                    case '0':
                      this.tabs.push({
                        label: tabs[key]['title'],
                        display: true,
                        first: {
                          totalApproved: true,
                          amountDisbursed: false,
                          defaultRate: false
                        },
                        second: {
                          totalInvestor: false, // hide total investor
                          fulfillmentDay: true
                        }
                      });
                      break;
                    case '1':
                      this.tabs.push({
                        label: tabs[key]['title'],
                        display: false,
                        first: {
                          totalReceived: true
                        },
                        second: {
                          status: true
                        }
                      });
                      break;
                    case '2':
                      this.tabs.push({
                        label: tabs[key]['title'],
                        display: false,
                        first: {
                          industry: true
                        },
                        second: {
                          amount: true,
                          tenor: false
                        }
                      });
                      break;
                  }
                }
              }
            );

          this._translateService
            .get('statistics.overview')
            .subscribe(
              overview => {
                let loanCrowdfunded;
                this._utilityService.truncateDecimal(statistics.loan_crowdfunded + statistics.total_bond, 2).then((data: any) => {
                  loanCrowdfunded = data;
                  for (let key in overview) {
                    switch (key) {
                      case '0':
                        this.overview.push({
                          label: overview[key]['label'],
                          mobileLabel: overview[key]['mobile-label'],
                          value: this.currency + loanCrowdfunded
                        });
                        break;
                      case '1':
                        this.overview.push({
                          label: overview[key]['label'],
                          mobileLabel: overview[key]['mobile-label'],
                          value: this._utilityService.formatDecimal(statistics.number_of_loans, '1.0-0'),
                        });
                        break;
                      case '2':
                        this.overview.push({
                          label: overview[key]['label'],
                          mobileLabel: overview[key]['mobile-label'],
                          value: this._utilityService.formatDecimal(statistics.default_rate) + '%'
                        });
                        break;
                      case '3':
                        this.overview.push({
                          label: overview[key]['label'],
                          mobileLabel: overview[key]['mobile-label'],
                          value: this._utilityService.formatDecimal(statistics.funding_oppurtinity, '1.0-0'),
                        });
                        break;
                      case '4':
                        this.overview.push({
                          label: overview[key]['label'],
                          mobileLabel: overview[key]['mobile-label'],
                          value: this._utilityService.formatDecimal(statistics.loans_fullfillment_rate, '1.0-2') + '%'
                        });
                        break;
                    }
                  }
                });
              }
            );

          this._translateService
            .get('statistics.label')
            .subscribe(
              async (labels) => {
                let totalApprovedData = statistics.loan_count;
                let totalApprovedLabel = new Array<string>();
                let totalApprovedValue = new Array<number>();
                for (let i = 0; i < totalApprovedData.length; i++) {
                  totalApprovedLabel.push("Q" + totalApprovedData[i].month + "-" + totalApprovedData[i].year);
                  totalApprovedValue.push(totalApprovedData[i].count_loan);
                }
                let totalApproved = {
                  colors: [
                    '#9012fe'
                  ],
                  credits: {
                    enabled: false
                  },
                  legend: {
                    enabled: false
                  },
                  series: [
                    {
                      data: totalApprovedValue,
                      name: labels['total-approved'],
                      type: "line"
                    }
                  ],
                  title: {
                    text: ''
                  },
                  xAxis: {
                    categories: totalApprovedLabel
                  },
                  yAxis: {
                    title: {
                      text: ""
                    }
                  }
                };

                let amountDisbursedData = statistics.loan_amount;
                let amountDisbursedLabel = new Array<string>();
                let amountDisbursedValue = new Array<number>();
                for (let i = 0; i < amountDisbursedData.length; i++) {
                  amountDisbursedLabel.push("Q" + amountDisbursedData[i].month + "-" + amountDisbursedData[i].year);
                  amountDisbursedValue.push(this.truncateDecimal(amountDisbursedData[i].total_disburse, CONFIGURATION.country_code === 'ID' ? 1000000000 : 1000000, 2));
                }
                let amountDisbursed = {
                  colors: [
                    '#9012fe'
                  ],
                  credits: {
                    enabled: false
                  },
                  legend: {
                    enabled: false
                  },
                  series: [
                    {
                      data: amountDisbursedValue,
                      name: labels['amount-disbursed'],
                      type: "line"
                    }
                  ],
                  title: {
                    text: ''
                  },
                  xAxis: {
                    categories: amountDisbursedLabel
                  },
                  yAxis: {
                    title: {
                      text: ""
                    }
                  }
                };

                let defaultRateData = statistics.default_rates;
                let defaultRateLabel = new Array<string>();
                let defaultRateValue = new Array<number>();
                for (let i = 0; i < defaultRateData.length; i++) {
                  defaultRateLabel.push('Q' + defaultRateData[i].quarter + '-' + defaultRateData[i].year);
                  defaultRateValue.push(Number(defaultRateData[i].rate.toFixed(2)));
                }
                let defaultRate = {
                  colors: [
                    '#9012fe'
                  ],
                  credits: {
                    enabled: false
                  },
                  legend: {
                    enabled: false
                  },
                  series: [
                    {
                      data: defaultRateValue,
                      name: labels['default-rate'],
                      type: "line"
                    }
                  ],
                  title: {
                    text: ''
                  },
                  xAxis: {
                    categories: defaultRateLabel
                  },
                  yAxis: {
                    title: {
                      text: ""
                    }
                  }
                };

                let totalInvestorData = statistics.count_investor_loans;
                let totalInvestorLabel = new Array<string>();
                let totalInvestorValue = new Array<any>();
                let totalInvestorAccumulated = 0;
                for (let i = 0; i < totalInvestorData.length; i++) {
                  totalInvestorLabel.push(totalInvestorData[i].key);
                  totalInvestorValue.push({
                    color: this.getProgressColorCode(i),
                    y: i === totalInvestorData.length - 1 ? this.truncateDecimal(100 - totalInvestorAccumulated, 1, 2) : totalInvestorData[i].count
                  });
                  totalInvestorAccumulated += totalInvestorData[i].count;
                }
                let totalInvestor = {
                  credits: {
                    enabled: false
                  },
                  legend: {
                    enabled: false
                  },
                  series: [
                    {
                      data: totalInvestorValue,
                      name: labels['total-investor'],
                      type: "bar"
                    }
                  ],
                  title: {
                    text: ''
                  },
                  xAxis: {
                    categories: totalInvestorLabel
                  },
                  yAxis: {
                    title: {
                      text: ""
                    }
                  }
                };

                let fulfillmentDayData = statistics.count_averageloan_filled;
                let fulfillmentDayLabel = new Array<string>();
                let fulfillmentDayValue = new Array<any>();
                let fulfillmentDayAccumulated = 0;
                for (let i = 0; i < fulfillmentDayData.length; i++) {
                  fulfillmentDayLabel.push(fulfillmentDayData[i].key);
                  fulfillmentDayValue.push({
                    color: this.getProgressColorCode(i),
                    y: i === fulfillmentDayData.length - 1 ? this.truncateDecimal(100 - fulfillmentDayAccumulated, 1, 2) : fulfillmentDayData[i].count
                  });
                  fulfillmentDayAccumulated += fulfillmentDayData[i].count
                }
                let fulfillmentDay = {
                  credits: {
                    enabled: false
                  },
                  legend: {
                    enabled: false
                  },
                  series: [
                    {
                      data: fulfillmentDayValue,
                      name: labels['fulfillment-day'],
                      type: "bar"
                    }
                  ],
                  title: {
                    text: ''
                  },
                  xAxis: {
                    categories: fulfillmentDayLabel
                  },
                  yAxis: {
                    title: {
                      text: ""
                    }
                  }
                };

                let totalReceived = {
                  colors: [
                    '#9012fe'
                  ],
                  credits: {
                    enabled: false
                  },
                  legend: {
                    enabled: true
                  },
                  series: [
                    {
                      color: '#9012fe',
                      data: [
                        this.truncateDecimal(statistics.repayment_received, CONFIGURATION.country_code === 'ID' ? 1000000000 : 1000000, 1)
                      ],
                      name: labels['total-received']['total'],
                      type: "column"
                    },
                    {
                      color: '#ffb50d',
                      data: [
                        this.truncateDecimal(statistics.repayment_principal_received, CONFIGURATION.country_code === 'ID' ? 1000000000 : 1000000, 1)
                      ],
                      name: labels['total-received']['principal'],
                      type: "column"
                    },
                    {
                      color: '#08c0a6',
                      data: [
                        this.truncateDecimal(statistics.repayment_interest_received + statistics.repayment_investor_early_repayment_fee_received + statistics.repayment_late_interest_fee_received, CONFIGURATION.country_code === 'ID' ? 1000000000 : 1000000, 1)
                      ],
                      name: labels['total-received']['interest'],
                      type: "column"
                    }
                  ],
                  title: {
                    text: ''
                  },
                  xAxis: {
                    categories: [
                      labels['total-received']['repayment']
                    ]
                  },
                  yAxis: {
                    title: {
                      text: ""
                    }
                  }
                };

                let statusLabel = new Array<string>();
                statusLabel.push(labels['status']['timely-payment']);
                statusLabel.push(labels['status']['late-payment-pending']);
                statusLabel.push(labels['status']['late-payment']);
                let statusValue = new Array<any>();
                statusValue.push({
                  color: this.getProgressColorCode(0),
                  y: statistics.timelyPayment
                });
                statusValue.push({
                  color: this.getProgressColorCode(1),
                  y: statistics.latePaymentPending
                });
                statusValue.push({
                  color: this.getProgressColorCode(2),
                  y: this.truncateDecimal(100 - (statistics.timelyPayment + statistics.latePaymentPending), 1, 2) //statistics.latePayment
                });
                let status = {
                  credits: {
                    enabled: false
                  },
                  legend: {
                    enabled: false
                  },
                  series: [
                    {
                      data: statusValue,
                      name: labels['status']['label'],
                      type: "bar"
                    }
                  ],
                  title: {
                    text: ''
                  },
                  xAxis: {
                    categories: statusLabel
                  },
                  yAxis: {
                    title: {
                      text: ""
                    }
                  }
                };

                let industryData = statistics.industries;
                let industrySeries = new Array<any>();
                for (let i = 0; i < industryData.length; i++) {
                  industrySeries.push({
                    name: industryData[i].indsutryname,
                    y: industryData[i].count
                  });
                }
                let industry = {
                  credits: {
                    enabled: false
                  },
                  legend: {
                    enabled: false
                  },
                  plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                        enabled: false
                      }
                    }
                  },
                  series: [
                    {
                      data: industrySeries,
                      name: labels['industry']['label'],
                      type: "pie"
                    }
                  ],
                  title: {
                    text: ''
                  },
                  xAxis: {
                    categories: [
                      labels['industry']['category']
                    ]
                  },
                  yAxis: {
                    title: {
                      text: ""
                    }
                  }
                };

                let amountLabel = new Array<string>();
                amountLabel.push(labels['amount']['first']);
                amountLabel.push(labels['amount']['second']);
                amountLabel.push(labels['amount']['third']);
                amountLabel.push(labels['amount']['fourth']);
                let amountValue = new Array<any>();
                amountValue.push({
                  color: this.getProgressColorCode(0),
                  y: statistics.below_50
                });
                amountValue.push({
                  color: this.getProgressColorCode(1),
                  y: statistics.between_50100
                });
                amountValue.push({
                  color: this.getProgressColorCode(2),
                  y: statistics.between_100150
                });
                amountValue.push({
                  color: this.getProgressColorCode(3),
                  y: this.truncateDecimal(100 - (statistics.below_50 + statistics.between_50100 + statistics.between_100150), 1, 2) //statistics.above_150
                });
                let amount = {
                  credits: {
                    enabled: false
                  },
                  legend: {
                    enabled: false
                  },
                  series: [
                    {
                      data: amountValue,
                      name: labels['amount']['label'],
                      type: "bar"
                    }
                  ],
                  title: {
                    text: ''
                  },
                  xAxis: {
                    categories: amountLabel
                  },
                  yAxis: {
                    title: {
                      text: ""
                    }
                  }
                };

                let tenorLabel = new Array<string>();
                tenorLabel.push(labels['tenor']['first']);
                tenorLabel.push(labels['tenor']['second']);
                tenorLabel.push(labels['tenor']['third']);
                tenorLabel.push(labels['tenor']['fourth']);
                let tenorValue = new Array<any>();
                tenorValue.push({
                  color: this.getProgressColorCode(0),
                  y: statistics.below_6months
                });
                tenorValue.push({
                  color: this.getProgressColorCode(1),
                  y: statistics.between_712months
                });
                tenorValue.push({
                  color: this.getProgressColorCode(2),
                  y: statistics.between_1318months
                });
                tenorValue.push({
                  color: this.getProgressColorCode(3),
                  y: this.truncateDecimal(100 - (statistics.below_6months + statistics.between_712months + statistics.between_1318months), 1, 2) //statistics.between_1924months
                });
                let tenor = {
                  credits: {
                    enabled: false
                  },
                  legend: {
                    enabled: false
                  },
                  series: [
                    {
                      data: tenorValue,
                      name: labels['tenor']['label'],
                      type: "bar"
                    }
                  ],
                  title: {
                    text: ''
                  },
                  xAxis: {
                    categories: tenorLabel
                  },
                  yAxis: {
                    title: {
                      text: ""
                    }
                  }
                };

                this.charts = {
                  totalApproved: totalApproved,
                  amountDisbursed: amountDisbursed,
                  defaultRate: defaultRate,
                  totalInvestor: totalInvestor,
                  fulfillmentDay: fulfillmentDay,
                  totalReceived: totalReceived,
                  status: status,
                  industry: industry,
                  amount: amount,
                  tenor: tenor
                };
              }
            );
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  onTabChange(index: number): void {
    var tabIndex = (Math.abs(index) % this.tabs.length) - 1;
    if (tabIndex < 0) {
      tabIndex = this.tabs.length - 1;
    }

    this.changeTab(this.tabs[tabIndex].label);
  }

  showSection(tabIndex: number, groupKey: string, sectionKey: string): void {
    const tab = this.tabs[tabIndex];
    if (tab && tab[groupKey]) {
      for (var key in tab[groupKey]) {
        tab[groupKey][key] = (key === sectionKey);
      }
    }
  }

  truncateDecimal(value: number, denominator: number, precision: number): number {
    value = value / denominator;

    let regex = new RegExp("(\\d+\\.\\d{" + precision + "})(\\d)");
    let truncated = value.toString().match(regex);

    return truncated ? parseFloat(truncated[1]) : value;
  }
}

