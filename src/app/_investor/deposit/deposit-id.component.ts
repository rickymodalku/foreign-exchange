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
import { FinanceService } from '../../services/finance.service';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import { ValidatorService } from '../../services/validator.service';
import CONFIGURATION from '../../../configurations/configuration';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'deposit-id',
  templateUrl: './deposit-id.html'
})
export class DepositIDComponent implements OnInit {
  activationStepCode: Array<any>;
  depositForm: FormGroup;
  firebaseMasterData: any;
  formModel: any;
  fullname: string;
  masterData: any;
  selectedStep: any;
  uniqueId: string;
  isBcaBankAccount: boolean;

  constructor(
    private _authService: AuthService,
    private _financeService: FinanceService,
    private _baseParameterService: BaseParameterService,
    private _formBuilder: FormBuilder,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _localStorageService: LocalStorageService,
    private _validatorService: ValidatorService
  ) {
    this.activationStepCode = CONFIGURATION.activation_step_code;
    this.depositForm = this._formBuilder.group({
      amount: new FormControl(null, [Validators.required, this._validatorService.validatePositiveDecimal]),
      accountName: new FormControl(null, [Validators.required]),
      accountNumber: new FormControl(null, [Validators.required]),
      bank: new FormControl(null, [Validators.required]),
      bankOther: new FormControl(null, [])
    });
    this.formModel = {
      bank: '',
      bankDetail: {
        bank_branch: '',
        bank_type: '',
        bank_name: '',
        bank_number: '',
        bank_accname: ''
      },
      banks: '',
      depositCount: '',
      institutionBank: '',
      virtualAccount: {
        currency: '',
        va_bank: '',
        va_branch: '',
        va_name: '',
        va_id: '',
        va_user_name: '',
        va_user_id: '',
        va_number_bca: '',
        va_bank_bca: '',
        va_bank_bca_id: '',
      },
    };
    this.fullname = this._authService.getFullName();
    this.masterData = {
      banks: new Array<any>(),
    };
    this.firebaseMasterData = {
      bcaVaInternetBanking: new Array<any>(),
      bcaVaAtm: new Array<any>(),
      bcaVaMBanking: new Array<any>(),
      transferWayBcaVa: new Array<any>(),
      transferWaySinarmasVa: new Array<any>(),
      sinarmasPayment: new Array<any>(),
      sinarmasPaymentATM: new Array<any>(),
      sinarmasTransfer: new Array<any>(),
      sinarmasTransferATM: new Array<any>(),
      bcaMBanking: new Array<any>(),
      bcaTransfer: new Array<any>(),
      generalTransfer: new Array<any>(),
      llgRgts: new Array<any>(),
      mandiriTransfer: new Array<any>(),
      otherBankATM: new Array<any>(),
      tellerBankSinarmas: new Array<any>(),
      termCondition: new Array<any>(),
    };
    this.selectedStep = null;
    this.uniqueId = this._authService.getReferralCode();
    this.isBcaBankAccount = false;
  }

  ngOnInit() {
    // Temporary remove -> Search for first-deposit-message to enable again
    // if (this._authService.getActivationStepCode() === this.activationStepCode['fill_information']) {
    //   this._notificationService.info(this._localStorageService.retrieve('first-deposit-message'));
    // }
    this.initialize();
  }

