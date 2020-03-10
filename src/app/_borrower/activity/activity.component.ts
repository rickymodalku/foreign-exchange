
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import {
  Component,
  OnInit
} from '@angular/core';
import { Activity } from '../../models/finance.class';
import { AuthService } from '../../services/auth.service';
import { FinanceService } from '../../services/finance.service';
import { LoanService } from '../../services/loan.service';
import { NotificationService } from '../../services/notification.service';
import { UtilityService } from '../../services/utility.service';
import CONFIGURATION from '../../../configurations/configuration';
import {BaseParameterService} from '../../services/base-parameter.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  templateUrl:'./activity.html'
})
export class ActivityComponent implements OnInit {
  allActivities: Array<Activity>;
  appliedLoanActivities: Array<Activity>;
  approvedLoanActivities: Array<Activity>;
  tabs: any;
  borrowerActivityTranslation: any;

  constructor(
    private _authService: AuthService,
    private _financeService: FinanceService,
    private _loanService: LoanService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _baseParameterService: BaseParameterService,
    private _translateService: TranslateService,
  ) {
    this.allActivities = new Array<Activity>();
    this.appliedLoanActivities = new Array<Activity>();
    this.approvedLoanActivities = new Array<Activity>();
    this.tabs = {
      all: true,
      appliedLoan: false,
      approvedLoan: false
    };
  }

  ngOnInit() {
    this.getLoanActivities();
  }

  changeTab(tabName: string): void {
    for (let tab in this.tabs) {
      this.tabs[tab] = (tab === tabName);
    }
    this.getLoanActivities();
  }

  getLoanActivities(): void {
    this.allActivities = new Array<Activity>();
    this.appliedLoanActivities = new Array<Activity>();
    this.approvedLoanActivities = new Array<Activity>();
    observableForkJoin(
      this._translateService.get('borrower-activity'),
      this._loanService.getBorrowerLoans()
    ).subscribe( responses => {
      const borrowerLoans = responses[1];
      this.borrowerActivityTranslation = responses[0];
      this.allActivities = borrowerLoans.data.map(this.mapLoanActivity, this)
      this._utilityService.sortByKey(this.allActivities, 'dateTime', 'dateTime');
      this.approvedLoanActivities = this.allActivities.filter(this.isApprovedLoan, this)
      this.appliedLoanActivities = this.allActivities.filter(this.isAppliedLoan, this)
    }, error => {
      this._notificationService.error();
    });
  }

  isApprovedLoan(loan) {
    const loanStages = this._baseParameterService.getLoanStages();
    const loanStatuses = this._baseParameterService.getLoanStatuses();
    return loan.stage_id >= loanStages['offer'] || (loan.stage_id === loanStages['underwriting'] && loan.status_id === loanStatuses['underwritingApprove']);
  }

  isAppliedLoan(loan) {
    const loanStages = this._baseParameterService.getLoanStages();
    const loanStatuses = this._baseParameterService.getLoanStatuses();
    return loan.stage_id <= loanStages['underwriting'] && loan.status_id < loanStatuses['underwritingApprove'];
  }

  mapLoanActivity(loan) {
    const loanType = this.isApprovedLoan(loan) ? 'Approved Loan' : 'Applied Loan';
    let description = '';
    if (loanType === 'Approved Loan') {
      description = `${loan.product.name} ${loan.loan_code} ${this.borrowerActivityTranslation['approved-amount']} ${CONFIGURATION.currency_symbol}${this._utilityService.formatDecimal(loan.applied_amount)}.`
    } else {
      description = `${this.borrowerActivityTranslation['applied-for']} ${loan.product.name} ${loan.loan_code} ${this.borrowerActivityTranslation['with-amount']} ${CONFIGURATION.currency_symbol}${this._utilityService.formatDecimal(loan.applied_amount)}.`;
    }
    return <Activity> {
      amount: loan.applied_amount,
      currency: CONFIGURATION.currency_symbol,
      currencyFormat: CONFIGURATION.format.decimal,
      dateTime: new Date(loan.created_at),
      dateTimeFormat: CONFIGURATION.format.date_time,
      description: description,
      status: loan.status,
      status_id: loan.status_id,
      stage_id: loan.stage_id,
      type: loanType
    };
  }
}
