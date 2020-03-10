
import {throttleTime} from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import {
  SwiperConfigInterface,
  SwiperComponent
} from 'ngx-swiper-wrapper';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { DocumentService } from '../../services/document.service';
import { FinanceService } from '../../services/finance.service';
import { LoanService } from '../../services/loan.service';
import { NoteService } from '../../services/note.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from '../../services/utility.service';
import { WindowService } from '../../services/window.service';
import CONFIGURATION from '../../../configurations/configuration';
import { ModalService } from 'app/services/modal.service';
import * as json2csv from 'json2csv';
import { saveAs } from 'file-saver';
const Json2csvParser = require('json2csv').Parser;
import { Subject } from 'rxjs';

import { DatePipe } from '@angular/common';
import { MemberService } from '../../services/member.service';
import { capitalize } from 'lodash';

@Component({
  selector: 'portfolio',
  templateUrl: './portfolio.html'
})
export class PortfolioComponent implements OnInit {
  @ViewChild('portfolioLegend', { static: true }) legendElement: ElementRef;
  accountOverview: any;
  countryCode: any;
  currency: string;
  currentTime: any;
  investedFilter: string;
  masterData: any;
  mobileSwiperConfiguration: SwiperConfigInterface;
  portfolioFilter: any;
  portfolioNumbers: Array<any>;
  portfolioNumbersConfigs: Array<any>;
  portfolioModel: any;
  defaultedStats = {
    inRecoveryAmount: 0,
    inRecoveryLabel: '',
    nonRecoverableAmount: 0,
    nonRecoverableLabel: '',
    totalDefaultedAmount: 0,
    totalDefaultedLabel: '',
  };
  defaultedDef = {
    content: '',
    buttonLabel: '',
    definitionText: '',
    title: '',
    inRecovery: {
      content: '',
      title: '',
    },
    nonRecoverable: {
      content: '',
      title: '',
    }
  };
  loanStatusMapping: any;

  showInRecoveryDef = false;
  showSubStatusFilter = false;
  repaymentFilter: string;
  repaymentSnapshot: Array<any>;
  selectedTable: string;
  showGst: boolean;
  earlyRepaidWording: string;
  repaymentStatusList: any;
  gracePeriodSetting: any;
  loyaltyDetailPoint: any;
  institutionalFlag: boolean;

