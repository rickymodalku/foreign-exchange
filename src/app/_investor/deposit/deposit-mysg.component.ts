import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn
} from '@angular/forms';
import { forkJoin } from 'rxjs';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { EventService } from '../../services/event.service';
import { TranslateService } from '@ngx-translate/core';
import { DepositSetting, MemberBankAccount } from '../../models/member.class';
import { ActivityService } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { FinanceService } from '../../services/finance.service';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import { ValidatorService } from '../../services/validator.service';
import { DepositService } from '../../services/deposit.service';
import { ModalService } from '../../services/modal.service';
import { FormService } from '../../services/form.service';
import { UtilityService } from '../../services/utility.service';
import CONFIGURATION from '../../../configurations/configuration';
import { capitalize } from 'lodash';
import { FeatureFlagService } from '../../services/feature-flag.service';
import { Observable } from 'rxjs';

interface DepositOption {
  key: string;
  label: string;
  selected: boolean;
  logo: string;
  countrySupport: string;
  default: boolean;
}

interface BankDetail {
  bankName: string;
  bankImageUrl: string;
  bankUrl: string;
  isDefault: boolean;
  bankAccountNumber: string;
}
interface FpxBankDetail {
  bank_code: string;
  bank_name: string;
  create_time: string;
  id: number;
  status: string;
  supported: boolean;
  update_time: string;
}

