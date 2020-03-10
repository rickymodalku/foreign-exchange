import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { FinanceService } from './finance.service';
import { Activity } from '../models/finance.class';
import { EventEmitter } from '../models/generic.class';
import { NotificationService } from '../services/notification.service';
import { UtilityService } from '../services/utility.service';
import CONFIGURATION from '../../configurations/configuration';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ActivityService {
    activityEventEmitter: EventEmitter;
    private _depositActivities: Array<Activity>;
    private _investmentActivities: Array<Activity>;
    private _memberTypeCodes: any;
    private _recentActivities: Array<Activity>;
    private _withdrawalActivities: Array<Activity>;

    constructor(
        private _authService: AuthService,
        private _financeService: FinanceService,
        private _notificationService: NotificationService,
        private _utilityService: UtilityService,
        private _translateService: TranslateService
    ) {
        this.activityEventEmitter = new EventEmitter();
        this._depositActivities = new Array<Activity>();
        this._investmentActivities = new Array<Activity>();
        this._memberTypeCodes = CONFIGURATION.member_type_code;
        this._recentActivities = new Array<Activity>();
        this._withdrawalActivities = new Array<Activity>();
    }

    getDepositActivities(): Array<Activity> {
        return this._depositActivities;
    }

    getInvestmentActivities(): Array<Activity> {
        return this._investmentActivities;
    }

    getRecentActivities(): Array<Activity> {
        return this._recentActivities;
    }

    getWithdrawalActivities(): Array<Activity> {
        return this._withdrawalActivities;
    }

    private _summarizeActivities(activities: Array<Activity>): void {
        activities.forEach(activity => {
            this._recentActivities.push(activity);
        });
        this._recentActivities.sort((a: Activity, b: Activity) => {
            return b.dateTime.getTime() - a.dateTime.getTime();
        });
        this._recentActivities = this._recentActivities.slice(0, 5);
    }

    trigger(): void {
        this._depositActivities = new Array<Activity>();
        this._investmentActivities = new Array<Activity>();
        this._recentActivities = new Array<Activity>();
        this._withdrawalActivities = new Array<Activity>();
        if (this._authService.getMemberTypeCode() === this._memberTypeCodes['borrower']) {
          // This code has been deprecated as we no longer getting loan summary from the endpoint.
        } else if(this._authService.getMemberTypeCode() === this._memberTypeCodes['investor']) {
            let getDepositHistory = new Promise((resolve, reject) => {
                this._financeService
                    .getDepositHistory(true, 1, 5)
                    .subscribe(
                        response => {
                            let activities = new Array<Activity>();
                            if(response.value instanceof Array) {
                                response.value.forEach(element => {
                                    activities.push(<Activity>({
                                        amount: this._utilityService.formatDecimal(element.amount),
                                        currency: CONFIGURATION.currency_symbol,
                                        currencyFormat: CONFIGURATION.format.decimal,
                                        dateTime: new Date(element.createdAt),
                                        dateTimeFormat: CONFIGURATION.format.activity_date_time,
                                        status: element.status,
                                        type: 'Deposit'
                                    }));
                                });
                            }
                            this._summarizeActivities(activities);
                            this._depositActivities = activities;
                            resolve();
                        },
                        error => {
                            reject();
                        }
                    );
            });

            let getInvestmentHistory = new Promise((resolve, reject) => {
                this._financeService
                    .getInvestmentHistory(true, 1, 5)
                    .subscribe(
                        response => {
                            let activities = new Array<Activity>();
                            if(response.value instanceof Array) {
                                const investment_activity_filter = ["SUCCESS"];
                                activities = response.value.filter(data => investment_activity_filter.includes(data.status)).map( element => {
                                    return {
                                    amount: element.amount,
                                    currency: CONFIGURATION.currency_symbol,
                                    currencyFormat: CONFIGURATION.format.decimal,
                                    dateTime: new Date(element.createdAt),
                                    dateTimeFormat: CONFIGURATION.format.date_time,
                                    status: element.status,
                                    type: 'Investment'
                                   }
                                });
                            }
                            this._summarizeActivities(activities);
                            this._investmentActivities = activities;
                            resolve();
                        },
                        error => {
                            reject();
                        }
                    );
            });

            let getWithdrawalHistory = new Promise((resolve, reject) => {
                this._financeService
                    .getWithdrawalHistory(true, 1, 5)
                    .subscribe(
                        response => {
                            let activities = new Array<Activity>();
                            if(response.value instanceof Array) {
                                response.value.forEach(element => {
                                    activities.push(<Activity>({
                                        amount: this._utilityService.formatDecimal(element.amount),
                                        currency: CONFIGURATION.currency_symbol,
                                        currencyFormat: CONFIGURATION.format.decimal,
                                        dateTime: new Date(element.createdAt),
                                        dateTimeFormat: CONFIGURATION.format.activity_date_time,
                                        status: element.status,
                                        type: 'Withdrawal'
                                    }));
                                });
                            }
                            this._summarizeActivities(activities);
                            this._withdrawalActivities = activities;
                            resolve();
                        },
                        error => {
                            reject();
                        }
                    );
            });

            Promise
                .all([getDepositHistory, getInvestmentHistory, getWithdrawalHistory])
                .then(values => {
                    this.activityEventEmitter.emit(true);
                })
                .catch(error => {
                    this._notificationService.error();
                });
        }
    }
}
