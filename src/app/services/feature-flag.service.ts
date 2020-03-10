import { Injectable } from '@angular/core';
import { ENVIRONMENT } from '../../environments/environment';
import CONFIGURATION from '../../configurations/configuration';
import {ReplaySubject, Observable } from 'rxjs/Rx';
import { initialize, LDClient, LDFlagSet } from 'launchdarkly-js-client-sdk';
import { AuthService } from './auth.service';
import { MessageService } from './message.service';


declare var TextEncoder: any;

/* The following code can be copied to another component to integrate with the
 feature flag.

    const { ctos } = this.featureFlagService.getFeatureFlagKeys();
    this.featureFlagObservable = this.featureFlagService.getFeatureFlagObservable();
    this.featureFlagObservable.subscribe( (flags) => {
      this.enableCtos = flags[ctos];
    });
*/


@Injectable()
export class FeatureFlagService {
  ldClient: LDClient;
  flags: LDFlagSet;
  flagChangedMessage: ReplaySubject<LDFlagSet> = new ReplaySubject();
  messageServiceObservable: Observable<any>;
  enableFlagDebug: Boolean = false;
  featureFlagKeys: any;

  constructor(
    private authService :  AuthService ,
    private messageService: MessageService
    ) {
    this.featureFlagKeys = Object.freeze({
      afpiLogo: 'afpi-logo',
      ojkStatistic: 'ojk-statistic',
      idLocalPerformance: 'id-local-performance',
      sgLocalPerformance: 'sg-local-performance',
      myLocalPerformance: 'my-local-performance',
      twoFa: 'two-fa',
      xero: 'xero',
      fpx: 'fpx',
      yearInReview: 'year-in-review',
      sgOneMapAutoPopulate: 'sg-one-map-auto-populate',
      idFormStackBorrower: 'id-form-stack-borrower'
    });
    this.flags = {};
    this.messageServiceObservable = this.messageService.getLoginSubject();
    this.messageServiceObservable.subscribe((event) => {
      if (event === 'initializeLdClient') {
        this.initializeLdClient();
      }
    });
  }
  async getUser() {
    const countryCode = CONFIGURATION.country_code;
    const username = this.authService.getUserName();
    if (!countryCode) {
      return false;
    }
    const userInfo = [username, countryCode, 'launchdarkly'].join('-');
    const hexUserId = await this.digestMessage(userInfo);
    return {
      key: hexUserId,
      email: username || '',
      country: countryCode,
      privateAttributeNames: ['email']
    };
  }

  async initializeLdClient() {
    const user = await this.getUser();
    if(!user) {
      if(this.enableFlagDebug) {
        console.info('No user is found')
      }
      return;
    }
    this.ldClient = initialize(ENVIRONMENT.launch_darkly_client_id, user, {
      bootstrap: 'localStorage'
    });
    this.ldClient.on('ready', () => {
      this.setFlags(this.ldClient.allFlags());
    });
    this.ldClient.on('change', (flags) => {
      this.setFlags(flags, true);
    });
  }

  async digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
  }

  setFlags(flags, change = false) {
    if (change) {
      const changes = {};
      Object.entries(flags).forEach(([key, value]) => {
        changes[key] = value['current'];
      });
      this.flags = Object.assign(this.flags, changes);
    } else {
      this.flags = Object.assign(this.flags, flags);
    }
    if (this.enableFlagDebug) {
      console.log('change -> flags: \n', JSON.stringify(this.flags, null, 2));
    }
    this.flagChangedMessage.next(this.flags);
  }

  getFeatureFlagKeys() {
    return this.featureFlagKeys;
  }

  getFeatureFlagObservable() {
    return this.flagChangedMessage.asObservable();
  }

  closeLdClient() {
    if (this.ldClient) {
      this.ldClient.close();
    }
  }
}