  firebaseInitialize(): void {
    this._translateService
      .get('deposit.transfer-way.bca-va.list')
      .subscribe(
        transferWayBcaVa => {
          for (let key in transferWayBcaVa) {
            this.firebaseMasterData.transferWayBcaVa.push({
              value: transferWayBcaVa[key]
            });
          }
        });

    this._translateService
      .get('deposit.transfer-way.sinarmas-va.list')
      .subscribe(
        transferWaySinarmasVa => {
          for (let key in transferWaySinarmasVa) {
            this.firebaseMasterData.transferWaySinarmasVa.push({
              value: transferWaySinarmasVa[key]
            });
          }
        });

    this._translateService
      .get('deposit.term-condition.list')
      .subscribe(
        termCondition => {
          for (let key in termCondition) {
            this.firebaseMasterData.termCondition.push({
              value: termCondition[key].value
            });
          }
        });

    this._translateService
      .get('deposit.internet-banking.sinarmas.payment.list')
      .subscribe(
        sinarmasPayment => {
          for (let key in sinarmasPayment) {
            this.firebaseMasterData.sinarmasPayment.push({
              value: sinarmasPayment[key].value
            });
          }
        });


    this._translateService
      .get('deposit.internet-banking.sinarmas.transfer.list')
      .subscribe(
        sinarmasTransfer => {
          for (let key in sinarmasTransfer) {
            this.firebaseMasterData.sinarmasTransfer.push({
              value: sinarmasTransfer[key].value
            });
          }
        });


    this._translateService
      .get('deposit.internet-banking.bca.list')
      .subscribe(
        bcaTransfer => {
          for (let key in bcaTransfer) {
            this.firebaseMasterData.bcaTransfer.push({
              value: bcaTransfer[key].value
            });
          }
        });

    this._translateService
      .get('deposit.internet-banking.bca-m-banking.list')
      .subscribe(
        bcaMBanking => {
          for (let key in bcaMBanking) {
            this.firebaseMasterData.bcaMBanking.push({
              value: bcaMBanking[key].value
            });
          }
        });

    this._translateService
      .get('deposit.internet-banking.mandiri.list')
      .subscribe(
        mandiriTransfer => {
          for (let key in mandiriTransfer) {
            this.firebaseMasterData.mandiriTransfer.push({
              value: mandiriTransfer[key].value
            });
          }
        });

    this._translateService
      .get('deposit.internet-banking.general.list')
      .subscribe(
        generalTransfer => {
          for (let key in generalTransfer) {
            this.firebaseMasterData.generalTransfer.push({
              value: generalTransfer[key].value
            });
          }
        });

    this._translateService
      .get('deposit.atm.sinarmas.transfer.list')
      .subscribe(
        sinarmasTransferATM => {
          for (let key in sinarmasTransferATM) {
            this.firebaseMasterData.sinarmasTransferATM.push({
              value: sinarmasTransferATM[key].value
            });
          }
        });

    this._translateService
      .get('deposit.atm.other.list')
      .subscribe(
        otherBankATM => {
          for (let key in otherBankATM) {
            this.firebaseMasterData.otherBankATM.push({
              value: otherBankATM[key].value
            });
          }
        });

    this._translateService
      .get('deposit.teller-bank-sinarmas.list')
      .subscribe(
        tellerBankSinarmas => {
          for (let key in tellerBankSinarmas) {
            this.firebaseMasterData.tellerBankSinarmas.push({
              value: tellerBankSinarmas[key].value
            });
          }
        });


    this._translateService
      .get('deposit.llg-rtgs.list')
      .subscribe(
        llgRgts => {
          for (let key in llgRgts) {
            this.firebaseMasterData.llgRgts.push({
              value: llgRgts[key].value
            });
          }
        });

    this._translateService
      .get('deposit.bca-va.bca-internet-banking.list')
      .subscribe(
        bcaVaInternetBanking => {
          for (let key in bcaVaInternetBanking) {
            this.firebaseMasterData.bcaVaInternetBanking.push({
              value: bcaVaInternetBanking[key].value
            });
          }
        });

    this._translateService
      .get('deposit.bca-va.m-banking.list')
      .subscribe(
        bcaVaMBanking => {
          for (let key in bcaVaMBanking) {
            this.firebaseMasterData.bcaVaMBanking.push({
              value: bcaVaMBanking[key].value
            });
          }
        });

    this._translateService
      .get('deposit.bca-va.atm.list')
      .subscribe(
        bcaVaAtm => {
          for (let key in bcaVaAtm) {
            this.firebaseMasterData.bcaVaAtm.push({
              value: bcaVaAtm[key].value
            });
          }
        });


  }

