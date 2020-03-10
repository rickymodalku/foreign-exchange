import { Component, OnInit } from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { NotificationService } from '../../../services/notification.service';
import CONFIGURATION from '../../../../configurations/configuration';

@Component({
  selector: 'platform-agreement',
  templateUrl: './platform-agreement.html'
})
export class PlatformAgreementComponent implements OnInit {
  platformAgreementHtml: string;
  constructor(private memberService: MemberService,
    private notificationService: NotificationService) {
    this.platformAgreementHtml = '';
  }

  ngOnInit() {
    this.memberService
      .getPlatformAgreement(CONFIGURATION.country_code)
      .subscribe(
        platformAgreement => {
          this.platformAgreementHtml = platformAgreement.data.content;
        },
        error => {
          this.notificationService.error();
        });
  }
}
