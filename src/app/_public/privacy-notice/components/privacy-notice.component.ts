import { Component } from '@angular/core';
import CONFIGURATION from '../../../../configurations/configuration';

@Component({
  selector: 'privacy-notice',
  templateUrl: './privacy-notice.html'
})
export class PrivacyNoticeComponent {
  countryCode: string;

  constructor() {
    this.countryCode = CONFIGURATION.country_code;
  }
}
