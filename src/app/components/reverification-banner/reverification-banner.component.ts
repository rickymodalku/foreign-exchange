import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import CONFIGURATION from '../../../configurations/configuration';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { SGRiskDisclosureComponent } from '../../components/risk-disclosure/risk-disclosure.component';
import { SGSuitabilityAssessmentComponent } from '../../components/suitability-assessment/suitability-assessment.component';
import { LocalStorageService } from 'ngx-webstorage';
import { BaseParameterService } from '../../services/base-parameter.service';

@Component({
  selector: 'sg-reverification-banner',
  templateUrl: './reverification-banner.html'
})
export class SGReverificationBannerComponent implements OnInit {
  countryCode: string;
  memberDetail: any;
  reverificationContent: any;
  conservativeType: number;
  @ViewChild('riskDisclosure', { static: false }) riskDisclosureModal: SGRiskDisclosureComponent;
  @ViewChild('suitabilityAssessment', { static: false }) suitabilityAssessmentModal: SGSuitabilityAssessmentComponent;

  constructor(
    private _translateService: TranslateService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _localStorageService: LocalStorageService,
    private _baseParameterService: BaseParameterService,
  ) {
    this.countryCode = CONFIGURATION.country_code;
    this.reverificationContent = {
      riskDisclosureContent: null,
      suitabilityAssessmentContent: null,
      content: null,
      currentReverification: '',
      assessmentDate: '',
      type: ''
    };
    const conservative = this._baseParameterService.getInvestmentProfile().filter(profile => {
      return profile.name === 'conservative';
    })
    if (conservative) {
      this.conservativeType = Number(conservative[0].id);
    }
  }

  ngOnInit() {
    if (this.countryCode === 'SG') {
      this._translateService
        .get('investor-dashboard.reverification')
        .subscribe(
          response => {
            this.reverificationContent.riskDisclosureContent = response['risk-disclosure'];
            this.reverificationContent.suitabilityAssessmentContent = response['suitability-assessment'];
            this._memberService.getMemberStatus()
              .subscribe(
                memberStatus => {
                  const status = memberStatus.data;
                  this._memberService.getReverificationReason()
                    .subscribe(
                      reverification => {
                        const suitabilityAssessment = reverification.data.suitability_assessment;
                        const riskDisclosure = reverification.data.risk_disclosure;
                        const popupShowed = this._localStorageService.retrieve('riskDisclosurePopup');
                        if (Number(suitabilityAssessment.type) === this.conservativeType &&
                          status.member_status.name === 'Reverification') {
                          this.reverificationContent.content = this.reverificationContent.suitabilityAssessmentContent;
                          this.reverificationContent.assessmentDate = suitabilityAssessment.updated_at;
                          this.reverificationContent.type = suitabilityAssessment.type;
                          this.reverificationContent.currentReverification = 'suitability-assessment';
                          this._localStorageService.store('reverification', true);
                        } else if (riskDisclosure.is_expired && status.member_status.name === 'Reverification') {
                          this.reverificationContent.content = this.reverificationContent.riskDisclosureContent;
                          this.reverificationContent.currentReverification = 'risk-disclosure';
                          this._localStorageService.store('reverification', true);
                        } else if (riskDisclosure.is_to_expire && status.member_status.name !== 'Reverification' &&
                          !riskDisclosure.is_expired) {
                          this._localStorageService.store('reverification', true);
                          if (!popupShowed) {
                            this.reverificationContent.currentReverification = 'risk-disclosure-grace-period';
                            this.openPopup();
                          }
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
        );
    }
  }

  openPopup() {
    if (this.reverificationContent.currentReverification === 'suitability-assessment') {
      this.suitabilityAssessmentModal.openSuitabilityAssessmentModal(this.reverificationContent.type,
        this.reverificationContent.assessmentDate);
    } else if (this.reverificationContent.currentReverification === 'risk-disclosure') {
      this.riskDisclosureModal.openRiskDisclosureModal();
    } else if (this.reverificationContent.currentReverification === 'risk-disclosure-grace-period') {
      this.riskDisclosureModal.openRiskDisclosureModal('grace-period');
    }
  }
}
