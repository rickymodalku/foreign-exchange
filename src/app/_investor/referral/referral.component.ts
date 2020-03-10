
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FinanceService } from '../../services/finance.service';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ReferralService } from '../../services/referral.service';
import CONFIGURATION from '../../../configurations/configuration';

@Component({
  selector: 'referral-investor',
  templateUrl: './referral.html'
})
export class ReferralInvestorComponent implements OnInit {
  countryCode: string;
  memberDetail: any;
  memberTypeCodes: any;
  referralModel: any;

  constructor(
    private _authService: AuthService,
    private _financeService: FinanceService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _referralService: ReferralService) {
    this.memberDetail = {
      isVip: '',
      exposure: 0
    };
    this.memberTypeCodes = CONFIGURATION.member_type_code;
    this.referralModel = {
      investorLink: CONFIGURATION.referralLink.investor,
      code: this._authService.getReferralCode(),
      hnwiTermCondition: new Array<any>()
    };
    this.countryCode = CONFIGURATION.country_code;
  }


  ngOnInit() {
    this._translateService
      .get('referral')
      .subscribe(
        labels => {
          this.referralModel.copiedMessage = labels['copied'];
          this.referralModel.sharedTitle = labels['shared-title'];
          this.referralModel.hnwiTermCondition = labels['hnwi-term-condition'];
        }
      );

    observableForkJoin(
      this._financeService.getInvestorOverview(),
      this._memberService.getMemberDetail()).subscribe(
        response => {
          this.memberDetail.exposure = response[0].value.investor_exposure;
          this.memberDetail.isVip = response[1].isVip;
        },
        error => {
          this._notificationService.error();
        });
  }

  getMemberTypeCode(): string {
    return this._authService.getMemberTypeCode();
  }


  onCopyToClipboard(): void {
    this._notificationService.success(this.referralModel.copiedMessage);
  }

  showVIPReferralPage() {
    return this.countryCode === 'MY' ? this.memberDetail.exposure > 50000 || this.memberDetail.isVip : false;
  }

  share(platform: string): void {
    let referralLink = this.referralModel.investorLink + this.referralModel.code;
    switch (platform) {
      case 'facebook':
        this._referralService.shareOnFacebook(referralLink);
        break;
      case 'google-plus':
        this._referralService.shareOnGooglePlus(referralLink);
        break;
      case 'linked-in':
        this._referralService.shareOnLinkedIn(referralLink, this.referralModel.sharedTitle);
        break;
      case 'twitter':
        this._referralService.shareOnTwitter(referralLink);
        break;
    }
  }

}
