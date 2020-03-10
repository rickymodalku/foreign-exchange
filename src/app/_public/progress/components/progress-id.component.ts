import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FinanceService } from '../../../services/finance.service';
import { UtilityService } from '../../../services/utility.service';
import { NotificationService } from '../../../services/notification.service';
import { forkJoin as observableForkJoin } from 'rxjs';
import CONFIGURATION from '../../../../configurations/configuration';

@Component({
  selector: 'progress-page-id',
  templateUrl: './progress-id.html'
})
export class ProgressIDComponent implements OnInit {
  statistics: any;
  decimalFormat: string;
  localeDecimalFormat: string;
  endPointURL: string;

  indonesiaStatisticsTableConfig: any;
  indonesiaStatisticsTableContent: any;
  indonesiaStatisticsConfig: any;
  indonesiaStatisticsNumber: any;
  decimalPrecision: number;
  currencySymbol: string;
  lastDayOfLastMonth: any;

  constructor(
    private _translateService: TranslateService,
    private _financeService: FinanceService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService
  ) {
    this.decimalFormat = CONFIGURATION.format.decimal;
    this.localeDecimalFormat = CONFIGURATION.format.locale;
    this.currencySymbol = CONFIGURATION.currency_symbol;
    this.indonesiaStatisticsNumber = [];
    this.indonesiaStatisticsTableContent = [];
    this.decimalPrecision = 2;

    this.indonesiaStatisticsConfig =
      [{
        firebasekey: 'tkb_90',
        apikey: 'success_rate_over_outstanding',
        valueFormatter: function (value) {
          return this._utilityService.formatDecimal(value) + '%';
        }.bind(this),
        type: 'percentage'
      },
      {
        firebasekey: 'disbursal_amount_cumulative',
        apikey: 'disbursal_amount.cumulative',
        valueFormatter: function (value) {
          return this._utilityService.truncateDecimal(value, this.decimalPrecision);
        }.bind(this),
        type: 'decimal'
      },
      {
        firebasekey: 'disbursal_amount_annualized',
        apikey: 'disbursal_amount.annualized',
        valueFormatter: function (value) {
          return this._utilityService.truncateDecimal(value, this.decimalPrecision);
        }.bind(this),
        type: 'decimal'
      },
      {
        firebasekey: 'oustanding_amount',
        apikey: 'outstanding_amount',
        valueFormatter: function (value) {
          return this._utilityService.truncateDecimal(value, this.decimalPrecision);
        }.bind(this),
        type: 'decimal'
      },
      {
        firebasekey: 'borrower_count_all',
        apikey: 'borrower_count.all.total',
        showDetail: true,
        borrowerDetailType: 'all',
        valueFormatter: ((value) => {
          return this._utilityService.formatDecimal(value, '1.0-0');
        }).bind(this),
      },
      {
        firebasekey: 'borrower_count_ongoing',
        apikey: 'borrower_count.ongoing.total',
        showDetail: true,
        borrowerDetailType: 'ongoing',
        valueFormatter: ((value) => {
          return this._utilityService.formatDecimal(value, '1.0-0');
        }).bind(this),
      }];

    this.indonesiaStatisticsTableConfig = [
      {
        firebasekey: 'disbursal_amount',
        lowestValue: 'products.lowest.disbursal_amount',
        highestValue: 'products.highest.disbursal_amount',
        valueFormatter: function (value) {
          return this._utilityService.truncateDecimal(value, this.decimalPrecision);
        }.bind(this),
        type: 'decimal'
      },
      {
        firebasekey: 'repayment_amount',
        lowestValue: 'products.lowest.repayment_amount',
        highestValue: 'products.highest.repayment_amount',
        valueFormatter: function (value) {
          return this._utilityService.truncateDecimal(value, this.decimalPrecision);
        }.bind(this),
        type: 'decimal'
      },
      {
        firebasekey: 'fees_amount',
        lowestValue: 'products.lowest.fees_amount',
        highestValue: 'products.highest.fees_amount',
        valueFormatter: function (value) {
          return this._utilityService.truncateDecimal(value, this.decimalPrecision);
        }.bind(this),
        type: 'decimal'
      },
      {
        firebasekey: 'fees_percentage',
        lowestValue: 'products.lowest.fees_percentage',
        highestValue: 'products.highest.fees_percentage',
        valueFormatter: function (value) {
          return value + ' %';
        }.bind(this),
        type: 'percentage'
      }
    ];
    this.lastDayOfLastMonth = new Date();
  }

  ngOnInit() {
    this.initializeStatistic();
  }

  initializeStatistic() {
    observableForkJoin(
      this._financeService.getIndonesiaStatistics(),
      this._translateService.get('statistics-id.box-detail'),
      this._translateService.get('statistics-id.table-detail'),
      this._translateService.get('master')
    ).subscribe(async responses => {
      const today = new Date();
      today.setDate(0);
      const months = responses[3]['months'];
      this.lastDayOfLastMonth = today.getDate() + ' ' + months[today.getMonth()] + ' ' + today.getFullYear();
      this.statistics = responses[0].data;
      const boxFirebaseTranslation = responses[1];
      const tableFirebaseTranslation = responses[2];
      for (let i = 0; i < this.indonesiaStatisticsConfig.length; i++) {
        let value = '';
        const curArray = this.indonesiaStatisticsConfig[i];
        const curFirebase = boxFirebaseTranslation.find(x => x.key === curArray.firebasekey);

        const res = curArray.apikey.split('.').reduce(function (o, k) {
          return o && o[k];
        }, this.statistics);

        typeof curArray.valueFormatter === 'function' ? value = await curArray.valueFormatter(res) : value = res;

        const re = /{{date}}|{{ date}}|{{date }}|{{ date }}/g;
        this.indonesiaStatisticsNumber.push({
          value: value,
          label: curFirebase.label,
          information: curFirebase.information.replace(re, this.lastDayOfLastMonth),
          showDetail: curArray.showDetail,
          borrowerDetailType: curArray.borrowerDetailType,
          type: curArray.type
        });
      }

      for (let i = 0; i < this.indonesiaStatisticsTableConfig.length; i++) {
        let formattedLowestValue = '';
        let formattedEempHighestValue = '';
        const curArray = this.indonesiaStatisticsTableConfig[i];
        const curFirebase = tableFirebaseTranslation.find(x => x.key === curArray.firebasekey);

        const lowestValue = curArray.lowestValue.split('.').reduce(function (o, k) {
          return o && o[k];
        }, this.statistics);

        const highestValue = curArray.highestValue.split('.').reduce(function (o, k) {
          return o && o[k];
        }, this.statistics);

        typeof curArray.valueFormatter === 'function' ?
          formattedLowestValue = await curArray.valueFormatter(lowestValue) : formattedLowestValue = lowestValue;

        typeof curArray.valueFormatter === 'function' ?
          formattedEempHighestValue = await curArray.valueFormatter(highestValue) : formattedEempHighestValue = highestValue;

        this.indonesiaStatisticsTableContent.push({
          lowestValue: formattedLowestValue,
          highestValue: formattedEempHighestValue,
          label: curFirebase.label,
          information: curFirebase.information,
          type: curArray.type
        });
      }

    }, error => {
      this._notificationService.error();
    });
  }

  getBorrowerAmountDetail(amountType: string, displayed: string) {
    return this._utilityService.formatDecimal(this.statistics.borrower_count[amountType][displayed], '1.0-0');
  }
}