  initialize(): void {
    this.firebaseInitialize();
    window.scrollTo(0, 0);
    this.formModel.virtualAccount.currency = CONFIGURATION.currency_code;
    this.formModel.virtualAccount.va_bank = CONFIGURATION.va_detail.VA_bank;
    this.formModel.virtualAccount.va_bank_bca = CONFIGURATION.va_detail.VA_bank_bca;
    this.formModel.virtualAccount.va_bank_bca_id = CONFIGURATION.va_detail.VA_bank_bca_id;
    this.formModel.virtualAccount.va_branch = CONFIGURATION.va_detail.VA_branch;
    this.formModel.virtualAccount.va_name = CONFIGURATION.va_detail.VA_name;
    this.formModel.virtualAccount.va_id = CONFIGURATION.va_detail.VA_id;
    this._memberService.getLookUpMasterData().subscribe(references => {
      this.formModel.banks = references.data.banks;
      this._memberService.getCompanyBankAccounts().
        subscribe(memberBankAccounts => {
          this.formModel.institutionBank = memberBankAccounts.data.find((element: any) => {
            return element.isDefault === true;
          });
          if (!this.formModel.institutionBank) {
            this.formModel.institutionBank = memberBankAccounts.length > 0 ? memberBankAccounts[0] : null;
          }

          if (this.formModel.institutionBank) {
            let defaultBankObject = references.data.banks.find((element: any) => {
              return element.id === this.formModel.institutionBank.bankId;
            });
            if (defaultBankObject) {
              if (defaultBankObject.name.indexOf('Other') >= 0 || defaultBankObject.id === 9999) {
                this.formModel.institutionBank.bankName = this.formModel.institutionBank.bankOther;
              } else {
                this.formModel.institutionBank.bankName = defaultBankObject.name;
              }
            }
          }
        });
      this._memberService.getMemberDetail().subscribe(member => {
        this.formModel.virtualAccount.va_user_name = member.firstName;
        this.formModel.virtualAccount.va_number_bca = member.bcaVaNumber;
        if (null != member.lastName) { this.formModel.virtualAccount.va_user_name += '' + member.lastName };
        this.formModel.virtualAccount.va_user_id = member.virtualAccountNumber;
        this.formModel.bank = member.memberBankAccounts.find((element: any) => {
          return element.isDefault === true;
        });
        this.isBcaBankAccount = Number(this.formModel.bank.bankId) === this._baseParameterService.getBankIdList().bca;
        if (this.formModel.bank) {
          this._memberService
            .getMemberMasterData(this._authService.getMemberTypeCode())
            .subscribe(
              response => {
                let masterData = response.data;
                let bankTypeName;
                bankTypeName = masterData.bankAccountTypes.filter(bankAccountType => {
                  return bankAccountType.id === this.formModel.bank.bankAccountTypeId;
                });
                this.formModel.bankDetail.bank_type = bankTypeName[0].name;
              },
              error => {
                this._notificationService.error();
              });
          let defaultBankObject = references.data.banks.find((element: any) => {
            return element.id == this.formModel.bank.bankId;
          });
          if (defaultBankObject) {
            if (defaultBankObject.name.indexOf('Other') >= 0 || defaultBankObject.id == 9999) {
              this.formModel.bank.bankName = this.formModel.bank.bankOther;
            } else {
              this.formModel.bank.bankName = defaultBankObject.name;
            }
          }
          this.formModel.bankDetail.bank_name = this.formModel.bank.bankName;
          this.formModel.bankDetail.bank_branch = this.formModel.bank.branch;
          this.formModel.bankDetail.bank_type = this.formModel.bank.bankAccountTypeName;
          this.formModel.bankDetail.bank_number = this.formModel.bank.number;
          this.formModel.bankDetail.bank_accname = this.formModel.bank.name;
        }
      });
    });
    this._financeService
      .getDeposit()
      .subscribe(
        response => {
          this.formModel.depositCount = response.total;
        }
      )

  }
}
