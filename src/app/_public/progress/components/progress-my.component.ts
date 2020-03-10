import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FinanceService } from '../../../services/finance.service';
import { NotificationService } from '../../../services/notification.service';
import { forkJoin as observableForkJoin } from 'rxjs';

@Component({
  selector: 'progress-page-my',
  templateUrl: './progress-my.html'
})
export class ProgressMYComponent implements OnInit {
  currentDateTime: any;
  defaultRate: string;
  calculationRuleList: any;

  constructor(
    private _translateService: TranslateService,
    private _financeService: FinanceService,
    private _notificationService: NotificationService,
  ) {
    this.calculationRuleList = [];
  }

  ngOnInit() {
    this.initializeStatistic();
  }

  initializeStatistic() {
    observableForkJoin(
      this._financeService.getScDefaultRate(),
      this._translateService.get('statistics-performance'),
      this._translateService.get('master')
    ).subscribe(async responses => {
      const today = new Date();
      this.calculationRuleList = responses[1]['calculation-rule'];
      const months = responses[2]['months'];
      this.defaultRate = responses[0].data.default_rate;
      this.currentDateTime = today.getDate() + ' ' + months[today.getMonth()] + ' ' + today.getFullYear();
    }, error => {
      this._notificationService.error();
    });
  }
}
