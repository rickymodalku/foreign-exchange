import { of } from 'rxjs/observable/of';

export default class MockFeatureFlagService {
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

  getInvestorReturnsChart(period: any) {
    let result = [];
    if (this.investorReturnChart) {
      result = this.investorReturnChart;
    }
    return of([result, result.length]);
  }

  getInvestorSummary() {
    let result = [];
    if (this.accountSummary) {
      result = this.accountSummary;
    }
    return of([result, result.length]);
  }

  getInvestorActivities() {
    let result = [];
    if (this.investorActivities) {
      result = this.investorActivities;
    }
    return of([result, result.length]);
  }

  getInvestorOverview() {
    let result = [];
    if (this.investorOverview) {
      result = this.investorOverview;
    }
    return of([result, result.length]);
  }


}
