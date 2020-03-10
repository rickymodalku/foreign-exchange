
import { forkJoin as observableForkJoin } from 'rxjs';
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
import { NotificationService } from '../../services/notification.service';
import { ValidatorService } from '../../services/validator.service';
import CONFIGURATION from '../../../configurations/configuration';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'withdrawal',
  templateUrl: './withdrawal.html'
})
export class WithdrawalComponent implements OnInit {
  countryCode: string;
  document: any;
  formModel: any;
  masterData: any;
  showBankStatementUpload: boolean;
  withdrawalForm: FormGroup;
  enableZendesk: string;

  public constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _documentService: DocumentService,
    private _eventService: EventService,
    private _financeService: FinanceService,
    private _formBuilder: FormBuilder,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _validatorService: ValidatorService
  ) {
    this.enableZendesk = CONFIGURATION.zendesk.enable;
    this.countryCode = CONFIGURATION.country_code;
    this.formModel = {
      withdrawal: {
        confirmationProof: null,
        accepted: true,
        bank: null,
        currency: CONFIGURATION.currency_symbol,
        error: '',
        reasonOtherValid: true,
        showReasonOther: false,
        success: '',
        uploadError: '',
        insufficientAmountError: '',
        uploadConfiguration: this._baseParameterService.getDocumentUploadingConfigWithUploadImage(),
        validation: false,
        reason: '',
      }
    };

    this.masterData = {
      withdrawalReasons: new Array<any>()
    };

    this.document = {
      message: '',
      caption: '',
      button: '',
      visible1: '',
      visible2: '',
      visible3: ''
    };

    this.showBankStatementUpload = false;
    this.withdrawalForm = this._formBuilder.group({
      amount: new FormControl(null, [Validators.required, this._validatorService.validatePositiveDecimal]),
      reason: new FormControl(null, [Validators.required]),
      reasonOther: new FormControl(null, [])
    });
  }

  ngOnInit() {
    observableForkJoin(
      this._documentService.getUploadedDocument('BANK_STATEMENT'),
      this._documentService.getUploadedDocument('RECEIPT')
    ).subscribe(responses => {
      this.showBankStatementUpload = this.countryCode === 'MY' && !(responses[0].results.length || responses[1].results.length);
    }, error => {
      this._notificationService.error();
    });

    this._translateService
      .get('withdrawal')
      .subscribe(
        withdrawal => {
          this.document.caption = withdrawal['upload-caption'];
          this.document.button = withdrawal['upload-button'];
          this.formModel.withdrawal.uploadError = withdrawal['upload-validation'];
          this.formModel.withdrawal.insufficientAmountError = withdrawal['insufficient-amount-error'];
          this.document.visible1 = withdrawal['upload-bank-name'];
          this.document.visible2 = withdrawal['upload-account-name'];
          this.document.visible3 = withdrawal['upload-account-number'];
          this.document.message = `
                <div class="btn upload-button white-text Gilroy-SemiBold margin-bottom-10">
                    <span>
                        ` + this.document.button + `
                        <i class="fa fa-plus white-text text-center" aria-hidden="true"></i>
                    </span>
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
        });

    this._memberService
      .getMemberDetail()
      .subscribe(
        member => {
          this.formModel.withdrawal.bank = member.memberBankAccounts.find(memberBankAccount => {
            return memberBankAccount.isDefault;
          });
          if (this.formModel.withdrawal.bank) {
            this._memberService
              .getLookUpMasterData()
              .subscribe(
                response => {
                  const selectedBank = response.data.banks.find(element => {
                    return element.id === this.formModel.withdrawal.bank.bankId;
                  });
                  this.formModel.withdrawal.bank.bankName = selectedBank.name.includes('Other') ?
                    this.formModel.withdrawal.bank.bankOther : selectedBank.name;
                },
                error => {
                  this._notificationService.error();
                }
              );
          }
        },
        error => {
          this._notificationService.error();
        }
      );
    this._translateService
      .get('master.withdrawal-reasons')
      .subscribe(
        withdrawalReasons => {
          this.masterData.withdrawalReasons = withdrawalReasons;
        }
      );
    this._translateService
      .get('form.withdrawal')
      .subscribe(
        withdrawal => {
          this.formModel.withdrawal.error = withdrawal.error;
          this.formModel.withdrawal.success = withdrawal.success;
        }
      );
  }

  autoFormatAmount(): void {
    this.withdrawalForm.patchValue({
      amount: this._validatorService.addDelimiter(this.withdrawalForm.value.amount, true)
    });
  }

  onWithdrawalReasonChange(): void {
    const lastIndexValue = this.masterData.withdrawalReasons[this.masterData.withdrawalReasons.length - 1];
    this.formModel.withdrawal.showReasonOther = this.formModel.withdrawal.reason === lastIndexValue;
  }

  onWithdrawalFormAccept(event: any): void {
    this.formModel.withdrawal.accepted = event.checked;
  }

  onFileUploadError(args: any): void {
    this._notificationService.error(args[1], 5000);
  }

  onFileUploadSending(args: any): void {
    args[2].append('doc_type', 'BANK_STATEMENT');
    args[2].append('country_id', CONFIGURATION.country_code);
  }

  onFileUploadSuccess(args: any): void {
    this.document.message = `
        <div class="btn upload-button white-text Gilroy-SemiBold success margin-bottom-10">
            <span>
                ` + this.document.button + `
                <i class="fa fa-check white-text text-center" aria-hidden="true"></i>
            </span>
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
    this.formModel.withdrawal.confirmationProof = args[1][0].id;
  }

  onWithdrawalFormSubmit(): void {
    let currentAmount = 0;
    const formAmount = Number(this._validatorService.removeDelimiter(this.withdrawalForm.value.amount));
    this._financeService
      .getBalance()
      .subscribe(
        balance => {
          currentAmount = balance.value;
          const isAmountWithdrawalAmountSufficient = formAmount <= currentAmount;
          const validateConfirmationProof =
            !(CONFIGURATION.country_code === 'MY') ? true :
              this.showBankStatementUpload ? this.formModel.withdrawal.confirmationProof : true;


          this.formModel.withdrawal.validation = true;
          this.formModel.withdrawal.reasonOtherValid =
            !this.formModel.withdrawal.showReasonOther
            || (this.formModel.withdrawal.showReasonOther
              && this.withdrawalForm.value.reasonOther
              && this.withdrawalForm.value.reasonOther.length > 0);

          if (this.formModel.withdrawal.reasonOtherValid && this.withdrawalForm.valid) {
            if (validateConfirmationProof) {
              if (isAmountWithdrawalAmountSufficient) {
                this._financeService.withdraw({
                  amount: formAmount,
                  confirmationproof: this.formModel.withdrawal.confirmationProof,
                  Withdrawreason: this.formModel.withdrawal.showReasonOther
                    ? this.withdrawalForm.value.reason + ': ' + this.withdrawalForm.value.reasonOther
                    : this.withdrawalForm.value.reason
                }).subscribe(
                  response => {
                    this.withdrawalForm.reset();
                    this.formModel.withdrawal.reasonOtherValid = true;
                    this.formModel.withdrawal.showReasonOther = false;
                    this.formModel.withdrawal.validation = false;
                    this._notificationService.success(this.formModel.withdrawal.success);
                    this._eventService.sendInvWalletEvents('INV-withdrawal');
                    setTimeout(() => {
                      this._financeService.triggerBalanceRetrieval();
                    }, 2000);
                  },
                  error => {
                    this._notificationService.error(error.message);
                  }
                );
              } else {
                this._notificationService.error(this.formModel.withdrawal.insufficientAmountError);
              }
            } else {
              window.scroll(0, 0);
              this._notificationService.error(this.formModel.withdrawal.uploadError);
            }
          } else {
            window.scrollTo(0, 0);
          }
        },
        error => {
          console.error('ERROR', error);
        }
      );
  }
  showICNumber() {
    return CONFIGURATION.showICNumberText;
  }
}
