import {
  Component,
  OnInit,
  SecurityContext
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import CONFIGURATION from '../../../configurations/configuration';
import { ModalService } from '../../services/modal.service';
import { MemberService } from '../../services/member.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'setting-accredited-declaration',
  templateUrl: './setting-accredited-declaration.html'
})
export class SettingAccreditedDeclarationComponent implements OnInit {
  annualIncomeDocDetail: any;
  canOptOutFlag: boolean;
  currentStep: number;
  dateFormat: string;
  isAnnualIncomeAccreditedCriteria: boolean;
  memberChangeRequestEntity: any;
  payslipCounterFile: number;
  payslipNumberOfMaximumFile: number;
  uploadDocumentValidationMessage: string;
  payslipValidationMessage: string;
  entityCode: any;


  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _domSanitizer: DomSanitizer,
    private _modalService: ModalService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
  ) {
    this.currentStep = 1;
    this.annualIncomeDocDetail = [
      {
        label: 'NOA',
        type: 'NOA',
        displayText: '',
        uploaded: false,
        placeholder: {
          upload: '',
          uploaded: ''
        },
        error: '',
        success: '',
        config: this._baseParameterService.getDocumentUploadingConfigWithUploadImage(),
        annualIncomeDoc: true,
      },
      {
        label: 'PAYSLIP',
        type: 'PAYSLIP',
        displayText: '',
        uploaded: false,
        placeholder: {
          upload: '',
          uploaded: ''
        },
        error: '',
        success: '',
        config: this._baseParameterService.getDocumentUploadingConfigWithUploadImage(),
        annualIncomeDoc: true,
      },
      {
        label: 'Title Deed of Property',
        type: 'TITLE_DEED_OF_PROPERTY',
        displayText: '',
        uploaded: false,
        placeholder: {
          upload: '',
          uploaded: ''
        },
        error: '',
        success: '',
        config: this._baseParameterService.getDocumentUploadingConfigWithUploadImage(),
        annualIncomeDoc: false,
      },
      {
        label: 'Bank Statement',
        type: 'BANK_STATEMENT',
        displayText: '',
        uploaded: false,
        placeholder: {
          upload: '',
          uploaded: ''
        },
        error: '',
        success: '',
        config: this._baseParameterService.getDocumentUploadingConfigWithUploadImage(),
        annualIncomeDoc: false,
      },
      {
        label: 'Investment Account Statement',
        type: 'INVESTMENT_ACCOUNT_STATEMENT',
        displayText: '',
        uploaded: false,
        placeholder: {
          upload: '',
          uploaded: ''
        },
        error: '',
        success: '',
        config: this._baseParameterService.getDocumentUploadingConfigWithUploadImage(),
        annualIncomeDoc: false,
      },
    ];

    this.entityCode = {
      accredited: 'ACCREDITED',
      retail: 'RETAIL'
    };

    this.isAnnualIncomeAccreditedCriteria = true;
    this.payslipCounterFile = 0;
    this.canOptOutFlag = false;
    this.dateFormat = CONFIGURATION.format.date;
    this.memberChangeRequestEntity = JSON.parse(this._authService.getMemberChangeRequestEntity());
    this.uploadDocumentValidationMessage = '';
    this.payslipValidationMessage = '';
    this.payslipNumberOfMaximumFile = 6;
  }

  ngOnInit() {
    if (this.memberChangeRequestEntity) {
      this.getInvestorAccreditedDeclarationStep();
    }
    this.onUpdateMaxFileForPayslipDoc();
    this.getTranslation();
  }

  getTranslation() {
    this._translateService
      .get('form.setting-accredited-declaration.upload')
      .subscribe(
        uploadWording => {
          this.annualIncomeDocDetail.forEach(element => {
            element.message = uploadWording;
          });
        });

    this._translateService
      .get('form.setting-accredited-declaration.document-upload')
      .subscribe(
        documentUpload => {
          this.annualIncomeDocDetail.forEach(element => {
            element.displayText = documentUpload.find(el => { return el.type === element.type; }).value;
          });
        });

    this._translateService
      .get('form.setting-accredited-declaration.please-upload-all-required-document')
      .subscribe(
        uploadAllRequiredDocument => {
          this.uploadDocumentValidationMessage = uploadAllRequiredDocument;
        });

    this._translateService
      .get('form.setting-accredited-declaration.please-upload-payslip')
      .subscribe(
        payslipValidationMessage => {
          this.payslipValidationMessage = payslipValidationMessage;
        });
  }

  onUpdateMaxFileForPayslipDoc() {
    this.annualIncomeDocDetail.find(element => { return element.type === 'PAYSLIP'; }).config.maxFiles = this.payslipNumberOfMaximumFile;
  }

  getInvestorAccreditedDeclarationStep() {
    /**
     * Opt-out is processed directly, there's no need to check for opt-out pending condition below.
     * this.memberChangeRequestEntity.status === 'INIT' && this.memberChangeRequestEntity.to === 'RETAIL'
     */
    if (this.memberChangeRequestEntity.status === 'INIT' && this.memberChangeRequestEntity.to === 'ACCREDITED') {
      // Opt-in pending.
      this.currentStep = 2;
    } else if (this.memberChangeRequestEntity.status === 'SUCCESS' && this.memberChangeRequestEntity.to === 'ACCREDITED') {
      // Opt-in success.
      this.currentStep = 3;
      this.canOptOutFlag = new Date() > new Date(this.memberChangeRequestEntity.next_request_at);
    } else if (this.memberChangeRequestEntity.status === 'SUCCESS' && this.memberChangeRequestEntity.to === 'RETAIL') {
      // Opt-out success.
      this.currentStep = new Date() > new Date(this.memberChangeRequestEntity.next_request_at) ? 1 : 3;
      this.canOptOutFlag = false;
    }
  }

  onFileUploadError(args: any, documentLabel: string): void {
    const message = documentLabel + ': ' + args[1];
    this._notificationService.error(message, 5000);
  }

  onFileUploadSending(args: any, documentType: string): void {
    args[2].append('doc_type', documentType);
    args[2].append('investor_id', this._authService.getMemberId());
    args[2].append('country_id', CONFIGURATION.country_code);
  }

  onFileUploadSuccess(args: any, documentType: string): void {
    if (documentType) {
      const message = this.annualIncomeDocDetail.find(element => { return element.type === documentType; }).label + ' uploaded.';
      if (documentType === 'PAYSLIP') {
        this.payslipCounterFile += 1;
      }
      this._notificationService.success(message, 5000);
      this.annualIncomeDocDetail.find(element => { return element.type === documentType; }).uploaded = true;
      this.updateDropZoneSuccessMessage(documentType);
    }
  }

  updateDropZoneSuccessMessage(documentType: string) {
    this.annualIncomeDocDetail.find(element => { return element.type === documentType; }).message = this._domSanitizer.sanitize(SecurityContext.HTML,
      `${this.annualIncomeDocDetail.find(element => { return element.type === documentType; }).label}
      Uploaded
      <i class="fa fa-check margin-left-10" aria-hidden="true"></i>
      `);
  }

  showAccreditedInvestorPopUp() {
    this._modalService.open('accreditedInvestorOptOutDialog');
  }

  closeModal(id: string): void {
    if (id === 'accreditedDeclarationSuccess' || id === 'optOutDialogSuccess') {
      this._modalService.close('accreditedInvestorOptOutDialog');
    }
    this._modalService.close(id);
  }

  onAccreditedDeclarationSubmit() {
    if (this.isAnnualIncomeAccreditedCriteria) {
      const noaUploaded = this.annualIncomeDocDetail.find(element => { return element.type === 'NOA'; }).uploaded;
      const payslipUploaded = this.annualIncomeDocDetail.find(element => { return element.type === 'PAYSLIP'; }).uploaded;
      if (noaUploaded || payslipUploaded) {
        if (payslipUploaded && (this.payslipCounterFile !== 1 && this.payslipCounterFile !== this.payslipNumberOfMaximumFile)) {
          this._notificationService.error(this.payslipValidationMessage);
          return;
        }
        this.updateEntityDetail(this.entityCode.accredited);
      } else {
        this._notificationService.error(this.uploadDocumentValidationMessage);
      }
    } else {
      const bankStatementUploaded =
        this.annualIncomeDocDetail.find(element => { return element.type === 'BANK_STATEMENT'; }).uploaded;
      const titleDeedOfPropertyUploaded =
        this.annualIncomeDocDetail.find(element => { return element.type === 'TITLE_DEED_OF_PROPERTY'; }).uploaded;
      const investmentAccountStatementUploaded =
        this.annualIncomeDocDetail.find(element => { return element.type === 'INVESTMENT_ACCOUNT_STATEMENT'; }).uploaded;
      if (bankStatementUploaded || titleDeedOfPropertyUploaded || investmentAccountStatementUploaded) {
        this.updateEntityDetail(this.entityCode.accredited);
      } else {
        this._notificationService.error(this.uploadDocumentValidationMessage);
      }
    }
  }

  updateEntityDetail(newEntityCode: string) {
    if (newEntityCode === this.entityCode.retail) {
      this._modalService.open('accreditedInvestorOptOutDialog');
    }
    this._memberService.updateEntityDetail(this._authService.getMemberUUID(), newEntityCode)
      .subscribe(response => {
        if (newEntityCode === this.entityCode.retail) {
          this._modalService.open('optOutDialogSuccess');
        } else {
          this._modalService.open('accreditedDeclarationSuccess');
        }
        this._memberService
          .getLoginDetail()
          .subscribe(
            member => {
              this._authService.setmemberChangeRequestEntity(member.memberChangeRequestEntity);
              this.memberChangeRequestEntity = JSON.parse(this._authService.getMemberChangeRequestEntity());
              this.getInvestorAccreditedDeclarationStep();
              if (newEntityCode === this.entityCode.accredited) {
                this.currentStep = 2;
              }
            },
            error => {
              this._notificationService.error(error.message);
            });
      }, error => {
        this._notificationService.error(error.message);
      });
  }


}