@Component({
  selector: 'deposit-mysg',
  templateUrl: './deposit-mysg.html'
})
export class DepositMYSGComponent implements AfterViewInit, OnInit {
  activationStepCode: Array<any>;
  bankDetailsHeader: string;
  countryCurrencyCode: string;
  depositForm: FormGroup;
  fpxForm: FormGroup;
  depositHeader: string;
  depositSetting: DepositSetting;
  document: any;
  errorMessage: any;
  formModel: any;
  masterData: any;
  selectedName: string;
  selectedbankName: string;
  buttonReturnText: any;
  userDetail: any;
  showAddBankAccount: boolean;
  depositOption: string;
  depositOptions: Array<DepositOption>;
  fpxBenefits: Array<any>;
  supportedBankList: Array<FpxBankDetail>;
  minimumAmountLabel: string;
  fpxBankName: string;
  fpxMinimumAmountLabel: string;
  fpxMaximumAmountLabel: string;
  fpxDialog: string;
  featureToggle: object;
  firstDepositMinimumAmountLabel: string;
  firstDepositMinimum: string;
  countryCode: string;
  featureFlagObservable: Observable<any>;
  isActivated: boolean;

  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _financeService: FinanceService,
    private _formBuilder: FormBuilder,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _router: Router,
    private _translateService: TranslateService,
    private _validatorService: ValidatorService,
    private _depositService: DepositService,
    private _modalService: ModalService,
    private _formService: FormService,
    private _utilityService: UtilityService,
    private _activatedRoute: ActivatedRoute,
    private featureFlagService: FeatureFlagService,
    private _eventService: EventService
  ) {
    this.countryCode = CONFIGURATION.country_code;
    const allSupportedDepositOptions = [
      {
        key: 'fpx',
        label: 'Online Deposit',
        selected: true,
        logo: 'fpx-logo',
        countrySupport: 'MY',
        default: true
      },
      {
        key: 'manual',
        label: 'Manual Deposit',
        selected: false,
        logo: 'wallet-balance-logo',
        countrySupport: 'all',
        default: false
      }
    ];
    this.depositOptions = this.getSupportedDepositOptions(allSupportedDepositOptions, CONFIGURATION.country_code);
    // Feature toggle just in case


    const { fpx } = this.featureFlagService.getFeatureFlagKeys();
    this.featureFlagObservable = this.featureFlagService.getFeatureFlagObservable();
    this.featureFlagObservable.subscribe((flags) => {
      if (flags[fpx]) {
        this.depositOption = this.getDefaultDepositOption(this.depositOptions).key;
      } else {
        const optionKey = 'manual';
        this.depositOptions = this.depositOptions.filter(option => option.key === optionKey);
        this.depositOption = optionKey;
      }
    });

    this.activationStepCode = CONFIGURATION.activation_step_code;
    this.buttonReturnText = {
      accountActivation: '',
      activity: ''
    };

    this.bankDetailsHeader = 'Transfer Details';
    this.countryCurrencyCode = CONFIGURATION.currency_code;
    this.selectedName = '';

    this.userDetail = {
      fullName: '',
      bankDetail: new Array<BankDetail>(),
      uniqueId: '',
    };

    this.document = {
      message: '',
      caption: '',
      button: '',
      visible1: '',
      visible2: '',
      visible3: ''
    };

    this.errorMessage = {
      depositEmpty: '',
      transferTypeEmpty: '',
      minimumDeposit: ''
    };

    this.depositForm = this._formBuilder.group({
      amount: new FormControl(null),
      bank: new FormControl(null, [Validators.required]),
      accountName: new FormControl(null, [Validators.required]),
      accountNumber: new FormControl(null, [Validators.required]),
      transferType: new FormControl(null, [Validators.required])
    });

    this.fpxForm = this._formBuilder.group({
      amount: new FormControl(null),
      bankCode: new FormControl(null, [Validators.required]),
    });

    this.fpxBankName = '';
    this.fpxDialog = '';
    this.formModel = {
      accepted: true,
      confirmationProof: null,
      currency: CONFIGURATION.currency_symbol,
      error: '',
      showFirstDepositInfoBox: true,
      showSuccessfulModal: false,
      success: '',
      uploadConfiguration: this._baseParameterService.getAuthenticatedDocumentUploadingConfig(),
      uploadError: '',
      validation: false
    };

    this.masterData = {
      banks: new Array<any>(),
      notes: new Array<any>(),
      transferType: new Array<any>()
    };
  }

  ngOnInit() {
    this.isActivated = this._authService.getActivationStepCode() === CONFIGURATION.activation_step_code.activated;
    forkJoin({
      notes: this._translateService.get('deposit.note'),
      accountActivation: this._translateService.get('deposit.return-to-account-activation'),
      activity: this._translateService.get('deposit.go-to-activity'),
      formDeposit: this._translateService.get('form.deposit'),
      deposit: this._translateService.get('deposit'),
      fpxBenefits: this._translateService.get('investor-deposit-fpx.deposit-box.benefit')
    }).subscribe(({notes, accountActivation, activity, formDeposit, deposit, fpxBenefits}) => {
      this.masterData.notes = notes;
      this.buttonReturnText.accountActivation = accountActivation;
      this.buttonReturnText.activity = activity;
      this.formModel.error = formDeposit['error'];
      this.formModel.success = formDeposit['success'];
      this.formModel.uploadError = formDeposit['upload-error'];
      this.errorMessage.transferTypeEmpty = formDeposit['error-transfer-type-empty'];
      this.errorMessage.minimumDeposit = formDeposit['minimum-deposit'];
      this.errorMessage.errorFields = formDeposit['error-fields'];
      this.document.caption = deposit['upload-caption'];
      this.document.button = deposit['upload-transfer-receipt'];
      this.document.visible1 = deposit['upload-account-name'];
      this.document.visible2 = deposit['upload-account-number'];
      this.document.visible3 = deposit['upload-amount-transferred'];
      this.document.message = `
                <div class="btn upload-button white-text font-size-16 Gilroy-SemiBold margin-bottom-10">
                    <font>
                        ` + this.document.button + `
                        <i class="fa fa-plus white-text text-center" aria-hidden="true"></i>
                    </font>
                </div>
                <div class="text-center">
                    <div> ` + this.document.caption + `</div>
                    <span>
                        <span class="d-inline-block">
                            <span> ` + this.document.visible1 + `</span><br>
                            <span> ` + this.document.visible2 + `</span><br>
                            <span> ` + this.document.visible3 + `</span>
                        </span>
                    </span>
                </div>`;
      this.fpxBenefits = fpxBenefits;
    });

    this.masterData.transferType = this._baseParameterService.getTransferTypes(CONFIGURATION.country_code);
    if (this._authService.getActivationStepCode() === this.activationStepCode['activated']) {
      this.formModel.showFirstDepositInfoBox = false;
    }

    const requestList = [
      this._memberService.getCountryDetail(CONFIGURATION.country_code),
      this._memberService.getMemberDetail(),
      this._memberService.getLookUpMasterData(),
    ];
    if (CONFIGURATION.country_code === 'MY') {
      requestList.push(this._depositService.getBankList());
    }
    forkJoin(requestList).subscribe(([countrySetting, member, masterData, bankList]) => {
      this.depositSetting = <DepositSetting> countrySetting.deposit_settings;
      const depositFormAmountControl = this.depositForm.get('amount');
      depositFormAmountControl.setValidators(this.getManualAmountValidators());
      depositFormAmountControl.setValue((this.requiresFirstDeposit() ?
        this.depositSetting.minimum_first_deposit : null));

      const fpxFormAmountControl = this.fpxForm.get('amount');
      fpxFormAmountControl.setValidators(this.getFpxAmountValidators());
      fpxFormAmountControl.setValue((this.requiresFirstDeposit() ? this.getFpxMinimumAmount() : null))

      this.firstDepositMinimum = `${this.depositSetting.minimum_first_deposit}`;
      this.showAddBankAccount = CONFIGURATION.showAddBankAccount;
      this.firstDepositMinimumAmountLabel = `${this.countryCurrencyCode} ${this.firstDepositMinimum}`;

      const banks = masterData.data.banks;
      this.masterData.banks = banks.sort((a, b) => {
        return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
      });

      for (const x of this.masterData.banks) {
        if (x.id === this._baseParameterService.other_bank_id[CONFIGURATION.country_code]) {
          this.masterData.banks.push(this.masterData.banks.splice(x, 1)[0]);
        }
      }

      this.userDetail.fullName = member.firstName;
      this.userDetail.uniqueId = member.icNumber;

      if (member.memberBankAccounts) {
        const membersAccount = member.memberBankAccounts.map(memberBankAccount => {
          const mappedResponse = {
            bankName: memberBankAccount.bankId === this._baseParameterService.other_bank_id[CONFIGURATION.country_code] ?
              memberBankAccount.bankOther : this.masterData.banks.find(x => x.id === memberBankAccount.bankId).name,
            bankImageUrl: memberBankAccount.bankId !== this._baseParameterService.other_bank_id[CONFIGURATION.country_code] ?
              this.masterData.banks.find(x => x.id === memberBankAccount.bankId).image : 'bank-logo-other',
            bankUrl: this.masterData.banks.find(x => x.id === memberBankAccount.bankId).url,
            bankAccountNumber: memberBankAccount.number,
            bankAccountName: memberBankAccount.name,
            isDefault: memberBankAccount.isDefault
          };
          return mappedResponse;
        });
        this.userDetail.bankDetail = membersAccount;
        if (this.userDetail.bankDetail.length > 0) {
          this.selectedName = this.userDetail.bankDetail.find(x => x.isDefault === true).bankAccountName;
          this.selectedbankName = this.userDetail.bankDetail.find(x => x.isDefault === true).bankName;
        }
      }

      this.depositForm.patchValue({
        accountName: member.firstName,
        accountNumber: member.memberBankAccounts.length > 0 ? member.memberBankAccounts[0].number : '',
      });

      if (bankList && bankList['data']) {
        this.supportedBankList = bankList['data'];
      }

      if (CONFIGURATION.country_code === 'MY') {
        this.fpxMinimumAmountLabel = this._utilityService.formatDecimal(this.getFpxMinimumAmount());
        if (
          this.depositSetting.maximum_deposit &&
          this.depositSetting.minimum_first_deposit
        ) {
          this.fpxMaximumAmountLabel = this._utilityService
            .formatDecimal(this.depositSetting.maximum_deposit);
          this.minimumAmountLabel = this._utilityService
            .formatDecimal(this.depositSetting.minimum_first_deposit);
        }
      }

    }, error => {
      if (error.status === 0) {
        this._notificationService.error(error.message);
      } else {
        this._notificationService.error();
      }
    });
  }

  ngAfterViewInit() {
    this._activatedRoute.queryParams.subscribe((params: Params) => {
      const fpx_status = params['fpx_status'];
      if (fpx_status) {
        const modalName = `FPXDepositModal${capitalize(fpx_status)}`;
        this.openModal(modalName);
      }
    });
  }

  autoFormatAmount(): void {
    this.depositForm.patchValue({
      amount: this._validatorService.addDelimiter(this.depositForm.value.amount, true)
    });
  }

  onFileUploadError(args: any): void {
    this._notificationService.error(args[1], 5000);
  }

  onFileUploadSending(args: any): void {
    args[2].append('doc_type', 'RECEIPT');
    args[2].append('country_id', CONFIGURATION.country_code);
  }

  onFileUploadSuccess(args: any): void {
    this.document.message = `
        <div class="btn upload-button white-text font-size-16 Gilroy-SemiBold success margin-bottom-10">
            <font>
                ` + this.document.button + `
                <i class="fa fa-check white-text text-center" aria-hidden="true"></i>
            </font>
        </div>
        <div class="text-center">
            <div> ` + this.document.caption + `</div>
            <span>
                <span class="d-inline-block">
                    <span> ` + this.document.visible1 + `</span><br>
                    <span> ` + this.document.visible2 + `</span><br>
                    <span> ` + this.document.visible3 + `</span>
                </span>
            </span>
        </div>`;
    this.formModel.confirmationProof = args[1][0].id;
  }

  private requiresFirstDeposit(): Boolean {
    return this._authService.getActivationStepCode() !== this.activationStepCode['activated'];
  }

  isDepositAmountSufficient(amount: number): Boolean {
    return (
      this.requiresFirstDeposit() && amount >= this.depositSetting.minimum_first_deposit ||
      !this.requiresFirstDeposit() && amount > 0
    );
  }

  onDepositFormSubmit(): void {
    this.formModel.validation = true;
    if (this.depositForm.valid &&
      this.isDepositAmountSufficient(Number(this._validatorService.removeDelimiter(this.depositForm.value.amount)))) {
      if (this.formModel.confirmationProof) {
        this._financeService
          .deposit({
            nominal: this._validatorService.removeDelimiter(this.depositForm.value.amount),
            confirmationproof: this.formModel.confirmationProof,
            transfertype: this.depositForm.value.transferType,
            banksource: this.depositForm.value.bank,
            accountNumber: this.depositForm.value.accountName,
            accountName: this.depositForm.value.accountNumber,
            bank: this.depositForm.value.bank
          })
          .subscribe(
            response => {
              this.depositForm.reset();
              if (this.isActivated) {
                this._eventService.sendInvWalletEvents('INV-deposit');
              } else {
                this._eventService.sendInvWalletEvents('INV-first-deposit');
              }
              this.formModel.validation = false;
              this.formModel.showSuccessfulModal = true;
            },
            error => {
              this._notificationService.error(error.message);
            }
          );
      } else {
        window.scroll(0, 0);
        this._notificationService.error(this.formModel.uploadError);
      }
    } else {
      window.scroll(0, 0);
      if (!this.depositForm.value.amount) {
        this._notificationService.error(this.errorMessage.depositEmpty);
      } else if (!this.depositForm.value.transferType) {
        this._notificationService.error(this.errorMessage.transferTypeEmpty);
      } else if (!Number(this._validatorService.removeDelimiter(this.depositForm.value.amount))) {
        this._notificationService.error(this.errorMessage.minimumDeposit);
      }
    }
  }

  selectBank(bank: any): void {
    this.depositForm.patchValue({
      bank: bank.id
    });
  }

  goToMainMenu() {
    if (this._authService.getActivationStepCode() === this.activationStepCode['escrow_agent']) {
      this._router.navigate(['/admin-investor']);
    } else {
      this._router.navigate(['/admin-investor/overview']);
    }
  }

  onBankChange(event: any) {
    if (event) {
      this.selectedName = this.userDetail.bankDetail.find(x => x.bankName === event.value).bankAccountName;
    }
  }

  goToOverview() {
    if (this._authService.getActivationStepCode() !== this.activationStepCode['activated']) {
      this._router.navigate(['/admin-investor']);
    } else {
      this._router.navigate(['/admin-investor/activity']);
    }
  }

  getButtonText() {
    return this._authService.getActivationStepCode() !== this.activationStepCode['activated'] ?
      this.buttonReturnText.accountActivation : this.buttonReturnText.activity;
  }

  onClickDepositOption(depositOptionKey) {
    const selectedOption = this.depositOptions
      .forEach(depositOption => {
        if (depositOption.key === depositOptionKey) {
          depositOption.selected = true;
          this.depositOption = depositOption.key;
        } else {
          depositOption.selected = false;
        }
      });
  }

  confirmFpxDeposit() {
    if (!this.fpxForm.valid) {
      this._formService.validateAllFormFields(this.fpxForm);
      this._notificationService.error(this.errorMessage.errorFields);
    } else {
      this.openModal('FPXDepositModal');
    }
  }

  initFPXPayment() {
    /**
     * Get transaction id
     */
    const txnData = {
      payment_method: 'fpx',
      amount: parseFloat(this._validatorService.removeDelimiter(this.fpxForm.get('amount').value)),
      bank_code: this.fpxForm.get('bankCode').value,
      description: 'Payment via fpx',
      currency: this.countryCurrencyCode,
      callback_url: location.href
    };

    const username = this._authService.getUserName();
    this._depositService.createFPXTransaction(txnData, username)
      .subscribe(resObj => {
        if (resObj && resObj['data']) {
          this._depositService.startFPXTransaction({
            internal_order_no: resObj['data']['internal_order_no'],
            payment_method: 'fpx'
          }, username)
            .subscribe(redirectRespond => {
              if (this.isActivated) {
                this._eventService.sendInvWalletEvents('INV-FPX-deposit');
              } else {
                this._eventService.sendInvWalletEvents('INV-FPX-first-deposit');
              }
              if (redirectRespond && redirectRespond.data) {
                window.location.assign(redirectRespond.data.redirect_url);
              } else {
                this._notificationService.error();
              }
            }, error => {
              this._notificationService.error();
            });
        }
      }, error => {
        this._notificationService.error();
      });
  }

  depositManually(modalName) {
    this.closeModal(modalName);
    this.onClickDepositOption('manual');
  }

  setFpxBankName(event): void {
    const bank = this.supportedBankList.filter(currentBank => currentBank['bank_code'] === event.value);
    const bankName = bank.length > 0 ? bank[0]['bank_name'] : '';
    this.fpxBankName = bankName;
  }

  getFpxMinimumAmount(): any {
    return this.requiresFirstDeposit() ? this.depositSetting.minimum_first_deposit :
      this.depositSetting.minimum_deposit;
  }

  getFpxAmountValidators(): Array<ValidatorFn> {
    const fpxAmountValidators = [Validators.required, this._validatorService.validatePositiveDecimal];
    if (CONFIGURATION.country_code === 'MY') {
      fpxAmountValidators.push(this._validatorService.validateMinimumAmount(this.depositSetting.minimum_deposit));
      fpxAmountValidators.push(this._validatorService.validateMaximumAmount(this.depositSetting.maximum_deposit));
    }
    return fpxAmountValidators;
  }

  getManualAmountValidators(): Array<ValidatorFn> {
    const manualAmountValidators = [Validators.required, this._validatorService.validatePositiveDecimal];
    if (this.requiresFirstDeposit()) {
      manualAmountValidators.push(this._validatorService
        .validateMinimumAmount(this.depositSetting.minimum_first_deposit));
    };
    return manualAmountValidators;
  }

  goAfterFpx(): void {
    if (this.requiresFirstDeposit()) {
      this._router.navigate(['/admin-investor']);
    }
  }

  openModal(id: string): void {
    this._modalService.open(id);
  }

  closeModal(id: string): void {
    this._modalService.close(id);
  }

  getSupportedDepositOptions(depositOptions: Array<DepositOption>, countryCode: string): Array<DepositOption> {
    const supportedDepositOptions = depositOptions
      .filter(depositOption =>
        (depositOption.countrySupport === CONFIGURATION.country_code) ||
        (depositOption.countrySupport === 'all'));
    return supportedDepositOptions;
  }

  getDefaultDepositOption(depositOptions: Array<DepositOption>): DepositOption {
    if (depositOptions.length === 1) {
      return depositOptions[0];
    } else {
      return depositOptions.find(depositOption => depositOption.default === true);
    }
  }
}
