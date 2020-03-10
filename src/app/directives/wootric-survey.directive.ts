import { Directive, AfterViewInit, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MemberService } from '../services/member.service';
import CONFIGURATION from '../../configurations/configuration';

@Directive({
  selector: 'wootric-survey'
})
export class WootricSurveyDirective implements AfterViewInit {
  wootricToken = CONFIGURATION.wootricToken;
  memberActivationStatus: string;

  constructor(private _authService: AuthService, private _memberService: MemberService, private elementRef: ElementRef) {
    this.memberActivationStatus = this._authService.getActivationStepCode();
    const signupDate = new Date(this._authService.getActivatedAt());
    const signupDateTime = Math.floor(signupDate.getTime() / 1000);
    if (this.memberActivationStatus === CONFIGURATION.activation_step_code.activated) {
      // window['wootric_survey_immediately'] = true;
      // window['wootric_no_surveyed_cookie'] = true;
      const wootricSettings = {
        email: this._authService.getUserName(),
        created_at: signupDateTime,
        account_token: this.wootricToken
      };
      window['wootricSettings'] = wootricSettings;
      const customWootricEvent = new CustomEvent('wootricSettingReady', {
        detail: wootricSettings
      });

      window.dispatchEvent(customWootricEvent);
    }
  };

  ngAfterViewInit() {
    if (this.memberActivationStatus === CONFIGURATION.activation_step_code.activated) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://cdn.wootric.com/wootric-sdk.js';
      script.async = true;
      script.onload = function () {
        const wootricSettingReadyCallback = function (data) {
          window['WootricSurvey'].run(window['wootricSettings']);
        };
        window.removeEventListener('wootricSettingReady', wootricSettingReadyCallback, false);
        window.addEventListener('wootricSettingReady', wootricSettingReadyCallback, false);
      };
      this.elementRef.nativeElement.appendChild(script);
    }
  }
}
