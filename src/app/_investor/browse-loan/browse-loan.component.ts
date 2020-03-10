
import { combineLatest as observableCombineLatest, forkJoin as observableForkJoin, Observable } from 'rxjs';

import { take, map } from 'rxjs/operators';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { DocumentService } from '../../services/document.service';
import { FinanceService } from '../../services/finance.service';
import { MemberService } from '../../services/member.service';
import { LoanService } from '../../services/loan.service';
import { NotificationService } from '../../services/notification.service';
import { MathUtilitiesService } from '../../services/math-utilities.service';
import { UtilityService } from '../../services/utility.service';
import { ValidatorService } from '../../services/validator.service';
import CONFIGURATION from '../../../configurations/configuration';
import { ModalService } from '../../services/modal.service';
import { DomSanitizer, SafeHtml, } from '@angular/platform-browser';

interface LoanType {
  active: boolean;
  identifier: number;
  label: string;
  sort: number;
  fundedLoanCount: number;
}

@Component({
  selector: 'app-browse-loan',
  templateUrl: './browse-loan.html'
})

export class BrowseLoanComponent implements OnInit {
  accountActivated: Boolean;
  browseLoanModel: any;
  blogUrl: string;
  countryCode: string;
  currency: string;
  currentLoanType: number;
  investorExposureBannerCaption: string;
  investorExposureLimit: any;
  showInvestorExposureBanner: Boolean;
  investorExposure: number;
  investmentForm: FormGroup;
  mobileFilterLoanStatus: string;
  fundedLoanString: string;
  fundingLoanExist: boolean;
  preCFLoanExist: boolean;
  loanTypes: Array<any>;
  masterData: any;
  memberCrowdfundingSettings: Array<any>;
  showOptOutOption: boolean;
  showInvestorBanner: Boolean;
  optOutLoan: any;
  ALL_LOAN_IDENTIFIER; number;
  learnMoreAALink: string;
  isLoading: boolean;
  satChecked: boolean;
  loanIdList: any;
  errorOptOut: string;
  powerOfAttorneyContent: SafeHtml;
  totalAllLoans: number;
  displayedLoan: any;
  loanStatus: string;
  activeLoan: any;
  satCheckbox: any;
  rdsCheckbox: any;
  investmentValidationMessage: any;
  loanCardCaptionType: any;
  loanStatusFilter: any;
  errorReverification: string;
  powerOfAttorney: any;
  elementPosition: any;
  productGroupId: any;
  isExposureWarningExpanded: boolean;
  showFirstWarningMessage: boolean;
  showSecondWarningMessage: boolean;

  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _documentService: DocumentService,
    private _financeService: FinanceService,
    private _formBuilder: FormBuilder,
    private _loanService: LoanService,
    private _mathUtilitiesService: MathUtilitiesService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _utilityService: UtilityService,
    private _validatorService: ValidatorService,
    private _modalService: ModalService,
    private _domSanitizer: DomSanitizer
  ) {
    this.isLoading = true;
    this.ALL_LOAN_IDENTIFIER = 0;
    this.browseLoanModel = {
      balance: 0,
      data: new Array<any>(),
      dateFormat: CONFIGURATION.format.date_time,
      decimalFormat: CONFIGURATION.format.decimal,
      localeDecimalFormat: CONFIGURATION.format.locale,
      displayedData: new Array<any>(),
      displayedData3Column: new Array<any>(),
      displayedData2Column: new Array<any>(),
      errors: null,
      histories: new Array<any>(),
      investedLoanCode: '',
      page: 1,
      recordsPerPage: 100,
      selectedLoan: null,
      validation: false
    };

    this.learnMoreAALink = CONFIGURATION.learnMoreAALink;

    this.optOutLoan = null;
    this.errorOptOut = '';

    this.countryCode = CONFIGURATION.country_code;
    this.satChecked = this.countryCode === 'SG' ? true : false;
    this.showInvestorExposureBanner = CONFIGURATION.showInvestorExposureBanner;
    this.investorExposureLimit = CONFIGURATION.investorExposure;
    this.currency = CONFIGURATION.currency_symbol;
    this.fundedLoanString = '';
    this.investmentForm = this._formBuilder.group({
      amount: new FormControl(null, [Validators.required, this._validatorService.validatePositiveDecimal])
    });
    this.loanTypes = new Array<LoanType>();
    this.mobileFilterLoanStatus = '';
    this.investorExposureBannerCaption = '';
    this.investorExposure = 0;
    this.showOptOutOption = CONFIGURATION.browseLoan.showOptOut;
    this.masterData = {
      loanStatuses: new Array<any>(),
      months: new Array<any>(),
      tenorTypes: new Array<any>()
    };
    this.memberCrowdfundingSettings = new Array<any>();
    this.loanIdList = new Array<any>();
    this.showInvestorBanner = false;
    this.accountActivated = this._authService.getActivationStepCode() === CONFIGURATION.activation_step_code.activated;
    this.fundingLoanExist = true;
    this.preCFLoanExist = true;
    this.powerOfAttorneyContent = '';
    this.totalAllLoans = 0;
    this.displayedLoan = [];
    this.satCheckbox = true;
    this.investmentValidationMessage = {
      show: false,
      content: ''
    };
    this.satCheckbox = {
      checked: true,
      show: CONFIGURATION.browseLoan.suitabilityAssessmentTest
    };
    this.rdsCheckbox = {
      checked: true,
      show: CONFIGURATION.browseLoan.riskDisclosureStatement
    }
    this.powerOfAttorney = {
      checked: true,
      show: CONFIGURATION.browseLoan.powerOfAttorney
    };
    this.loanCardCaptionType = {
      DEFAULT: 'default',   // Display how much investor already invest in related loan
      PRECF: 'pre-cf',      // Display CF time
      DEPOSIT: 'deposit'    // Tell investor to make deposit
    };
    this.loanStatusFilter = this._baseParameterService.funding_status;
    this.errorReverification = '';
    this.blogUrl = CONFIGURATION.browseLoan.blog;
    this.productGroupId = this._baseParameterService.getProductGroupId();
    this.isExposureWarningExpanded = true;
    this.showFirstWarningMessage = false;
    this.showSecondWarningMessage = false;
  }

  ngOnInit() {
    window['Intercom']('trackEvent', 'Web_Viewed_Browse_Loans');
    this.getinvestorExposure();
    this._loanService
      .getLoanTypes()
      .subscribe(
        response => {
          observableForkJoin(
            this._translateService.get('browse-loan.header.all-loans'),
            this._translateService.get('master')
          ).subscribe(data => {
            const label = data[0];
            const masterData = data[1];
            this.setUpMasterDataForLoans(masterData);
            this.loanTypes = this.setUpLoanTypes(response.data);
            this.loanTypes.push({
              active: true,
              identifier: this.ALL_LOAN_IDENTIFIER,
              label: label,
              fundedLoanCount: 0,
              sort: 0
            });
            this._utilityService.sortByKey(this.loanTypes, 'alphabet', 'sort');
            // Displaying the loan list with the first loan type in loanTypes
            this.initializeLoanCountsAndSetLoanList(this.loanTypes);
          });
        },
        error => {
          this._notificationService.error();
        }
      );
    this.getUserBalance();
    this.getTranslation();
  }

  goToAALearnMore() {
    window.open(this.learnMoreAALink, '_blank');
  }

  getinvestorExposure() {
    const accreditedInvestorId = this._baseParameterService.getMemberEntityTypeId().premierInvestor;
    const accreditedInvestorFlag = this._authService.getMemberEntityTypeId() === accreditedInvestorId;
    if (this.showInvestorExposureBanner) {
      this._financeService
        .getInvestorOverview()
        .subscribe(
          response => {
            this.investorExposure = response.value.investor_exposure;
            this.showFirstWarningMessage = this.investorExposure > this.investorExposureLimit.investorExposureFirstWarningLimit;
            this.showSecondWarningMessage = this.investorExposure > this.investorExposureLimit.investorExposureSecondWarningLimit;
            if (this.showFirstWarningMessage && !accreditedInvestorFlag) {
              this.showInvestorBanner = true;
              const self = this;
              if (!this.showSecondWarningMessage) {
                setTimeout(function () {
                  self.showInvestorBanner = false;
                }, 15000);
              }
            }

            this._translateService
              .get('browse-loan.investor-exposure.label')
              .subscribe(
                label => {
                  const investorExposureFirstWarningLimit = this.investorExposureLimit.investorExposureFirstWarningLimit;
                  const investorExposureSecondWarningLimit = this.investorExposureLimit.investorExposureSecondWarningLimit;
                  if (this.investorExposure > investorExposureFirstWarningLimit && this.investorExposure < investorExposureSecondWarningLimit) {
                    this.investorExposureBannerCaption = label[0].value;
                  } else if (this.investorExposure === investorExposureSecondWarningLimit) {
                    this.investorExposureBannerCaption = label[1].value;
                  } else if (this.investorExposure > investorExposureSecondWarningLimit) {
                    this.investorExposureBannerCaption = label[2].value;
                  }
                });

          });
    }
  }

  getSimulateLoanAmount(simulateLoanAmount: string, interestRate: number, tenorLength: number, tenorType: number, loanId: string) {
    const loanAmount = this._validatorService.removeDelimiter(simulateLoanAmount);
    let interest = 0;
    if (tenorType && this._baseParameterService.getLoanSimulationParameters()) {
      const divider = this._baseParameterService.getLoanSimulationParameters().tenorLengthDividerByTenorType[tenorType];
      interest = this._mathUtilitiesService.floor(Number(loanAmount) * (interestRate / 100 / divider) * tenorLength, 0);
      this.displayedLoan.find(x => x.loan_id === loanId).simulate_loan_amount_result = this._validatorService.addDelimiter(String(interest), true);
    }
  }

  getLoanExposure(): void {
    if (this.displayedLoan.length > 0) {
      this.browseLoanModel.displayedData = this.browseLoanModel.data.filter(loan => {
        loan.fundingProgress = parseFloat(loan.fundingProgress).toFixed(2);
      });
      this.loanIdList = [];
      this.displayedLoan.forEach((element: { loan_id: any; }) => {
        this.loanIdList.push(element.loan_id);
      });
      this._financeService
        .getLoanExposure(this.loanIdList)
        .subscribe(loanExposures => {
          const loanExposuresData = loanExposures.data;
          this.displayedLoan.forEach(element => {
            const matchedLoanExposuresData = loanExposuresData.find((x: any) => x.loan_id === element.loan_id);
            element.simulate_loan = false;
            element.simulate_loan_amount = '';
            element.simulate_loan_amount_result = '';
            element.loan_card_caption_type = this.getLoanCardCaption(element.loan_id, element.loan_status, element.min_invest);
            if (matchedLoanExposuresData) {
              element.history_number_of_investment = matchedLoanExposuresData.total_number_of_investment;
              element.history_total_investment_amount = matchedLoanExposuresData.total_investment_amount;
              element.loan_number_with_exposure = matchedLoanExposuresData.loan_number_with_exposure;
              element.exposure = matchedLoanExposuresData.exposure;
            }
          });
        },
          error => {
            this._notificationService.error();
          }
        );

      this.fundingLoanExist = this.browseLoanModel.displayedData.find(loan => loan.loan_status === this.loanStatusFilter.FUNDING);
      this.preCFLoanExist = this.browseLoanModel.displayedData.find(loan => loan.loan_status === this.loanStatusFilter.PRECF);
    }
  }

  changeLoanType(loanTypeId: number, updateBalance = false): void {
    this.loanTypes.forEach(loanType => {
      loanType.active = loanType.identifier === loanTypeId;
    });
    this.activeLoan = this.loanTypes.find(x => x.active === true);
    if (this.activeLoan.identifier === this.ALL_LOAN_IDENTIFIER) {
      this.displayedLoan = [];
      this.initializeLoanCountsAndSetLoanList(this.loanTypes);
    } else {
      this.getLoans(loanTypeId);
    }
    this.currentLoanType = loanTypeId;
    if (updateBalance) {
      this.getUserBalance();
    }
  }

  getLoans(loanTypeId: number): void {
    this._financeService
      .getLoans(
        loanTypeId,
        this.browseLoanModel.page,
        this.browseLoanModel.recordsPerPage
      )
      .subscribe(
        response => {
          // Set default loan list and funding status
          this.setLoanList(response);
          this.displayedLoan = response.value.data;
          this.getLoanExposure();
        },
        error => {
          this._notificationService.error();
        }
      );

    if (this.countryCode === 'SG') {
      this._translateService
        .get('investor-dashboard.reverification.error.investing')
        .subscribe(
          errorReverification => {
            this.errorReverification = errorReverification;
          }
        );
    }
  }

  setLoanCountByType(loanTypes: Array<LoanType>, loanType: number, loanCount: number): void {
    loanTypes.find(x => x.identifier === loanType).fundedLoanCount = loanCount;
  }

  initializeLoanCountsAndSetLoanList(loanTypes): void {
    this.displayedLoan = [];
    this.totalAllLoans = 0;
    const loanTypeObservables = loanTypes.map(loanType => {
      if (loanType.active) { this.currentLoanType = loanType.identifier; }
      this.getAutoInvestmentList();
      return this._financeService.getLoans(
        loanType.identifier,
        this.browseLoanModel.page,
        this.browseLoanModel.recordsPerPage
      ).pipe(map(loanTypesResponse => {
        this.displayedLoan.push.apply(this.displayedLoan, loanTypesResponse.value.data);
        this.setLoanCountByType(
          this.loanTypes,
          loanType.identifier,
          this.getLoanCountByStatus(loanTypesResponse.value.data));
        this.totalAllLoans = this.totalAllLoans + this.getLoanCountByStatus(loanTypesResponse.value.data);
        this.loanTypes.find(x => x.identifier === this.ALL_LOAN_IDENTIFIER).fundedLoanCount = this.totalAllLoans;
        this.activeLoan = this.loanTypes.find(x => x.active === true);
        return loanTypesResponse;
      }), take(1));
    });


    this.displayedLoan.sort((a, b) => (a.loan_status > b.loan_status) ? 1 : -1);
    observableCombineLatest(...loanTypeObservables).subscribe(
      (loans) => {
        this.getLoanExposure();
        this.setLoanList(loans[0]);
      },
      error => {
        this._notificationService.error();
      }
    );
  }

  getLoanCountByStatus(loans): number {
    const loanCount = loans
      .filter(loan => {
        return (
          loan.loan_status === this.loanStatusFilter.FUNDING ||
          loan.loan_status === this.loanStatusFilter.PRECF
        );
      }).length;
    return loanCount;
  }

  openInvestmentDialog(loan: any) {
    this.browseLoanModel.selectedLoan = loan;
    this.investmentValidationMessage.show = false;
    this.openModal('investmentConfirm');
  }

  checkFactSheetDownloadable(loanfactsheetLink: string, showFactSheet: boolean) {
    if (showFactSheet && Boolean(loanfactsheetLink)) {
      return true;
    }
  }

  download(url: string, filename: string = 'file'): void {
    this._documentService.download(url, filename);
  }

  setUpLoanTypes(loanTypes): Array<LoanType> {
    return loanTypes.map(loanType => {
      return {
        active: false,
        identifier: loanType.type_id,
        label: loanType.type_name,
        sort: loanType.sort,
        id: loanType.type_id,
        fundedLoanCount: 0
      };
    });
  }

  setLoanList(response): void {
    if (response && response.value && response.value.data && response.value.data.length > 0) {
      this.browseLoanModel.data = response.value.data;
    } else {
      this.browseLoanModel.data = [];
    }
    if (response && response.value.extradata && response.value.extradata.history && response.value.extradata.history.length > 0) {
      this.browseLoanModel.histories = response.value.extradata.history;
    } else {
      this.browseLoanModel.histories = [];
    }
  }

  filterLoan(data: any, loanStatus: string) {
    if (data) {
      return data.filter(o => o.loan_status === loanStatus);
    }
  }

  getfilterLoanLength(data: any, loanStatus: string) {
    if (data) {
      return data.filter(o => o.loan_status === loanStatus).length;
    }
  }

  getLoanCardCaption(loanId: string, loanStatus: string, minInvest: string) {
    let loanCardCaptionType = this.loanCardCaptionType.DEFAULT;
    if (loanStatus === this.loanStatusFilter.PRECF) {
      loanCardCaptionType = this.loanCardCaptionType.PRECF;
    } else {
      if (this.browseLoanModel.balance < minInvest) {
        loanCardCaptionType = this.loanCardCaptionType.DEPOSIT;
      }
    }
    return loanCardCaptionType;
  }


  getAutoInvestmentList() {
    this._memberService.getAutoInvestmentSetting3().subscribe(
      response => {
        this.memberCrowdfundingSettings = response.data;
      },
      error => {
        this._notificationService.error(error);
      }
    );
  }

  getTenorTypeLabel(tenorType: string) {
    const tenor = this.masterData.tenorTypes.find(x => x.type === tenorType).value;
    return tenor.charAt(0).toUpperCase() + tenor.slice(1);
  }

  getLoanName(id: string) {
    return this.loanTypes.find(x => x.id === id).label;
  }

  setUpMasterDataForLoans(masterData): void {
    Object.keys(masterData['browse-loan-filter-statuses']).forEach(key => {
      this.masterData.loanStatuses.push({
        active: masterData['browse-loan-filter-statuses'][key].key === 'ACTIVE',
        label: masterData['browse-loan-filter-statuses'][key].label,
        status: masterData['browse-loan-filter-statuses'][key].key,
      });
    });
    this.mobileFilterLoanStatus = this.masterData.loanStatuses[0].label;
    this.masterData.months = masterData['months'];
    this.masterData.tenorTypes = masterData['tenor-types'];
  }

  getUserBalance() {
    this._financeService
      .getBalance()
      .subscribe(
        balance => {
          this.browseLoanModel.balance = balance.value;
        },
        error => {
          console.error('ERROR', error);
        }
      );
  }

  getTranslation() {
    this._translateService
      .get('browse-loan.investment-confirm.error')
      .subscribe(
        errors => {
          this.browseLoanModel.errors = errors;
        }
      );
    this._translateService
      .get('browse-loan.error-opt-out-cf')
      .subscribe(
        errorOptOut => {
          this.errorOptOut = errorOptOut;
        }
      );
  }

  errorBalance() {
    this._translateService
      .get('browse-loan.error-get-balance')
      .subscribe(
        balanceError => {
          this._notificationService.error(balanceError);
        }
      );
  }

  autoFormatAmount(amount: string, id: string): void {
    this.displayedLoan.find(x => x.loan_id === id).simulate_loan_amount = this._validatorService.addDelimiter(amount, true);
  }

  openModal(modal: string) {
    this._modalService.open(modal);
  }

  closeModal(modal: string) {
    this._modalService.close(modal);
  }

  confirmInvestment(): void {
    this.investmentValidationMessage.show = false;
    this.browseLoanModel.validation = true;
    const investmentAmount = parseFloat(this._validatorService.removeDelimiter(this.investmentForm.value.amount));

    if (!this.satCheckbox.checked && this.satCheckbox.show) {
      return;
    }

    if (!this.powerOfAttorney.checked && this.powerOfAttorney.show) {
      return;
    }

    if (!this.rdsCheckbox.checked && this.rdsCheckbox.show) {
      return;
    }

    if (Number(this._validatorService.removeDelimiter(this.browseLoanModel.balance)) < investmentAmount) {
      this.investmentValidationMessage.show = true;
      this.investmentValidationMessage.message = this.browseLoanModel.errors['insufficient-balance'];
      // First investment && incremental investment
    } else if (investmentAmount < this.browseLoanModel.selectedLoan.min_invest && this.browseLoanModel.selectedLoan.past_invested + investmentAmount < this.browseLoanModel.selectedLoan.min_invest) {
      this.investmentValidationMessage.show = true;
      this.investmentValidationMessage.message = this.browseLoanModel.errors['minimum-investment'] + ' ' + this.currency + this._utilityService.formatDecimal(this.browseLoanModel.selectedLoan.min_invest);
    } else if (this.browseLoanModel.selectedLoan.past_invested + investmentAmount > this.browseLoanModel.selectedLoan.max_invest) {
      this.investmentValidationMessage.show = true;
      this.investmentValidationMessage.message = this.browseLoanModel.errors['maximum-investment'] + ' ' + this.currency + this._utilityService.formatDecimal(this.browseLoanModel.selectedLoan.max_invest);
    } else if (investmentAmount > this.browseLoanModel.selectedLoan.amountLeft) {
      this.investmentValidationMessage.show = true;
      this.investmentValidationMessage.message = this.browseLoanModel.errors['investment-amount-left'] + ' ' + this.currency + this._utilityService.formatDecimal(this.browseLoanModel.selectedLoan.amountLeft);
    } else if (investmentAmount % this.browseLoanModel.selectedLoan.multiple_investment !== 0) {
      this.investmentValidationMessage.show = true;
      this.investmentValidationMessage.message = this.browseLoanModel.errors['multiplication'] + ' ' + this.currency + this._utilityService.formatDecimal(this.browseLoanModel.selectedLoan.multiple_investment);
    } else if (!this.investmentForm.valid) {
      return;
    } else {
      const investmentModel = new Array<any>();
      investmentModel.push({
        fundingid: this.browseLoanModel.selectedLoan.fundingid,
        amount: investmentAmount,
        country_id: CONFIGURATION.country_code,
        sat_disclaimer_checked: true,
      });
      if (this.powerOfAttorney.show) {
        Object.assign(investmentModel[0], { poa_accepted_at: new Date().getTime() / 1000 });
      };
      this._financeService
        .invest(investmentModel)
        .subscribe(
          response => {
            this.closeModal('investmentConfirm');
            this.investmentForm.reset();
            this.browseLoanModel.investedLoanCode = this.browseLoanModel.selectedLoan.loan_code;
            this.browseLoanModel.selectedLoan = null;
            this.changeLoanType(this.currentLoanType, true);
            if (response.status) {
              this.openModal('investSuccessDialog');
              setTimeout(() => {
                this._financeService.triggerBalanceRetrieval();
              }, 2000);
            } else {
              if (response.error.message = 'member is not activated' && this.countryCode === 'SG') {
                this._notificationService.error(this.errorReverification);
              } else {
                this._notificationService.error();
              }
            }
          },
          error => {
            this.closeModal('investmentConfirm');
            this._notificationService.error(error.message, 0);
            this.investmentForm.reset();
            this.getLoans(this.browseLoanModel.selectedLoan.loan_type);
            this.browseLoanModel.investedLoanCode = this.browseLoanModel.selectedLoan.loan_code;
            this.browseLoanModel.selectedLoan = null;
          }
        );
    }
  }

  optOutAutoInvestment(event, loan) {
    event.preventDefault();
    this.openModal('optOutDialog');
    this.optOutLoan = loan;
  }

  confirmOptOut() {
    this._financeService.optOutAutoInvestment(this.optOutLoan.loan_id)
      .subscribe(response => {
        if (response.error) {
          this._notificationService.error(this.errorOptOut);
          this.closeModal('optOutDialog');
        } else {
          this._notificationService.success(`You have succesfully opted out of the loan ${this.optOutLoan.loan_code}`);
          this.closeModal('optOutDialog');
          // Temperorarily set the state as the backend is not returning the full object
          // A better way is to refetch the resources
          this.optOutLoan.can_opt_out = false;
        }
        const loanType = this.optOutLoan.loan_type;
        this.optOutLoan = null;
        setTimeout(() => {
          this.getLoans(loanType);
        }, 1000);
        setTimeout(() => {
          this._financeService.triggerBalanceRetrieval();
        }, 2000);
      },
        error => {
          this._notificationService.error();
          this.closeModal('optOutDialog');
          this.optOutLoan = null;
        });
  }

  autoFormatInvestmentAmount(): void {
    this.investmentForm.patchValue({
      amount: this._validatorService.addDelimiter(this.investmentForm.value.amount, false)
    });
  }

  onPowerOfAttorneyDisplay(loanId: string) {
    this._loanService.getPowerOfAttorneyDocument(loanId)
      .subscribe(
        response => {
          this.powerOfAttorneyContent = this._domSanitizer.bypassSecurityTrustHtml(response._body);
          this._modalService.open('powerOfAttorneyModal');
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  isExistAutoInvestment(data: any): boolean {
    const isExist = false;
    for (const memberCrowdfundingSettings of this.memberCrowdfundingSettings) {
      if (Number(memberCrowdfundingSettings.loanTypeId) === data.loan_type) {
        return true;
      }
    }
    return isExist;
  }

}
