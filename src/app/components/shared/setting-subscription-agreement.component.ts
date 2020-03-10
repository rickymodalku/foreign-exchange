import { Component, ViewChild, OnInit } from '@angular/core';
import { MemberService } from '../../services/member.service';
import CONFIGURATION from '../../../configurations/configuration';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { saveAs } from 'file-saver';
import { SGRiskDisclosureComponent } from '../../components/risk-disclosure/risk-disclosure.component';
import { SGSuitabilityAssessmentComponent } from '../../components/suitability-assessment/suitability-assessment.component';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage';
import { BaseParameterService } from '../../services/base-parameter.service';

@Component({
  selector: 'setting-subscription-agreement',
  templateUrl: './setting-subscription-agreement.html'
})


export class SettingSubscriptionAgreementComponent implements OnInit {
  countryCode: string;
  userSAFileName: string;
  @ViewChild('riskDisclosure', { static: false }) riskDisclosureModal: SGRiskDisclosureComponent;
  @ViewChild('suitabilityAssessment', { static: false }) suitabilityAssessmentModal: SGSuitabilityAssessmentComponent;
  riskDisclosureData: any;
  suitabilityAssessmentData: any;
  subscriptionAgreementFileName: any;
  conservativeType: number;
  investmentProfileType: any;
  dateFormat = CONFIGURATION.format.date;

  constructor(private _memberService: MemberService,
    private _authService: AuthService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _localStorageService: LocalStorageService,
    private _baseParameterService: BaseParameterService,
  ) {
    this.countryCode = CONFIGURATION.country_code;
    this.userSAFileName = (this._authService.getFullName()).replace(' ', '_') + '_SA.pdf';
    if (this.countryCode === 'SG') {
      this.riskDisclosureData = {
        signOfDate: null,
        isToExpire: false,
        isExpired: false
      };
      this.suitabilityAssessmentData = {
        assessmentDate: null,
        profile: null
      };
      this.investmentProfileType = new Array<any>();
      const conservative = this._baseParameterService.getInvestmentProfile().filter(profile => {
        return profile.name === 'conservative';
      })
      if (conservative) {
        this.conservativeType = Number(conservative[0].id);
      }
    }
    this.subscriptionAgreementFileName = {
      MY: 'User_Agreement.pdf',
      SG: 'Platform_Agreement.pdf',
      ID: 'Platform_Agreement.pdf'
    }

  }

  ngOnInit() {
    if (this.countryCode === 'SG') {
      this._translateService
        .get('investor-agreement.assessment.investment-type')
        .subscribe(
          investmentType => {
            for (const key in investmentType) {
              this.investmentProfileType.push({
                key: investmentType[key].key,
                value: investmentType[key].value
              });
            }
            this.checkReverificationReason();
          }
        );
    }
  }

  downloadUserLatestSA(): void {
    this._memberService.getUserLatestSA().subscribe(
      response => {
        const blob = new Blob([response._body], { type: 'application/pdf' });
        saveAs(blob, this.userSAFileName);
      },
      error => {
        this._notificationService.error();
      }
    );
  }

  downloadLatestBlankSA(): void {
    this._memberService.getLatestBlankSA(this.countryCode).subscribe(
      response => {
        const blob = new Blob([response._body], { type: 'application/pdf' });
        const fileName = this.subscriptionAgreementFileName[this.countryCode];
        saveAs(blob, fileName);
      },
      error => {
        this._notificationService.error();
      }
    );
  }

  openRiskDisclosure() {
    this.riskDisclosureModal.openRiskDisclosureModal();
  }

  openSuitabilityAssessment() {
    this.suitabilityAssessmentModal.openSuitabilityAssessmentModal(this.suitabilityAssessmentData.profileType,
      this.suitabilityAssessmentData.assessmentDate);
  }

  checkReverificationReason() {
    this._memberService.getMemberStatus()
      .subscribe(
        memberStatus => {
          const status = memberStatus.data;
          this._memberService.getReverificationReason()
            .subscribe(
              reverification => {
                const suitabilityAssessment = reverification.data.suitability_assessment;
                const riskDisclosure = reverification.data.risk_disclosure;
                this.suitabilityAssessmentData = {
                  assessmentDate: suitabilityAssessment.updated_at,
                  profileName: this.getSuitabilityAssessmentProfileName(suitabilityAssessment.type),
                  profileType: suitabilityAssessment.type
                };
                this.riskDisclosureData = {
                  signOfDate: riskDisclosure.risk_disclosure_agreement_accepted_at,
                  isToExpire: riskDisclosure.is_to_expire,
                  isExpired: riskDisclosure.is_expired
                };
                if (status.member_status.name === 'Reverification' || riskDisclosure.is_to_expire) {
                  this._localStorageService.store('reverification', true);
                } else {
                  this._localStorageService.store('reverification', false);
                }
                this._memberService.triggerMemberStatusRetrieval();
              },
              error => {
                this._notificationService.error();
              });
        },
        error => {
          this._notificationService.error();
        });
  }

  getSuitabilityAssessmentProfileName(type: string) {
    const profile = this.investmentProfileType.find(element => {
      return element.key === type;
    });
    return profile.value;
  }

  updateAssessmentInfo() {
    this.checkReverificationReason();
  }
}
