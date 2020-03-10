import {
  Component,
  OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { FinanceService } from '../../services/finance.service';
import { NotificationService } from '../../services/notification.service';
import { MemberDetail } from '../../models/member.class';
import CONFIGURATION from '../../../configurations/configuration';
import { pick } from 'lodash';
import { ModalService } from 'app/services/modal.service';
import { saveAs } from "file-saver";

@Component({
  selector: 'statement-list',
  templateUrl: './statement-list.html'
})
export class StatementListComponent implements OnInit {
  dialogModel: any;
  displayStatementLoadMore: boolean;
  dateFormat: string;
  numberOfStatement: number;
  endDate: Date;
  errorMessage: any;
  startDate: Date;
  fieldValidation: boolean;
  statementDates: Array<object>;
  periodStatementSelectedFlag: boolean;
  decimalFormat: string;
  localeDecimalFormat: string;
  // TEMPORARY CODE FOR OJK NEEDED
  countryCode: string;
  depositWord: string;
  // TEMPORARY CODE FOR OJK NEEDED
  statementFirstYear: number;
  yearlyStatement: any;
  currentYear: string;
  public constructor(
    private _memberService: MemberService,
    private _authService: AuthService,
    private _financeService: FinanceService,
    private _notificationService: NotificationService,
    private _modalService: ModalService,
    private _translateService: TranslateService,
    private datePipe: DatePipe,
  ) {
    this.fieldValidation = true;
    this.statementDates = [];
    this.dateFormat = 'yyyy-MM-dd';
    this.dialogModel = {
      statementDetails: [1],
      currency: CONFIGURATION.currency_symbol,
      statementStartDate: new Date(),
      statementEndDate: new Date(),
      firstName: '',
      address: '',
      cityName: '',
      stateName: '',
      zipCode: '',
      countryName: '',
      headerLogoClassNamePrefix: CONFIGURATION.header_logo_classname_prefix
    };
    this.errorMessage = {
      emptyValidation: '',
      dateValidation: ''
    };
    this.displayStatementLoadMore = true;
    this.numberOfStatement = 0;
    this.periodStatementSelectedFlag = false;
    this.decimalFormat = CONFIGURATION.format.decimal;
    this.localeDecimalFormat = CONFIGURATION.format.locale;
    // TEMPORARY CODE FOR OJK NEEDED
    this.countryCode = CONFIGURATION.country_code;
    this.depositWord = '';
    // TEMPORARY CODE FOR OJK NEEDED
    this.statementFirstYear = 2016;
    this.yearlyStatement = [];
  }

  ngOnInit() {
    this.currentYear = String(new Date().getFullYear());
    this._translateService
      .get('statement')
      .subscribe(
        response => {
          this.errorMessage.emptyValidation = response['statement-filter-validation-1'];
          this.errorMessage.dateValidation = response['statement-filter-validation-2'];
        }
      );

    this._translateService
      .get('activity')
      .subscribe(
        response => {
          this.depositWord = response.deposit;
        }
      );

    this.getStatements().then((value) => {
      for (let i = 0; i < value.length; i++) {
        this.statementDates.push({
          value: value[i],
          show: i < 6
        })
      }
      this.numberOfStatement = this.statementDates.length;
    });
    this.getYearlyStatementYear();
  }

  getYearlyStatementYear() {
    let currentYear = new Date().getFullYear();
    while (currentYear >= this.statementFirstYear) {
      this.yearlyStatement.push(currentYear);
      currentYear--;
    }
  }

  getYearlyStatement(selectedYear:number) {
    const dateFormat = 'yyyy-MM-dd';
    const fromDate = new Date(Number(selectedYear), 0, 1);
    const toDate = new Date(Number(selectedYear), 11, 31);
    const formattedFromDate = this.datePipe.transform(fromDate, dateFormat);
    const formattedToDate = this.datePipe.transform(toDate, dateFormat);
    const isMonthly = false;
    this._financeService.getPDFStatement(
      this.datePipe.transform(fromDate, dateFormat),
      this.datePipe.transform(toDate, dateFormat),
      isMonthly).subscribe(
        response => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const filename = `${this._authService.getUserName()}_${formattedFromDate}_${formattedToDate}_Statement.pdf`;
          saveAs(blob, filename);
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  getStatements(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._financeService.getStatements().subscribe(
        response => {
          resolve(response.value);
        }
      );
    });
  }

  displayAllStatement() {
    this.statementDates.forEach((element) => {
      element['show'] = true;
    });
    this.displayStatementLoadMore = false;
  }

  displayOlderStatement() {
    let index = this.statementDates.slice().reverse().findIndex(x => x['show'] === true);
    let count = this.statementDates.length - 1;
    let finalIndex = count - index;
    for (let i = finalIndex + 1; i <= (finalIndex + 5); i++) {
      if (i < this.numberOfStatement) {
        this.statementDates[i]['show'] = true;
      } else {
        this.displayStatementLoadMore = false;
      }
    }
  }

  generatePeriodStatement() {
    this.fieldValidation = true;
    if (!this.startDate || !this.endDate) {
      this.fieldValidation = false;
      this._notificationService.error(this.errorMessage.emptyValidation);
    } else if (this.startDate > this.endDate) {
      this.fieldValidation = false;
      this._notificationService.error(this.errorMessage.dateValidation);
    }
    if (this.fieldValidation) {
      this.viewStatement(String(this.startDate), String(this.endDate));
    }
  }

  printStatement(startDate: string, endDate: string = ''): void {
    let fromDate;
    let formattedFromDate;
    let toDate;
    let formattedToDate;
    let isMonthly;
    const startPeriodDate = new Date(startDate);
    const endPeriodDate = new Date(endDate);
    const dateFormat = 'yyyy-MM-dd';
    if (endDate === '') {
      fromDate = new Date(startPeriodDate.getFullYear(), startPeriodDate.getMonth(), 1);
      formattedFromDate = this.datePipe.transform(fromDate, dateFormat);
      toDate = new Date(startPeriodDate.getFullYear(), startPeriodDate.getMonth() + 1, 0);
      formattedToDate = this.datePipe.transform(toDate, dateFormat);
      isMonthly = true;
    } else {
      fromDate = startPeriodDate;
      formattedFromDate = this.datePipe.transform(fromDate, dateFormat);
      toDate = endPeriodDate;
      formattedToDate = this.datePipe.transform(toDate, dateFormat);
      isMonthly = false;
    }
    this._financeService.getPDFStatement(
      this.datePipe.transform(fromDate, dateFormat),
      this.datePipe.transform(toDate, dateFormat),
      isMonthly).subscribe(
        response => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const filename = `${this._authService.getUserName()}_${formattedFromDate}_${formattedToDate}_Statement.pdf`;
          saveAs(blob, filename);
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  getWalletByMonth(month: number, year: number): any {
    return new Promise((resolve, reject) => {
      this._financeService.getWalletByMonth(
        1, 100000, '', '', month, year
      ).subscribe(
        response => {
          resolve(response);
        },
      );
    });
  }

  getWalletByPeriod(): any {
    return new Promise((resolve, reject) => {
      this._financeService.getWalletByPeriod(
        1, 100000, '', '',
        this.datePipe.transform(this.startDate, this.dateFormat),
        this.datePipe.transform(this.endDate, this.dateFormat)
      ).subscribe(
        response => {
          resolve(response);
        },
      );
    });
  }

  getMemberDetail(): Promise<MemberDetail> {
    return new Promise((resolve, reject) => {
      this._memberService.getMemberDetail()
        .subscribe(
          response => {
            resolve(response)
          });
    });
  }

  viewStatement(startDate: string, endDate: string = ''): void {
    this.periodStatementSelectedFlag = false;
    this.periodStatementSelectedFlag = endDate ? true : false;
    const statementDate = new Date(startDate);
    const dialogHeader = `Monthly Statement - ${this.datePipe.transform(statementDate, 'MMMM yyyy')}`;
    const month = statementDate.getMonth() + 1;
    const year = statementDate.getFullYear();
    const statementEndDate = new Date(year, month, 0);
    const statementData = Promise.all([
      endDate ? this.getWalletByPeriod() : this.getWalletByMonth(month, year),
      this.getMemberDetail()])
      .then(values => {
        this.dialogModel = Object.assign(
          this.dialogModel,
          pick(values[0].value.data, ['list', 'summary']),
          values[1],
          {
            statementStartDate: statementDate,
            statementEndDate: statementEndDate,
            dialogHeader: dialogHeader
          }
        );
        this._memberService.getLookUpMasterData()
          .subscribe(response => {
            if (response.data.countries.length > 0 && this.dialogModel.residentialCountryId) {
              this.dialogModel.countryName = response.data.countries
                .find(country => country.code === this.dialogModel.residentialCountryId).name;
            }

            if (response.data.states.length > 0 && this.dialogModel.stateId) {
              this.dialogModel.stateName = response.data.states
                .find(state => state.id === this.dialogModel.stateId).name;
            }
            this.openModal('StatementModal');
          });
      }).catch(error => {
        this._notificationService.error();
      });
  }

  openModal(id: string): void {
    this._modalService.open(id);
  }

  closeModal(id: string): void {
    this._modalService.close(id);
  }
}
