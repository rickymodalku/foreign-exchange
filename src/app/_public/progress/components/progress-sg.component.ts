import {
  Component,
  OnInit
} from '@angular/core';
import CONFIGURATION from '../../../../configurations/configuration';
import { TranslateService } from '@ngx-translate/core';
import { FinanceService } from '../../../services/finance.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'progress-page-sg',
  templateUrl: './progress-sg.html'
})
export class ProgressSGComponent implements OnInit {
  chartBelow90: any;
  chartOver90: any;
  isOver90: boolean;
  statistics: any;
  decimalFormat: string;
  localeDecimalFormat: string;
  footNoteTable: any;
  loanPastDueRatesFootNote: any;
  nonPerformingLoanRatesFootNote: any;
  defaultDefinitions: any;
  endPointURL: string;

  constructor(
    private _translateService: TranslateService,
    private _financeService: FinanceService,
    private _notificationService: NotificationService,
  ) {
    this.decimalFormat = CONFIGURATION.format.decimal;
    this.localeDecimalFormat = CONFIGURATION.format.locale;
    this.chartBelow90 = {
      chart: {
        height: 200
      },
      title: {
          text: ''
      },
      credits: {
        enabled: false
      },
      legend: {
          enabled: false
      },
      plotOptions: {
        series: {
          pointPadding: 0.2,
          groupPadding: 0.2,
          minPointLength: 1,
        }
      },
      xAxis: {
          categories: []
      },
      yAxis: {
          min: 0,
          max: 5,
          tickInterval: 1,
          title: {
              text: '(%)',
              rotation: 0,
              margin: 30
          }
      },
      tooltip: {
        valueSuffix: '%',
        valueDecimals: 2,
      },
      series: [{
          name: 'Rate(%)',
          data: [],
          color: '#FFB50D'
      }, {
          name: 'Rate(%)',
          data: [],
          color: '#3E7EFF'
      }]
    };
    this.chartOver90 = {
      chart: {
        height: 200
      },
      title: {
          text: ''
      },
      credits: {
        enabled: false
      },
      legend: {
          enabled: false
      },
      plotOptions: {
        series: {
          pointPadding: 0.2,
          groupPadding: 0.2,
          minPointLength: 1,
        }
      },
      xAxis: {
          categories: []
      },
      yAxis: {
          min: 0,
          max: 5,
          tickInterval: 1,
          title: {
              text: '(%)',
              rotation: 0,
              margin: 30
          }
      },
      tooltip: {
        valueSuffix: '%',
        valueDecimals: 2,
      },
      series: [{
          name: 'Rate(%)',
          data: [],
          color: '#FFB50D'
      }, {
          name: 'Rate(%)',
          data: [],
          color: '#3E7EFF'
      }]
    };
    this.isOver90 = false;
    this.footNoteTable = [];
    this.nonPerformingLoanRatesFootNote = [];
    this.loanPastDueRatesFootNote = [];
    this.defaultDefinitions = [];
    this.statistics = [];
  }

  ngOnInit() {
    this._translateService.get('statistics-sg.rates-table.foot-note.row')
      .subscribe(
        footNote => {
          this.footNoteTable = footNote;
        }
    );
    this._translateService.get('statistics-sg.understanding-performance-metrics.non-performing-loan-rates.foot-note')
      .subscribe(
        footNote => {
          this.nonPerformingLoanRatesFootNote = footNote;
        }
    );
    this._translateService.get('statistics-sg.understanding-performance-metrics.loan-past-due-rates.foot-note')
      .subscribe(
        footNote => {
          this.loanPastDueRatesFootNote = footNote;
        }
    );
    this._translateService.get('statistics-sg.understanding-performance-metrics.define-default.definition')
      .subscribe(
        definition => {
          this.defaultDefinitions = definition;
        }
    );
    this.initializeStatistic();
  }

  initializeStatistic() {
    this._financeService
      .getLocalStatistics(CONFIGURATION.country_code)
      .subscribe(
        response => {
          if (response && response.data) {
            this.statistics = response.data;
            this.statistics.forEach(statistic => {
              this.chartBelow90.xAxis.categories.push(statistic.year);
              this.chartOver90.xAxis.categories.push(statistic.year);
              this.chartBelow90.series[0].data.push(statistic.fsmk_default_rate_within_30_90_dpd);
              this.chartOver90.series[0].data.push(statistic.fsmk_default_rate_past_90_dpd);
              this.chartBelow90.series[1].data.push(statistic.default_rate_within_30_90_dpd);
              this.chartOver90.series[1].data.push(statistic.default_rate_past_90_dpd);
            });
          } else {
            this._notificationService.error();
          }
        },
        error => {
            this._notificationService.error();
        }
      );
  }

  showChart(type: string) {
    if (type === 'below90') {
      this.isOver90 = false;
    } else {
      this.isOver90 = true;
    }
  }
}
