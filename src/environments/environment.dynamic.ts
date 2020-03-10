import { ENVIRONMENT as staging } from './environment.staging';
import { ENVIRONMENT as uat } from './environment.uat';

class Environment {
  production: boolean;
  service: any;
  baseUrls: any;
  environment_name: string;
  enableSendingMixPanelEvents: boolean;
  sentry_logging: boolean;
  firebase: any;
  google: any;
  myinfo: any;
  governmentBondTradeable: any;
  boltLinkXero: string;
  yearInReviewLink: string;
  launch_darkly_client_id: string;
  selectedEnvironment: any;
  constructor(
  ) {
    if (window.localStorage.getItem('environment') === 'uat') {
      this.selectedEnvironment = uat;
    } else {
      this.selectedEnvironment = staging;
    }
    this.baseUrls = this.selectedEnvironment.baseUrls;
    this.environment_name = this.selectedEnvironment.environment_name;
    this.enableSendingMixPanelEvents = this.selectedEnvironment.enableSendingMixPanelEvents;
    this.sentry_logging = this.selectedEnvironment.sentry_logging;
    this.firebase = this.selectedEnvironment.firebase;
    this.google = this.selectedEnvironment.google;
    this.myinfo = this.selectedEnvironment.myinfo;
    this.governmentBondTradeable = this.selectedEnvironment.governmentBondTradeable;
    this.production = this.selectedEnvironment.production;
    this.boltLinkXero = this.selectedEnvironment.boltLinkXero;
    this.yearInReviewLink = this.selectedEnvironment.yearInReviewLink;
    this.launch_darkly_client_id = this.selectedEnvironment.launch_darkly_client_id;
    this.service = this.selectedEnvironment.service;
  }
}

export const ENVIRONMENT = new Environment();
