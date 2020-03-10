import { of } from 'rxjs/observable/of';

export default class MockAuthService {
  investorReturnChart = [];
  investorOverview = [];
  investorActivities = [];
  accountSummary = [];
  constructor(params = null) {
    if (params) {
      if (params.investorReturnChart) {
        this.investorReturnChart = params.investorReturnChart;
      }
      if (params.accountSummary) {
        this.accountSummary = params.accountSummary;
      }
      if (params.investorActivities) {
        this.investorActivities = params.investorActivities;
      }
      if (params.investorOverview) {
        this.investorOverview = params.investorOverview;
      }
    }
  }

  getBearerToken() {
    let result = [];
    return of([result, result.length]);
  }

  getActivationStepCode() {
    let result = [];
    return of([result, result.length]);
  }


}
