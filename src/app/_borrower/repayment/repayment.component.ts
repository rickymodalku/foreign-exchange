
import { forkJoin as observableForkJoin, Observable } from 'rxjs';
import {
  Component,
  OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { DocumentService } from '../../services/document.service';
import { FinanceService } from '../../services/finance.service';
import { LoanService } from '../../services/loan.service';
import { NotificationService } from '../../services/notification.service';
import CONFIGURATION from '../../../configurations/configuration';
import { ModalService } from 'app/services/modal.service';
import { DomSanitizer, SafeHtml, } from '@angular/platform-browser';

@Component({
  templateUrl: './repayment.html'
})
export class RepaymentComponent implements OnInit {
  countryCode: string;
  currency: string;
  dialogModel: any;
  masterData: any;
  repayments: Array<any>;
  allRepayments: Array<any>;
  loanStageName: any;
  websiteContent: SafeHtml;
  selectedDocumentId: string;
  isSigned: boolean;
  selectedLoanId: string;
  errorCode: any;
  disignStatus: any;
  disignEnable: boolean;
  hideCompletedLoans: boolean;
  sortDirection: string;

  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _documentService: DocumentService,
    private _financeService: FinanceService,
    private _loanService: LoanService,
    private _domSanitizer: DomSanitizer,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _modalService: ModalService
  ) {
    this.currency = CONFIGURATION.currency_symbol;
    this.countryCode = CONFIGURATION.country_code;
    this.dialogModel = {
      error: '',
      existing: null,
      dateFormat: CONFIGURATION.format.date,
      dateTimeFormat: CONFIGURATION.format.date_time,
      decimalFormat: CONFIGURATION.format.decimal,
      localeDecimalFormat: CONFIGURATION.format.locale,
      displayInstallments: false,
      displayLoanDetails: false,
      displayLoanOffer: false,
      statuses: null,
      success: ''
    };
    this.masterData = {
      tenorTypes: new Array<any>()
    };
    this.repayments = new Array<any>();
    this.allRepayments = new Array<any>();
    this.loanStageName = this._baseParameterService.getLoanStageName();
    this.dialogModel.statuses = this._baseParameterService.getLoanStatusesMapping();
    this.selectedDocumentId = '';
    this.isSigned = false;
    this.hideCompletedLoans = true;
    this.sortDirection = 'asc';
    this.selectedLoanId = '';
    this.errorCode = this._baseParameterService.getErrorCode();
    this.disignStatus = '';
    this.disignEnable = CONFIGURATION.digisign.loan;
  }

  ngOnInit() {
    observableForkJoin(
      this._translateService.get('master.tenor-types'),
      this._translateService.get('repayment')
    ).subscribe(baseData => {
      this.masterData.tenorTypes = baseData[0];
      this.dialogModel.error = baseData[1].error;
      this.dialogModel.success = baseData[1].success;
      this.initialize();
    });
  }

  sortFilterRepayments(): void {
    if (this.hideCompletedLoans) {
      this.repayments = this.sortByUpcomingDeadline(this.allRepayments
        .filter((loan) => loan.loan_status !== 'SET-COMPLETE'));
    } else {
      this.repayments = this.sortByUpcomingDeadline(this.allRepayments);
    }
  }
  toggleHideCompletedLoans(): void {
    this.hideCompletedLoans = !this.hideCompletedLoans;
    this.sortFilterRepayments();
  }
  initialize(): void {
    this.digisignCallBack();
    observableForkJoin(
      this._loanService.getLoans(),
      this._financeService.getBorrowerFirstIncompleteInstallments()
    ).subscribe(
      loanData => {
        this.allRepayments = loanData[0];
        const firstInstallments = loanData[1].data;
        firstInstallments.forEach((firstIntallment) => {
          const repaymentToBePadded = this.allRepayments.find((repayment) => {
            return repayment.loan_id === firstIntallment.loan_id;
          });
          repaymentToBePadded.upcomingRepayment = firstIntallment;
        });
        /* Hide Completed Loans and sort by upcoming repayments first*/
        this.sortFilterRepayments();
      },
      error => {
        this._notificationService.error();
      }
    );
  }
  sortByUpcomingDeadline(loans: any[]): any[] {
    const splitArray = loans.reduce((output, element) => {
      if (element.upcomingRepayment) {
        output[0].push(element);
      } else {
        output[1].push(element);
      }
      return output;
    }, [[], []]);
    let loansWithRepayments = splitArray[0];
    const loansWithoutRepayments = splitArray[1];
    loansWithRepayments = loansWithRepayments.sort((a, b) => {
      const dateA = new Date(a.upcomingRepayment.payment_deadline).getTime();
      const dateB = new Date(b.upcomingRepayment.payment_deadline).getTime();
      if (this.sortDirection === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    return [...loansWithRepayments, ...loansWithoutRepayments];
  }

  digisignCallBack() {
    window.removeEventListener('message', digisignCheckStatus.bind(this), false);
    window.addEventListener('message', digisignCheckStatus.bind(this), false);
    function digisignCheckStatus(name) {
      this.digisignStatus = name.data;
      if (this.digisignStatus.result) {
        this.closeModal('digitalSignaturePopUp');
      }
    }
  }

  respondLoanOffer(loanId: string, productId: string, accepted: boolean): void {
    if (this.disignEnable) {
      this._loanService.getDocumentToSign(loanId, productId)
        .subscribe(
          documentToSign => {
            this.selectedLoanId = loanId;
            if (documentToSign.data.length > 0) {
              this.websiteContent = this._domSanitizer.bypassSecurityTrustHtml(documentToSign.data[0].content);
              this.selectedDocumentId = documentToSign.data[0].document_id;
              this._modalService.open('digitalSignaturePopUp');
            } else {
              this.acceptLoan(Number(loanId), accepted);
            }
          },
          error => {
            if (this._baseParameterService.getErrorCode().digisign.accountNotRegistered === error.code) {
              this.acceptLoan(Number(loanId), accepted);
            } else {
              this._notificationService.error(error.message);
            }
          });
    } else {
      this.acceptLoan(Number(loanId), accepted);
    }
  }

  acceptLoan(loanId: number, accepted: boolean) {
    this._loanService
      .acceptLoanOffer(loanId, accepted ? this.dialogModel.statuses.accept : this.dialogModel.statuses.reject)
      .subscribe(
        response => {
          this.closeModal('LoanOfferDialog');
          this.initialize();
        },
        error => {
          this._notificationService.error();
        }
      );

  }

  showInstallments(dialogModel): void {
    this._financeService.getBorrowerRepayments(null, null, dialogModel.loan_id).subscribe(response => {
      dialogModel.installments = response.data;
      this.openModal('LoanInstalmentsDialog');
    });
  }

  hideApprovedLabel(loanStage: string) {
    if (loanStage === this.loanStageName.origination ||
      loanStage === this.loanStageName.underwriting) {
      return false;
    } else { return true; };
  }

  displayDialog(dialogName: string, data: any): void {
    this.dialogModel.existing = data;
    this.dialogModel.existing.loan_offer.sort((a, b) => {
      if (a.time_series < b.time_series) { return -1; } else if (a.time_series > b.time_series) { return 1; } else { return 0; }
    });

    this.dialogModel.existing.loan_offer = this.dialogModel.existing.loan_offer.map(function (d) {
      d.principal = parseInt(d.principal, 10);
      d.interest = parseInt(d.interest, 10);
      return d;
    });

    switch (dialogName) {
      case 'INSTALLMENTS':
        this.showInstallments(this.dialogModel.existing);
        break;
      case 'LOAN-DETAILS':
        this.openModal('LoanDetailDialog');
        break;
      case 'LOAN-OFFER':
        this.openModal('LoanOfferDialog');
        break;
    }
  }

  getTenorTypeLabel(tenorTypeKey: string): string {
    if (tenorTypeKey) {
      const tenor_type = this._baseParameterService.tenor_type_label.find(o => o.tenor_type === tenorTypeKey);
      if (tenor_type) {
        return this.masterData.tenorTypes.find(x => x.key === tenor_type.key).value;
      }
    }
  }

  downloadLoanOffer(url: string = '', loanCode: string) {
    if (url && url !== '') {
      this._documentService.download(url, loanCode + '_OfferLetter');
    } else {
      this._notificationService.error();
    }
  }

  openModal(id: string): void {
    this._modalService.open(id);
  }

  closeModal(id: string): void {
    this._modalService.close(id);
    if (id === 'digitalSignaturePopUp') {
      this._loanService.getDocumentStatus(this.selectedDocumentId)
        .subscribe(
          signedStatus => {
            this._modalService.close('LoanOfferDialog');
            this.isSigned = signedStatus.data.signed;
            const accepted = true;
            if (this.isSigned) {
              this._notificationService.success(this.dialogModel.success);
              this.acceptLoan(Number(this.selectedLoanId), accepted);
              this._notificationService.success(this.dialogModel.success);
            }
          },
          error => {
            this._notificationService.error(error);
          });
    }
    this.dialogModel.existing = null;
  }

  showRepaymentDialogButton(repayment: any) {
    if (this.countryCode === 'ID') {
      return repayment.loan_stage === this._baseParameterService.getLoanStageName().offer ||
        repayment.loan_stage === this._baseParameterService.getLoanStageName().funding ||
        repayment.loan_stage === this._baseParameterService.getLoanStageName().settlement;
    } else {
      return repayment.loan_status_mapping === this.dialogModel.statuses.offer;
    }
  }
}