  stickyLegend = false;
  elementPosition: any;
  scrollSubject = new Subject<number>();
  scrollObservable = this.scrollSubject.asObservable().pipe(throttleTime(50)); // set to 50ms
  enableLoyaltyProgram: boolean;
  lastScrollPosition = 0;
  showTaxField = CONFIGURATION.portfolio.showTaxField;
  enableRestructuredLoan: boolean;
  restructuredLoanLink: string;

  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _documentService: DocumentService,
    private _financeService: FinanceService,
    private _loanService: LoanService,
    private _noteService: NoteService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _utilityService: UtilityService,
    private _modalService: ModalService,
    private _memberService: MemberService,
    private datePipe: DatePipe,
  ) {
    this.accountOverview = null;
    this.countryCode = CONFIGURATION.country_code;
    this.currency = CONFIGURATION.currency_symbol;
    this.showGst = this.countryCode === 'MY';
    this.currentTime = new Date();
    this.masterData = {
      months: new Array<any>(),
      loanStatuses: new Array<any>(),
      loanTypes: new Array<any>(),
      paymentStatuses: new Array<any>(),
      shortMonths: new Array<any>(),
      tenorTypes: new Array<any>()
    };
    this.portfolioFilter = {
      caption: new Array(),
      displayDialog: false,
      displayClearButton: false,
      list: {
        loanStatus: new Array<any>(),
        loanType: new Array<any>(),
        repaymentStatus: new Array<any>()
      },
      value: {
        loanStatus: '',
        maturityDate: '',
        loanType: '',
        repaymentStatus: '',
        startDate: ''
      }
    };
    this.portfolioModel = {
      colspan: 11,
      data: new Array<any>(),
      repaymentData: new Array<any>(),
      dateFormat: CONFIGURATION.format.date,
      dateTimeFormat: CONFIGURATION.format.date_time,
      dateLabel: '',
      decimalFormat: CONFIGURATION.format.decimal,
      localeDecimalFormat: CONFIGURATION.format.locale,
      displayInvestedLoadMore: true,
      displayRepaymentLoadMore: true,
      investedPage: 1,
      repaymentPage: 1,
      recordsPerPage: 100,
      repaymentNotes: {
        data: new Array<any>(),
        display: false,
        loanIds: new Array<any>()
      },
      precision: 2,
      shortDateLabel: '',
      swiperConfiguration: {
        centeredSlides: true,
        direction: 'horizontal',
        keyboardControl: true,
        loop: false,
        mousewheelControl: false,
        nextButton: '.swiper-button-next',
        pagination: '.swiper-pagination',
        prevButton: '.swiper-button-prev',
        scrollbarDraggable: false,
        scrollbarHide: false,
        scrollbarSnapOnRelease: false,
        slidesPerView: 7
      }
    };
    this.portfolioNumbers = [];
    this.portfolioNumbersConfigs = [
      {
        firebasekey: 'loan-invested',
        apikey: 'invested_loans',
        displaydetail: false,
        sort: 1,
        labelFormatter: function (label) {
          return label
        }.bind(this),
        valueFormatter: ''
      },
      {
        firebasekey: 'loan-ongoing',
        apikey: 'loan_ongoing',
        displaydetail: false,
        sort: 2,
        labelFormatter: function (label) {
          return label
        }.bind(this),
      },
      {
        firebasekey: 'expected-return',
        apikey: 'total_expected_interest',
        displaydetail: true,
        sort: 3,
        labelFormatter: function (label) {
          return label + '(' + this.currency + ')'
        }.bind(this),
        valueFormatter: function (value) {
          return this._utilityService.truncateDecimal(value, this.portfolioModel.precision);
        }.bind(this)
      },
      {
        firebasekey: 'yearly-interest-earned',
        apikey: 'yearly_interest_earned',
        displaydetail: false,
        sort: 4,
        labelFormatter: function (label) {
          return label
        }.bind(this),
        valueFormatter: function (value) {
          return this._utilityService.formatDecimal(value.toFixed(2)) + '%';
        }.bind(this)
      },
      {
        firebasekey: 'due-unpaid',
        apikey: 'due_unpaid_repayment_this_month',
        displaydetail: false,
        sort: 5,
        labelFormatter: function (label) {
          return label + '(' + this.currency + ')'
        }.bind(this),
        valueFormatter: function (value) {
          return this._utilityService.truncateDecimal(value, this.portfolioModel.precision);
        }.bind(this)
      },
      {
        firebasekey: 'expected-repayment-this-month',
        apikey: 'expected_repayment_this_month',
        displaydetail: true,
        sort: 6,
        labelFormatter: function (label) {
          return label + '(' + this.currency + ')'
        }.bind(this),
        valueFormatter: function (value) {
          return this._utilityService.truncateDecimal(value, this.portfolioModel.precision);
        }.bind(this)
      },
      {
        firebasekey: 'investor-exposure',
        apikey: 'investor_exposure',
        displaydetail: true,
        sort: 7,
        labelFormatter: function (label) {
          return label + '(' + this.currency + ')'
        }.bind(this),
        valueFormatter: function (value) {
          return this._utilityService.truncateDecimal(value, this.portfolioModel.precision);
        }.bind(this)
      }
    ];
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
    this.investedFilter = 'loan-status';
    this.selectedTable = 'invested-loan';
    this.repaymentFilter = 'month';
    this.repaymentSnapshot = new Array();
    this.enableLoyaltyProgram = CONFIGURATION.enableLoyaltyProgram;
    this.institutionalFlag = false;
    this.enableRestructuredLoan = CONFIGURATION.enableRestructuredLoan;
    this.restructuredLoanLink = CONFIGURATION.restructuredLoanLink;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.scrollSubject.next(window.pageYOffset);
  }

  ngOnInit() {
    this.loanStatusMapping = this._baseParameterService.getLoanStatusesMapping();
    this.institutionalFlag = (this._authService.getIsInstitutional() === 'true');
    this.scrollObservable.subscribe(x => this.handleScroll(x));
    window['Intercom']("trackEvent", "Web_Viewed_Portfolio");
    if (this.countryCode !== 'ID') {
      this.portfolioModel.colspan = 12;
    }
    if (this.countryCode !== 'ID') {
      this.portfolioModel.precision = 0;
    }
    this.getInvestorPortfolioInstallment(true);
    this._loanService
      .getLoanTypes()
      .subscribe(
        response => {
          this.masterData.loanTypes = response.data;
          for (let i = 0; i < this.masterData.loanTypes.length; i++) {
            this.portfolioFilter.list.loanType.push({
              value: this.masterData.loanTypes[i].type_id,
              label: this.masterData.loanTypes[i].type_name,
            });
          }
        },
        error => {
          this._notificationService.error();
        }
      );

    this._translateService
      .get('master.payment-status-filter')
      .subscribe(
        paymentStatus => {
          this.masterData.paymentStatuses = paymentStatus;
          for (let i = 0; i < this.masterData.paymentStatuses.length; i++) {
            this.portfolioFilter.list.repaymentStatus.push({
              value: this.masterData.paymentStatuses[i].value,
              label: this.masterData.paymentStatuses[i].label,
            });
          }
        });

    this._translateService
      .get('investor-portfolio.repayment-legend.partial-early-repayment')
      .subscribe(
        earlyRepaid => {
          this.earlyRepaidWording = earlyRepaid;
        });

    this._translateService
      .get('master.loan-status-filter')
      .subscribe(
        loanStatus => {
          this.masterData.loanStatuses = loanStatus;
          for (let i = 0; i < this.masterData.loanStatuses.length; i++) {
            this.portfolioFilter.list.loanStatus.push({
              value: this.masterData.loanStatuses[i].value,
              label: this.masterData.loanStatuses[i].label,
            });
          }
        });
    this._translateService
      .get('master.loan-sub-status-filter')
      .subscribe(
        loanSubStatus => {
        this.masterData.loanSubStatuses = loanSubStatus;
        this.portfolioFilter.list.loanSubStatus = [];
      });

    this._financeService
      .getInvestorOverview()
      .subscribe(
        async (response) => {
          this.accountOverview = response.value;
          this._translateService
            .get('portfolio.label')
            .subscribe(
              async (paymentStatus) => {
                for (const key in paymentStatus) {
                  if (key) {
                    for (let i = 0; i < this.portfolioNumbersConfigs.length; i++) {
                      const curPortfolioConfig = this.portfolioNumbersConfigs[i];
                      const curFireBaseKey = curPortfolioConfig.firebasekey;
                      if (curFireBaseKey === key) {
                        let value = this.accountOverview[curPortfolioConfig.apikey];
                        // Special case for total pricipal invested
                        if (curFireBaseKey === 'total_principal_invested') {
                          value = value + this.accountOverview['pending_funds_invested'];
                        }
                        if (typeof curPortfolioConfig.valueFormatter === 'function') {
                          value = isNaN(value) ? value : await curPortfolioConfig.valueFormatter(value);
                        }
                        this.portfolioNumbers.push({
                          value: value,
                          detailvalue: this.countryCode === 'ID' ?
                            Number(this.accountOverview[curPortfolioConfig.apikey]).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }) :
                            Number(this.accountOverview[curPortfolioConfig.apikey]).toLocaleString('ja-JP', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                          label: curPortfolioConfig.labelFormatter(paymentStatus[curFireBaseKey]),
                          displaydetail: curPortfolioConfig.displaydetail,
                          apikey: curPortfolioConfig.apikey,
                          sort: curPortfolioConfig.sort
                        });
                      }
                    }
                  }
                }
                this.portfolioNumbers.sort((a, b) => {
                  if (a.sort < b.sort) return -1;
                  else if (a.sort > b.sort) return 1;
                  else return 0;
                });
                this.initDefaultClassificationTextLabels();
                await this.initDefaultClassifictionStats();
              });

          if (this.accountOverview.repayment_snapshots != null) {
            for (let key in this.accountOverview.repayment_snapshots) {
              if (key) {
                this.repaymentSnapshot.push({
                  month: new Date(0, this.accountOverview.repayment_snapshots[key]['month'] - 1),
                  year: this.accountOverview.repayment_snapshots[key]['year'],
                  detailAmount: this.countryCode === 'ID' ? Number(this.accountOverview.repayment_snapshots[key]['amount']).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }) :
                    Number(this.accountOverview.repayment_snapshots[key]['amount']).toLocaleString('ja-JP', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                  amount: await this._utilityService.truncateDecimal(this.accountOverview.repayment_snapshots[key]['amount'], this.portfolioModel.precision)
                });
              }
            }
          } else {
            var now = new Date();
            var currMonth = now.getMonth() + 1;
            for (let i = 0; i < 6; i++) {
              let current = new Date(now.getFullYear(), currMonth, 1);
              currMonth++;
              this.repaymentSnapshot.push({
                month: new Date(0, current.getMonth()),
                year: current.getFullYear(),
                amount: 0
              });
            }
          }
        },
        error => {
          this._notificationService.error();
        }
      );

    this.getinvestedLoanDetails(true);

    this._translateService
      .get('master')
      .subscribe(
        masterData => {
          this.masterData.months = masterData['months'];
          this.masterData.paymentStatuses = masterData['payment-statuses'];
          this.masterData.shortMonths = masterData['short-months'];
          this.masterData.tenorTypes = masterData['tenor-types'];
          let today = new Date();
          this.portfolioModel.dateLabel = this.masterData.months[today.getMonth()] + ' ' + today.getFullYear();
          this.portfolioModel.shortDateLabel = this.masterData.shortMonths[today.getMonth()] + ' ' + today.getFullYear();
          const hours = today.getHours();
          this.currentTime = today.getDate() + ' ' + this.masterData.months[today.getMonth()] +
            ' ' + today.getFullYear() + ' ' + hours + ':' + (today.getMinutes() < 10 ? '0' : '') +
            today.getMinutes();
        });

    this._translateService
      .get('investor-portfolio.repayment-legend')
      .subscribe(
        legend => {
          this.repaymentStatusList = legend;
        });
    this.gracePeriodSetting = this._baseParameterService.getGracePeriodSetting();

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

  }

  currencyLabelFormatter (label) {
    return label + '(' + this.currency + ')';
  }

  async currencyValueFormatter (value) {
    return value ?
      this._utilityService.truncateDecimal(value, this.portfolioModel.precision) :
      this._utilityService.truncateDecimal(0, this.portfolioModel.precision);
  }

  async initDefaultClassifictionStats() {
    if ( 'default_classification' in this.accountOverview) {
      this.defaultedStats = {
        ...this.defaultedStats,
        inRecoveryAmount: await this.currencyValueFormatter(this.accountOverview['default_classification'].in_recovery_amount),
        nonRecoverableAmount:  await this.currencyValueFormatter(this.accountOverview['default_classification'].non_recoverable_amount),
        totalDefaultedAmount:  await this.currencyValueFormatter(this.accountOverview['total_principal_default_loan']),
      };
    }
  }

  initDefaultClassificationTextLabels() {
    this._translateService.get('portfolio.default-classification').subscribe( async (defaultClassification) => {
      this.defaultedStats = {
        ...this.defaultedStats,
        inRecoveryLabel: defaultClassification['in-recovery'],
        nonRecoverableLabel: defaultClassification['non-recoverable'],
        totalDefaultedLabel: this.currencyLabelFormatter(defaultClassification['total-defaulted']),
      };
      this.defaultedDef = defaultClassification['defaulted-def'];
      this.defaultedDef.buttonLabel = this.defaultedDef['button-got-it'];
      this.defaultedDef.definitionText = this.defaultedDef['definition-text'];
      this.defaultedDef.inRecovery = this.defaultedDef['in-recovery'];
      this.defaultedDef.nonRecoverable = this.defaultedDef['non-recoverable'];
    });
  }

  showDefaultDef(status) {
    this.showInRecoveryDef = status === 'In-Recovery' ? true : false;
    this.openModal('DefaultDefModal');
  }
  download(url: string, filename: string = 'file'): void {
    this._documentService.download(url, filename);
  }

  downloadPortfolioCsv() {
    this._financeService.getPortfolioCsvData()
      .subscribe(
        response => {
          const loanData = response.loans;
          const self = this;
          loanData.forEach(function (a) {
            a.tenor_type = self._baseParameterService.tenor_type_label.find(o => o.tenor_type === a.tenor_type).key;
            if ( a.loan_status === 'DEFAULT') {
              a.loan_status += a.loan_sub_status === 'SET-DEFAULT-IN-RECOVERY' ? ' In-Recovery' : ' Non-Recoverable';
            }
          });
          const fields = [
            { label: (this.countryCode === 'SG' ? 'Note_ID' : 'Loan code'), value: 'loan_code' },
            { label: (this.countryCode === 'SG' ? 'SME_ID' : 'Borrower id'), value: 'borrower_id' },
            { label: 'Term', value: 'term' },
            { label: 'Tenor type', value: 'tenor_type' },
            { label: 'Disbursal date', value: 'disbursal_date' },
            { label: (this.countryCode === 'SG' ? 'Repayment status' : 'Loan status'), value: 'loan_status' },
            { label: 'Interest rate (p.a)', value: 'interest_rate' },
            { label: 'Expected repayment (' + this.currency + ')', value: 'expected_payment' },
            { label: 'Actual repayment (' + this.currency + ')', value: 'actual_payment' },
            { label: 'Paid principal (' + this.currency + ')', value: 'paid_principal' },
            { label: 'Unpaid principal (' + this.currency + ')', value: 'unpaid_principal' },
            { label: 'Interest (' + this.currency + ')', value: 'interest' },
            { label: 'Service fee (' + this.currency + ')', value: 'service_fee' }];
          if (this.showTaxField) {
            if (loanData[0].hasOwnProperty('withholding_tax')) {
              fields.push({ label: 'Withholding Tax (' + this.currency + ')', value: 'withholding_tax' });
            }
            if (loanData[0].hasOwnProperty('gst')) {
              fields.push({ label: 'GST (' + this.currency + ')', value: 'gst' });
            }
          }
          const json2csvParser = new Json2csvParser({ fields });
          const csv = json2csvParser.parse(response.loans);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
          const filename = this._authService.getUserName() + '_portfolio.csv';
          saveAs(blob, filename);
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  getInvestorPortfolioInstallment(paginate: boolean = true): void {
    this._financeService
      .getInvestorPortfolioInstallments(
        paginate,
        this.portfolioModel.repaymentPage,
        this.portfolioModel.recordsPerPage)
      .subscribe(
        response => {
          const installments = response.value;
          if (!paginate) {
            this.portfolioModel.repaymentData = [];
          }
          installments.forEach(installment => {
            installment.data = new Array<any>();
            installment.datas.forEach(yearObject => {
              yearObject.data.forEach(monthObject => {
                const deadline = new Date(monthObject.installment_date);
                installment.data.push({
                  month: deadline.getMonth(),
                  status: monthObject.installment_status,
                  year: deadline.getFullYear()
                });
              });
            });
            this.portfolioModel.repaymentData.push(installment);
          });
          this.portfolioModel.repaymentPage++;
          this.portfolioModel.displayRepaymentLoadMore = paginate ? this.portfolioModel.recordsPerPage === response.value.length : false;
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  getinvestedLoanDetails(paginate: boolean = true): void {
    let loanIds = new Array<number>();
    this._financeService
      .getInvestorPortfolioRepayments(
        paginate,
        this.portfolioFilter.value.loanType ? this.portfolioFilter.value.loanType : 0,
        this.portfolioFilter.value.loanStatus ? this.portfolioFilter.value.loanStatus : this.portfolioFilter.value.repaymentStatus ? 'SET-ONGOING' : this.portfolioFilter.value.loanStatus,
        this.portfolioFilter.value.loanSubStatus ? this.portfolioFilter.value.loanSubStatus : '',
        this.portfolioFilter.value.repaymentStatus ? this.portfolioFilter.value.repaymentStatus : '',
        this.portfolioFilter.value.startDate[0] ? this.portfolioFilter.value.startDate[0] : '',
        this.portfolioFilter.value.startDate[1] ? this.portfolioFilter.value.startDate[1] : this.portfolioFilter.value.startDate[0] ? this.portfolioFilter.value.startDate[0] : '',
        this.portfolioFilter.value.maturityDate[0] ? this.portfolioFilter.value.maturityDate[0] : '',
        this.portfolioFilter.value.maturityDate[1] ? this.portfolioFilter.value.maturityDate[1] : this.portfolioFilter.value.maturityDate[0] ? this.portfolioFilter.value.maturityDate[0] : '',
        this.portfolioModel.investedPage,
        this.portfolioModel.recordsPerPage)
      .subscribe(
        response => {
          if (!paginate) {
            this.portfolioModel.data = [];
          }
          for (const item of response.value) {
            if ( item.loan_status === this.loanStatusMapping['default']) {
              item.status_message = item.loan_sub_status === 'SET-DEFAULT-IN-RECOVERY' ? 'In-Recovery' : 'Non-Recoverable';
            }
            this.portfolioModel.data.push(item);
          }
          this.portfolioModel.data.forEach(repayment => {
            repayment.detailFetched = false;
            repayment.displayDetail = false;
            repayment.isActualRepayment = true;
            repayment.first_repayment = null;
            repayment.last_repayment = null;
            repayment.installments_completed = 0;
            loanIds.push(repayment.loan_id);
          });
          if (loanIds.length > 0) {
            this._noteService
              .getRepaymentsNotes(loanIds)
              .subscribe(
                response => {
                  this.portfolioModel.repaymentNotes.loanIds =
                    this.portfolioModel.repaymentNotes.loanIds.concat(response && response.data ? response.data : []);
                },
                error => {
                  this._notificationService.error();
                });
          }
          this.portfolioModel.investedPage++;
          this.portfolioModel.displayInvestedLoadMore = paginate ? this.portfolioModel.recordsPerPage === response.value.length : false;
        },
        error => {
          this._notificationService.error();
        });

  }

  getRepaymentDetails(repayment: any): void {
    if (!repayment.displayDetail) {
      if (repayment.detailFetched) {
        repayment.displayDetail = true;
      } else {
        this._financeService
          .getInvestorPortolioRepaymentDetails(this._authService.getMemberId(), repayment.loan_id)
          .subscribe(
            response => {
              repayment.actual_data = response.value.actual_data;
              repayment.data = response.value.data;
              repayment.detailFetched = true;
              repayment.displayDetail = true;
              if (repayment.actual_data) {
                repayment.actual_data.forEach(data => {
                  data.status = data.status ===
                    this.masterData.paymentStatuses['early-paid'] ? this.earlyRepaidWording : data.status;
                });
              }
              if (repayment.data) {
                repayment.first_repayment = repayment.data.length > 0 ?
                  repayment.data[0].deadline :
                  '-';
                repayment.last_repayment = repayment.data.length > 0 ?
                  repayment.data[repayment.data.length - 1].deadline :
                  '-';
                repayment.installments_completed = repayment.data.filter(datum => {
                  return datum.status === this.masterData.paymentStatuses['early-paid'] ||
                    datum.status === this.masterData.paymentStatuses['paid'] ||
                    datum.status === this.masterData.paymentStatuses['late-repaid'] ||
                    datum.status === this.masterData.paymentStatuses['over-paid'];
                }).length;
                repayment.data.forEach(data => {
                  data.status = data.status === this.masterData.paymentStatuses['early-paid'] ? this.earlyRepaidWording : data.status;
                });
              } else {
                repayment.first_repayment = '-';
                repayment.last_repayment = '-';
              }
            }
          );
      }
    } else {
      repayment.displayDetail = false;
    }
  }

  getTenorTypeLabel(tenorTypeKey: string): string {
    if (tenorTypeKey && this.masterData.tenorTypes.length > 0) {
      const tenor_type = this._baseParameterService.tenor_type_label.find(o => o.tenor_type === tenorTypeKey);
      return this.masterData.tenorTypes.find(x => x.key === tenor_type.key).value;
    }
  }

  goToInvestedLoanDetails(loanCode: string): void {
    this.selectedTable = 'invested-loan';
    if (loanCode) {
      const elementPos = this.portfolioModel.data.findIndex((obj => obj.loan_code === loanCode));
      for (let i = 0; i < this.portfolioModel.data.length; i++) {
        if (i !== elementPos) {
          this.portfolioModel.data[i].displayDetail = false;
        }
      }
      this.getRepaymentDetails(this.portfolioModel.data[elementPos]);
    }

  }

  hideRepaymentNotesDialog(): void {
    this.closeModal('RepaymentNoteModal');
  }

  getRepaymentColor(data: any, index: number): object {
    for (let s = 0; s < data.data.length; s++) {
      const currentdata = data.data[s];
      const currentdate = new Date(currentdata.installment_date);
      const month = currentdate.getMonth();
      if (month === index) {
        const installmentstatus = currentdata.installment_status;
        if (installmentstatus === this.masterData.paymentStatuses['paid'] ||
          installmentstatus === this.masterData.paymentStatuses['over-paid']) {
          return { code: 1, status: this.repaymentStatusList.paid };
        } else if (installmentstatus === this.masterData.paymentStatuses['default']) {
          return { code: 2, status: this.repaymentStatusList.default };
        } else if (installmentstatus === this.masterData.paymentStatuses['miss'] || installmentstatus === '') {
          return { code: 7, status: this.repaymentStatusList.miss };
        } else if (installmentstatus === this.masterData.paymentStatuses['partial-paid']) {
          return { code: 3, status: this.repaymentStatusList.partial };
        } else if (installmentstatus === this.masterData.paymentStatuses['late-repaid']) {
          return { code: 4, status: this.repaymentStatusList.late };
        } else if (installmentstatus === this.masterData.paymentStatuses['unpaid']) {
          return { code: 5, status: this.repaymentStatusList['not-due'] };
        } else if (installmentstatus === this.masterData.paymentStatuses['early-paid']) {
          return { code: 6, status: this.repaymentStatusList.early };
        } else {
          return { code: 0, status: '' };
        }
      }
    }
    return { code: 0, status: '' };
  }

  resetFilter(refreshTable: boolean = false) {
    this.portfolioFilter.caption = [];
    this.portfolioFilter.list.loanSubStatus = [];
    this.showSubStatusFilter = false;
    for (const key in this.portfolioFilter.value) {
      if (key) {
        this.portfolioFilter.value[key] = '';
      }
    }
    if (refreshTable) {
      this.portfolioModel.data = [];
      this.portfolioModel.investedPage = 1;
      this.onFilterCheck();
      this.getinvestedLoanDetails();
    }
  }

  onFilterCheck() {
    this.portfolioFilter.displayClearButton = false;
    for (const key in this.portfolioFilter.value) {
      if (this.portfolioFilter.value[key]) {
        this.portfolioFilter.displayClearButton = true;
        return;
      }
    }
  }

  onRepaymentStatusFilterChange() {
    this.portfolioFilter.value.loanStatus = 'SET-ONGOING';
  }

  onLoanStatusFilterChange() {
    this.portfolioFilter.list.loanSubStatus = [];
    this.portfolioFilter.value.loanSubStatus = '';
    if (this.portfolioFilter.value.loanStatus !== 'SET-ONGOING') {
      this.portfolioFilter.value.repaymentStatus = '';
    }
    if (this.portfolioFilter.value.loanStatus in this.masterData.loanSubStatuses) {
      const loanStatus = this.portfolioFilter.value.loanStatus;
      for (let i = 0; i < this.masterData.loanSubStatuses[loanStatus].length; i++) {
        this.portfolioFilter.list.loanSubStatus .push({
          value: this.masterData.loanSubStatuses[loanStatus][i].value,
          label: this.masterData.loanSubStatuses[loanStatus][i].label,
        });
      }
    }
    this.showSubStatusFilter = this.portfolioFilter.list.loanSubStatus.length > 0;
  }

  getFilterCaption() {
    this.portfolioFilter.caption = [];
    for (const key in this.portfolioFilter.value) {
      if (this.portfolioFilter.value[key]) {
        this.portfolioFilter.caption.push((key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()));
      }
    }
  }

  onFilterLoan() {
    this.getFilterCaption();
    this.closeModal('PortfolioFilterModal');
    for (const key in this.portfolioFilter.value) {
      if (this.portfolioFilter.value[key]) {
        this.portfolioFilter.displayClearButton = true;
      }
    }
    this.getinvestedLoanDetails(false);
  }

  showRepaymentNotesDialog(loanId: number): void {
    this._noteService
      .getRepaymentNotes(loanId)
      .subscribe(
        response => {
          this.portfolioModel.repaymentNotes.data = new Array<any>();
          if (response.data) {
            this.openModal('RepaymentNoteModal');
            response.data.forEach(note => {
              this.portfolioModel.repaymentNotes.data.push({
                title: new Date(note.enteredDate),
                content: note.noteText
              });
            });
          }
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  toggleRepaymentTable(repayment: any, isActive: boolean): void {
    repayment.isActualRepayment = isActive;
  }

  formatPortfolioLabel(label): string {
    return label ? label + '(' + this.currency + ')' : '';
  }

  getInvestedLoanInstallmentDetails(paginate: boolean = true) {
    if (paginate) {
      this.getinvestedLoanDetails();
      this.getInvestorPortfolioInstallment();
    }
    else {
      this.getinvestedLoanDetails(false);
      this.getInvestorPortfolioInstallment(false);
    }
  }

  openModal(id: string): void {
    this._modalService.open(id);
  }

  closeModal(id: string): void {
    this._modalService.close(id);
  }

  handleScroll(positionY) {
    if (this.stickyLegend === false) {
      this.elementPosition = this.legendElement.nativeElement.offsetTop;
    }
    if (positionY + 100 >= this.elementPosition) {
      this.stickyLegend = true;
    } else {
      this.stickyLegend = false;
    }
    this.lastScrollPosition = positionY;
  }

  showGracePeriod(loanCode) {
    if (this.countryCode === 'SG' || this.countryCode === 'MY') {
      const prefix = loanCode.split('-')[0];
      if (this.gracePeriodSetting.productPrefix.includes(prefix)) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  getGracePeriod(repaymentDate) {
    const newdate = new Date(repaymentDate);
    newdate.setDate(newdate.getDate() + this.gracePeriodSetting.dayPeriod);
    const gracePeriod = this.datePipe.transform(newdate, this.portfolioModel.dateFormat);
    const gracePeriodInfo = { date: gracePeriod, day: this.gracePeriodSetting.dayPeriod.toString() };
    return gracePeriodInfo;
  }

  convertStatusToUpperCase(status: string) {
    return status.toUpperCase().replace(' ', '-');
  }

}
