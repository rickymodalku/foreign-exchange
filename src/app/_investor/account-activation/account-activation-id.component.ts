import {
  Component,
  OnInit
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import CONFIGURATION from '../../../configurations/configuration';
import { FinanceService } from '../../services/finance.service';
import { LoanService } from '../../services/loan.service';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import { DomSanitizer, SafeHtml, } from '@angular/platform-browser';
import { ModalService } from 'app/services/modal.service';
import { WindowService } from '../../services/window.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'account-activation-id',
  templateUrl: './account-activation-id.html'
})

export class AccountActivationIDComponent implements OnInit {
  activationStepCode: Array<any>;
  currentStep: string;
  lastStep: number;
  investorBalance: number;
  minimumFirstDeposit: number;
  websiteContent: SafeHtml;
  selectedDocumentId: string;
  isSigned: boolean;
  digisignStatus: any;
  constructor(
    private _authService: AuthService,
    private _financeService: FinanceService,
    private _memberService: MemberService,
    private _loanService: LoanService,
    private _domSanitizer: DomSanitizer,
    private _modalService: ModalService,
    private _windowService: WindowService,
    private route: ActivatedRoute,
    private _notificationService: NotificationService
  ) {
    this.activationStepCode = CONFIGURATION.activation_step_code;
    this.investorBalance = 0;
    this.minimumFirstDeposit = 0;
    this.selectedDocumentId = '';
    this.isSigned = true;
    this.digisignStatus = '';
  }

  ngOnInit() {
    this.digisignCallBack();
    this.route.fragment.subscribe((fragment: string) => {
      if (fragment === 'digisign') {
        this._windowService.smoothScroll('digisign');
      }
    });

    this._memberService.getCountryDetail(CONFIGURATION.country_code).subscribe(data => {
      if (
        data && data.deposit_settings &&
        data.deposit_settings.minimum_first_deposit
      ) {
        this.minimumFirstDeposit = data.deposit_settings.minimum_first_deposit;
      }
    });

    this.checkDeposit();
    this.getInvestorBalance();
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

  checkDeposit() {
    const getActivationStepCode = this._authService.getActivationStepCode();
    let activationStepCode = getActivationStepCode ? getActivationStepCode : CONFIGURATION.activation_step_code.null;
    if (activationStepCode) {
      if (getActivationStepCode === CONFIGURATION.activation_step_code.fill_information) {
        this._financeService
          .getDeposit()
          .subscribe(
            response => {
              activationStepCode = response.value.total > 0 ?
                CONFIGURATION.activation_step_code.first_deposit :
                (
                  getActivationStepCode !== null ?
                    getActivationStepCode :
                    CONFIGURATION.activation_step_code.null
                );
              this._authService.setActivationStepCode(activationStepCode);
              this.updateAccountActivationLastStep();
            },
            error => {
              this._notificationService.error();
            }
          );
      }
      this._authService.setActivationStepCode(activationStepCode);
      this.updateAccountActivationLastStep();
    }
  }

  updateAccountActivationLastStep() {
    this.currentStep = this._authService.getActivationStepCode();
    if (this.currentStep === this.activationStepCode['null']) {
      this.lastStep = 0;
    } else if (this.currentStep === this.activationStepCode['first_deposit'] ||
      this.currentStep === this.activationStepCode['fill_information']) {
      this.lastStep = 1;
    } else if (this.currentStep === this.activationStepCode['deposit']) {
      this.lastStep = 2;
    } else if (this.currentStep === this.activationStepCode['send_econtract'] ||
      this.currentStep === this.activationStepCode['sign_econtract']) {
      this.lastStep = 3;
    } else if (this.currentStep === this.activationStepCode['activated']) {
      this.lastStep = 4;
    }
  }

  getInvestorBalance() {
    this._financeService
      .getBalance()
      .subscribe(
        balance => {
          this.investorBalance = balance.value;
        },
        error => {
          console.error('ERROR', error);
        }
      );
  }

  openModal(id: string): void {
    this._modalService.open(id);
    if (id === 'digitalSignaturePopUp') {
      this._memberService.getDocumentToSign(this._authService.getMemberUUID())
        .subscribe(
          documentToSign => {
            this.websiteContent = this._domSanitizer.bypassSecurityTrustHtml(documentToSign.data[0].content);
            this.selectedDocumentId = documentToSign.data[0].document_id;
          },
          error => {
            this._modalService.close(id);
            this._notificationService.error('Digisign account is not registered,please contact customer support');
          }
        );
    }
  }

  closeModal(id: string): void {
    this._modalService.close(id);
    if (id === 'digitalSignaturePopUp') {
      this._loanService.getDocumentStatus(this.selectedDocumentId)
        .subscribe(
          signedStatus => {
            this._modalService.close('LoanOfferDialog');
            this.isSigned = signedStatus.data.signed;
            if (this.isSigned) {
              this._authService.setActivationStepCode(CONFIGURATION.activation_step_code.sign_econtract);
              this.updateAccountActivationLastStep();
            }
          },
          error => {
            this._notificationService.error(error);
          });
    }
  }

}
