import { of } from 'rxjs/observable/of';

export default class MockUtilityService {
  errorMessage = '';
  constructor(params = null) {
    if (params) {
      if (params.errorMessage) {
        this.errorMessage = params.errorMessage;
      }
    }
  }


  capitalizeFirstLetter(sentence: string) {
  }

  formatDecimal(value: number, digitsInfo) {
  }

  convertDateToISOString(date: Date) {
  }

  onShowInvestorAccreditedDeclarationBanner() {
  }

  stripTimeZoneFromDate(date: Date) {
  }

  getDeviceDetail() {
  }

  moveSpecificArrayToTop(data: any, key: any, comparedKey: any, ) {
  }

  truncateDecimal(value: number, precision: number) {

  }

  sortByKey(data: any, sortType: string, key: string) {

  }

  shiftElementToTheTopOfArray(data: Array<any>) {
  }

  getCampaignParameter(params: any, excludeParam: string) {

  }

}
