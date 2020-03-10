import {
  Component,
  OnInit
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { DocumentService } from '../../services/document.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { FinanceService } from '../../services/finance.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import CONFIGURATION from '../../../configurations/configuration';
import { ENVIRONMENT } from '../../../environments/environment';
import { saveAs } from "file-saver";

@Component({
  selector: 'account-activation-my',
  templateUrl: './account-activation-my.html'
})
export class AccountActivationMYComponent implements OnInit {
  activationStepCode: Array<any>;
  currentStep: string;
  document: any;
  docConfig: any;
  lastStep: number;
  uploadLabel: any;
  crowdfundtalkLink: string;
  userName: string;
  fileName: string;
  fileNamePerCountry: any;
  countryCode: string;
  public constructor(
    private _authService: AuthService,
    private _documentService: DocumentService,
    private _financeService: FinanceService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _baseparameterService: BaseParameterService
  ) {
    this.crowdfundtalkLink = CONFIGURATION.crowdfundtalkLinkActivation;
    this.activationStepCode = CONFIGURATION.activation_step_code;
    this.docConfig = Object.assign(this._baseparameterService.getDocumentUploadingConfig(), {
      maxFilesize: 10,
      maxFiles: 1,
      addRemoveLinks: true,
      dictRemoveFile: 'Delete file'
    });
    this.uploadLabel = {
      uploadForm: '',
      upload: ''
    }
    this.document = {
      label: '',
      message: '',
      type: '',
      uploaded: false
    };
    this.userName = this._authService.getUserName();
    this.fileNamePerCountry = {
      SG: `${this.userName} _Platform_Agreement.pdf`,
      MY: `${this.userName} _User_Agreement.pdf`,
      ID: `${this.userName} _Platform_Agreement.pdf`
    };
    this.countryCode = CONFIGURATION.country_code;
    this.fileName = this.fileNamePerCountry[this.countryCode];
  }

  ngOnInit() {
    this._translateService
      .get('investor-account-activation.sign-agreement-form.upload-sa-form')
      .subscribe(
        uploadForm => {
          this.uploadLabel.uploadForm = uploadForm;
          this.document.message = this.document.label + `
                <div
                  class="btn upload-button white-text font-size-16 Gilroy-SemiBold margin-bottom-10">
                  <font>` + this.uploadLabel.uploadForm + `<i class="fa fa-plus margin-left-10" aria-hidden="true"></i></font>
                </div>
              `;
        });
        this.checkDeposit();
  }

  downloadSADocument() {
    this._memberService.getPlatformAgreementPDF().subscribe(
        response => {
          const blob = new Blob([response._body], { type: 'application/pdf' });
          saveAs(blob, this.fileName);
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  checkDeposit() {
    let activationStepCode = '';
    if (
      this._authService.getActivationStepCode() !== null &&
      this._authService.getActivationStepCode() === CONFIGURATION.activation_step_code.fill_information
    ) {
      this._financeService
        .getDeposit()
        .subscribe(
          response => {
            activationStepCode = response.value.total > 0 ?
              CONFIGURATION.activation_step_code.first_deposit :
              (
                this._authService.getActivationStepCode() !== null ?
                this._authService.getActivationStepCode() :
                  CONFIGURATION.activation_step_code.null
              );
            this._authService.setActivationStepCode(activationStepCode);
            this.updateAccountActivationLastStep();
          },
          error => {
            this._notificationService.error();
          }
        );
    } else {
      activationStepCode = this._authService.getActivationStepCode() !== null ?
      this._authService.getActivationStepCode() :
        CONFIGURATION.activation_step_code.null;
      this._authService.setActivationStepCode(activationStepCode);
      this.updateAccountActivationLastStep();
    }
  }

  updateAccountActivationLastStep() {
    this.currentStep = this._authService.getActivationStepCode();
    if (this.currentStep === this.activationStepCode['null']) {
      this.lastStep = 0;
    } else if (this.currentStep === this.activationStepCode['fill_information']) {
      this.lastStep = 1;
    } else if (this.currentStep === this.activationStepCode['first_deposit']) {
      this.lastStep = 2;
    } else if (this.currentStep === this.activationStepCode['deposit'] ||
      this.currentStep === this.activationStepCode['sign_econtract'] ||
      this.currentStep === this.activationStepCode['send_econtract'] ||
      this.currentStep === this.activationStepCode['escrow_agent']) {
      this.lastStep = 3;
    } else if (this.currentStep === this.activationStepCode['activated']) {
      this.lastStep = 4;
    }
  }
}
