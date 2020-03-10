import {
  Component,
  OnInit
} from '@angular/core';
import { Activity } from '../../models/finance.class';
import { AuthService } from '../../services/auth.service';
import { FinanceService } from '../../services/finance.service';
import { NotificationService } from '../../services/notification.service';
import { UtilityService } from '../../services/utility.service';
import CONFIGURATION from '../../../configurations/configuration';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './activity.html'
})
export class ActivityComponent implements OnInit {
  activityModel: any;
  allActivities: Array<Activity>;
  totalData: any;
  depositActivities: Array<Activity>;
  investmentActivities: Array<Activity>;
  withdrawalActivities: Array<Activity>;
  tabs: any;
  investment_activity_filter: any;
  descriptionActivityTranslation: any;
  activityWord: any;
  constructor(
    private _authService: AuthService,
    private _financeService: FinanceService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _translateService: TranslateService,
  ) {
    this.activityModel = {
      all: {
        displayLoadMore: true,
        firstLoad: false,
        page: 1,
        recordsPerPage: 5
      },
      deposit: {
        displayLoadMore: true,
        firstLoad: false,
        page: 1,
        recordsPerPage: 10
      },
      investment: {
        displayLoadMore: true,
        firstLoad: false,
        page: 1,
        recordsPerPage: 10
      },
      withdrawal: {
        displayLoadMore: true,
        firstLoad: false,
        page: 1,
        recordsPerPage: 10
      }
    };
    this.totalData = {
      investment: 0,
      deposit: 0,
      withdrawal: 0
    };
    this.activityWord = {
      investment: '',
      deposit: '',
      withdrawal: ''
    };
    this.allActivities = new Array<Activity>();
    this.depositActivities = new Array<Activity>();
    this.investmentActivities = new Array<Activity>();
    this.withdrawalActivities = new Array<Activity>();
    this.tabs = {
      all: true,
      deposit: false,
      investment: false,
      withdrawal: false
    };
    this.investment_activity_filter = ['SUCCESS'];
  }

  ngOnInit() {

    this._translateService
      .get('activity')
      .subscribe(
        activity => {
          this.descriptionActivityTranslation = activity.description;
          this.activityWord = {
            investment: activity.investment,
            deposit: activity.deposit,
            withdrawal: activity.withdrawal
          };
          this.changeTab('all');
        });
    this.getActivityLength();
  }

