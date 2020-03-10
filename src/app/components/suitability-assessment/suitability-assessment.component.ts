import { Component, OnInit, Output, Renderer2, EventEmitter } from '@angular/core';
import CONFIGURATION from '../../../configurations/configuration';
import { ModalService } from 'app/services/modal.service';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service'
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'sg-suitability-assessment',
  templateUrl: './suitability-assessment.html'
})
export class SGSuitabilityAssessmentComponent implements OnInit {
  countryCode: string;
  showOverlayForm: boolean;
  selectedInvestmentProfileType: string;
  selectedInvestmentProfile: number;
  investmentProfileType: Array<any>;
  investmentProfileAggressiveListData: Array<any>;
  investmentProfileBalancedListData: Array<any>;
  investmentProfileConservativeListData: Array<any>;
  currentProfile: any;
  dateFormat = CONFIGURATION.format.date;
  @Output('onAssessmentSuccess') onAssessmentSuccess = new EventEmitter<any>();

  constructor(
    private _modalService: ModalService,
    private _router: Router,
    private _translateService: TranslateService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _renderer: Renderer2,
    private _authService: AuthService,
    private _localStorageService: LocalStorageService,
  ) {
    this.countryCode = CONFIGURATION.country_code;
    this.showOverlayForm = false;
    this.selectedInvestmentProfileType = '';
    this.investmentProfileType = new Array<any>();
    this.investmentProfileConservativeListData = new Array();
    this.investmentProfileAggressiveListData = new Array();
    this.investmentProfileBalancedListData = new Array();
    this.currentProfile = {
      profile: '',
      date: ''
    };
  }

  ngOnInit() {
    this._translateService
      .get('investor-agreement.assessment.investment-profile.content.0.content')
      .subscribe(
        investmentProfileConservativeListData => {
          for (let key in investmentProfileConservativeListData) {
            this.investmentProfileConservativeListData.push({
              value: investmentProfileConservativeListData[key]['value'],
            });
          }
        });

    this._translateService
      .get('investor-agreement.assessment.investment-profile.content.1.content')
      .subscribe(
        investmentProfileBalancedListData => {
          for (let key in investmentProfileBalancedListData) {
            this.investmentProfileBalancedListData.push({
              value: investmentProfileBalancedListData[key]['value'],
            });
          }
        });

    this._translateService
      .get('investor-agreement.assessment.investment-profile.content.2.content')
      .subscribe(
        investmentProfileAggressiveListData => {
          for (let key in investmentProfileAggressiveListData) {
            this.investmentProfileAggressiveListData.push({
              value: investmentProfileAggressiveListData[key]['value'],
            });
          }
        });

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
        }
      );
  }

  openSuitabilityAssessmentModal(profile: string, assessmentDate: string) {
    this.showOverlayForm = true;
    this.currentProfile = {
      profile: this.getSuitabilityAssessmentProfileName(profile),
      assessmentDate: assessmentDate
    };
    this._renderer.addClass(document.body, 'no-scroll');
    this._renderer.addClass(document.body, 'modal-open-fix-for-ios');
  }

  closeSuitabilityAssessment() {
    this._renderer.removeClass(document.body, 'no-scroll');
    this._renderer.removeClass(document.body, 'modal-open-fix-for-ios');
    this.showOverlayForm = false;
  }

  onSuitabilityAssessmentDescriptionPopup(type: string) {
    this.selectedInvestmentProfileType = type;
    this.openModal('suitabilityAssessmentModal');
  }

  onSuitabilityAssessmentSubmit(type: string) {
    this.selectedInvestmentProfile = this.investmentProfileType.find(element => {
      return element.value === type;
    });
  }

  onAssessmentSubmit() {
    if (!this.selectedInvestmentProfile) {
      this._notificationService.info('Please select your investment profile');
    } else {
      this._memberService.saveSuitabilityAssessment({
        memberId: this._authService.getMemberId(),
        type: this.selectedInvestmentProfile['key'],
        pic: this._authService.getUserName()
      })
      .subscribe(
        response => {
          this.closeSuitabilityAssessment();
          this.onAssessmentSuccess.emit();
          this._router.navigate(['/admin-investor/setting/subscription-agreement']);
        },
        error => {
          this._notificationService.error(error.message);
          this.closeSuitabilityAssessment();
        }
      );
    }
  }

  getSuitabilityAssessmentProfileName(type: string) {
    const profile = this.investmentProfileType.find(element => {
      return element.key === type;
    });
    return profile.value;
  }

  openModal(id: string): void {
    this._modalService.open(id);
  }

  closeModal(id: string): void {
    this._modalService.close(id);
  }
}
