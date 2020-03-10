import { Injectable } from '@angular/core';
import CONFIGURATION from '../../configurations/configuration';
import { AuthService } from './auth.service';
import { BaseParameterService } from './base-parameter.service';
import { ENVIRONMENT } from '../../environments/environment';

@Injectable()
export class EventService {
  CONFIGURATION: any;
  signUpCredentials: any;
  eventDataTagged: boolean;
  constructor(
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService
  ) {
    this.eventDataTagged = false;
  }

  sendAAEvent(step, loanType) {
    this.sendEvent(step, this._baseParameterService.getAutoInvestEvents(), loanType);
  }

  sendLoanEvent(step, loanType) {
    this.sendEvent(step, this._baseParameterService.getNewLoanEvents(), loanType);
  }

  sendHomePagePromoBanner(event) {
    this.sendEvent(event, this._baseParameterService.getHomePagePromoEvents());
  }

  sendSbnEvent(step) {
    this.sendEvent(step, this._baseParameterService.getSbnEvents());
  }

  sendInvSignupEvent(step, signUpSource = {}) {
    this.sendEvent(step, this._baseParameterService.getInvSignUpEvents(), signUpSource);
  }

  sendInvActivationEvent(step) {
    this.sendEvent(step, this._baseParameterService.getInvActivationEvents());
  }

  sendBrwSignupEvent(step) {
    this.sendEvent(step, this._baseParameterService.getBrwSignUpEvents());
  }

  sendInvWalletEvents(step) {
    this.sendEvent(step, this._baseParameterService.getInvWalletEvents());
  }

  private sendEvent(event, events, properties?) {
    if (ENVIRONMENT.enableSendingMixPanelEvents) {
      if (events.includes(event)) {
        this.setUserAttributes();
        const eventString = `${CONFIGURATION.country_code}-${event}`;
        if (properties) {
          window['mixpanel'].track(eventString, properties);
        } else {
          window['mixpanel'].track(eventString);
        }
      } else {
        console.log(`No event found for ${event}`);
      }
    }
  }

  private getUserName() {
    const signUpCredentials = this._authService.getSignUpCredential();
    if (signUpCredentials !== null) {
      return signUpCredentials.userName;
    } else {
      return;
    }
  }

  private setUserAttributes() {
    if (!this.eventDataTagged) {
      const userName = this.getUserName();
      if (userName !== null) {
        window['mixpanel'].alias(userName);
        this.eventDataTagged = true;
      } else {
        return;
      }
    }
  }
}