  getActivityLength() {
    const paginate = false;
    this._financeService.getDepositHistory(
      paginate,
      this.activityModel.deposit.page,
      this.activityModel.deposit.recordsPerPage
    ).subscribe(
      response => {
        this.totalData.deposit = response.value.length;
      },
      error => {
        this._notificationService.error();
      }
    );

    this._financeService
      .getInvestmentHistory(
        paginate,
        this.activityModel.all.page,
        this.activityModel.all.recordsPerPage
      )
      .subscribe(
        response => {
          this.totalData.investment = response.value.length;
        },
        error => {
          this._notificationService.error();
        }
      );

    this._financeService
      .getWithdrawalHistory(
        paginate,
        this.activityModel.all.page,
        this.activityModel.all.recordsPerPage
      )
      .subscribe(
        response => {
          this.totalData.withdrawal = response.value.length;
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  changeTab(tabName: string): void {
    for (let tab in this.tabs) {
      this.tabs[tab] = (tab === tabName);
    }

    switch (tabName) {
      case 'all':
        if (!this.activityModel.all.firstLoad) {
          this.getAllActivities();
        }
        break;
      case 'deposit':
        if (!this.activityModel.deposit.firstLoad) {
          this.getDepositActivities();
        }
        break;
      case 'investment':
        if (!this.activityModel.investment.firstLoad) {
          this.getInvestmentActivities();
        }
        break;
      case 'withdrawal':
        if (!this.activityModel.withdrawal.firstLoad) {
          this.getWithdrawalActivities();
        }
        break;
    }
  }

  getAllActivities(paginate: boolean = true): void {
    if (!paginate) {
      this.allActivities = new Array<Activity>();
    }

    let getDepositHistory = new Promise((resolve, reject) => {
      this._financeService
        .getDepositHistory(
          paginate,
          this.activityModel.all.page,
          this.activityModel.all.recordsPerPage
        )
        .subscribe(
          response => {
            let activities = new Array<Activity>();
            if (response.value instanceof Array) {
              response.value.forEach(element => {
                activities.push(<Activity>({
                  amount: element.amount,
                  currency: CONFIGURATION.currency_symbol,
                  currencyFormat: CONFIGURATION.format.decimal,
                  dateTime: new Date(element.createdAt),
                  dateTimeFormat: CONFIGURATION.format.date_time,
                  description: this.descriptionActivityTranslation["description-deposit-1"] + CONFIGURATION.currency_symbol + this._utilityService.formatDecimal(element.amount) + this.descriptionActivityTranslation["description-deposit-2"] + element.status + '.',
                  status: element.status,
                  type: 'Deposit',
                  word: this.activityWord.deposit
                }));
              });
            }
            this._summarizeActivities(activities);
            resolve(activities.length === this.activityModel.all.recordsPerPage);
          },
          error => {
            reject();
          }
        );
    });

    let getInvestmentHistory = new Promise((resolve, reject) => {
      this._financeService
        .getInvestmentHistory(
          paginate,
          this.activityModel.all.page,
          this.activityModel.all.recordsPerPage
        )
        .subscribe(
          response => {
            let activities = new Array<Activity>();
            if (response.value instanceof Array) {
              activities = response.value.filter(data => (this.investment_activity_filter).includes(data.status)).map(element => {
                return {
                  amount: element.amount,
                  currency: CONFIGURATION.currency_symbol,
                  currencyFormat: CONFIGURATION.format.decimal,
                  dateTime: new Date(element.createdAt),
                  dateTimeFormat: CONFIGURATION.format.date_time,
                  description: this.descriptionActivityTranslation["description-investment-1"] + CONFIGURATION.currency_symbol + this._utilityService.formatDecimal(element.amount) + this.descriptionActivityTranslation["description-investment-2"] + element.loanCode + '. ' + this.descriptionActivityTranslation["status"] + element.status + '.',
                  status: element.status,
                  type: 'Investment',
                  word: this.activityWord.investment
                }
              });
            }
            this._summarizeActivities(activities);
            resolve(activities.length === this.activityModel.all.recordsPerPage);
          },
          error => {
            reject();
          }
        );
    });

    let getWithdrawalHistory = new Promise((resolve, reject) => {
      this._financeService
        .getWithdrawalHistory(
          paginate,
          this.activityModel.all.page,
          this.activityModel.all.recordsPerPage
        )
        .subscribe(
          response => {
            let activities = new Array<Activity>();
            if (response.value instanceof Array) {
              response.value.forEach(element => {
                activities.push(<Activity>({
                  amount: element.amount,
                  currency: CONFIGURATION.currency_symbol,
                  currencyFormat: CONFIGURATION.format.decimal,
                  dateTime: new Date(element.createdAt),
                  dateTimeFormat: CONFIGURATION.format.date_time,
                  description: this.descriptionActivityTranslation["description-withdrawal-1"] + CONFIGURATION.currency_symbol + this._utilityService.formatDecimal(element.amount) + this.descriptionActivityTranslation["description-withdrawal-2"] + element.status + '.',
                  status: element.status,
                  type: 'Withdrawal',
                  word: this.activityWord.withdrawal
                }));
              });
            }
            this._summarizeActivities(activities);
            resolve(activities.length === this.activityModel.all.recordsPerPage);
          },
          error => {
            reject();
          }
        );
    });

    Promise
      .all([getDepositHistory, getInvestmentHistory, getWithdrawalHistory])
      .then(values => {
        let displayLoadMore = false;
        let value = values.find(value => {
          return value === true;
        });
        if (value) {
          displayLoadMore = true;
        }

        this.activityModel.all.displayLoadMore = paginate ? displayLoadMore : false;
        this.activityModel.all.firstLoad = true;
        this.activityModel.all.page++;
      })
      .catch(error => {
        this._notificationService.error();
      });
  }

  getDepositActivities(paginate: boolean = true): void {
    this._financeService.getDepositHistory(
      paginate,
      this.activityModel.deposit.page,
      this.activityModel.deposit.recordsPerPage
    ).subscribe(
      response => {
        if (!paginate) {
          this.depositActivities = new Array<Activity>();
        }
        if (response.value instanceof Array) {
          this.activityModel.deposit.firstLoad = true;
          this.activityModel.deposit.page++;
          response.value.forEach(element => {
            this.depositActivities.push(<Activity>({
              amount: element.amount,
              currency: CONFIGURATION.currency_symbol,
              currencyFormat: CONFIGURATION.format.decimal,
              dateTime: new Date(element.createdAt),
              dateTimeFormat: CONFIGURATION.format.date_time,
              description: this.descriptionActivityTranslation["description-deposit-1"] + CONFIGURATION.currency_symbol + this._utilityService.formatDecimal(element.amount) + this.descriptionActivityTranslation["description-deposit-2"] + element.status + '.',
              status: element.status,
              type: 'Deposit',
              word: this.activityWord.deposit
            }));
          });
          this.activityModel.deposit.displayLoadMore = paginate ? (this.depositActivities.length < this.totalData.deposit) : false;
        }
      },
      error => {
        this._notificationService.error();
      }
    );
  }

  getInvestmentActivities(paginate: boolean = true): void {
    this._financeService.getInvestmentHistory(
      paginate,
      this.activityModel.investment.page,
      this.activityModel.investment.recordsPerPage
    ).subscribe(
      response => {
        if (response.value instanceof Array) {
          if (!paginate) {
            this.investmentActivities = new Array<Activity>();
          }
          this.activityModel.investment.firstLoad = true;
          this.activityModel.investment.page++;

          response.value.forEach(element => {
            this.investmentActivities.push(<Activity>({
              amount: element.amount,
              currency: CONFIGURATION.currency_symbol,
              currencyFormat: CONFIGURATION.format.decimal,
              dateTime: new Date(element.createdAt),
              dateTimeFormat: CONFIGURATION.format.date_time,
              description: this.descriptionActivityTranslation["description-investment-1"] + CONFIGURATION.currency_symbol + this._utilityService.formatDecimal(element.amount) + this.descriptionActivityTranslation["description-investment-2"] + element.loanCode + '. ' + this.descriptionActivityTranslation["status"] + element.status + '.',
              status: element.status,
              type: 'Investment',
              word: this.activityWord.investment
            }));
          });
          this.activityModel.investment.displayLoadMore = paginate ? (this.investmentActivities.length < this.totalData.investment) : false;
        }
      },
      error => {
        this._notificationService.error();
      }
    );
  }

  getWithdrawalActivities(paginate: boolean = true): void {
    this._financeService.getWithdrawalHistory(
      paginate,
      this.activityModel.withdrawal.page,
      this.activityModel.withdrawal.recordsPerPage
    ).subscribe(
      response => {
        if (response.value instanceof Array) {
          if (!paginate) {
            this.withdrawalActivities = new Array<Activity>();
          }

          this.activityModel.withdrawal.firstLoad = true;
          this.activityModel.withdrawal.page++;

          response.value.forEach(element => {
            this.withdrawalActivities.push(<Activity>({
              amount: element.amount,
              currency: CONFIGURATION.currency_symbol,
              currencyFormat: CONFIGURATION.format.decimal,
              dateTime: new Date(element.createdAt),
              dateTimeFormat: CONFIGURATION.format.date_time,
              description: this.descriptionActivityTranslation["description-withdrawal-1"] + CONFIGURATION.currency_symbol + this._utilityService.formatDecimal(element.amount) + this.descriptionActivityTranslation["description-withdrawal-2"] + element.status + '.',
              status: element.status,
              type: 'Withdrawal',
              word: this.activityWord.withdrawal
            }));
          });
          this.activityModel.withdrawal.displayLoadMore = paginate ? (this.withdrawalActivities.length < this.totalData.withdrawal) : false;
        }
      },
      error => {
        this._notificationService.error();
      }
    );
  }

  private _summarizeActivities(activities: Array<Activity>): void {
    activities.forEach(activity => {
      this.allActivities.push(activity);
    });
    this._utilityService.sortByKey(this.allActivities, 'dateTime', 'dateTime');
  }
}
