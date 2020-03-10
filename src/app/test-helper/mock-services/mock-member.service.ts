import { of } from 'rxjs/observable/of';

export default class MockMemberService {
  memberDetail = [];
  memberRoyaltyDetail = [];
  constructor(params = null) {
    if (params) {
      if (params.memberDetail) {
        this.memberDetail = params.memberDetail;
      }
      if (params.memberRoyaltyDetail) {
        this.memberRoyaltyDetail = params.memberRoyaltyDetail;
      }
    }
  }

  getMemberRoyaltyDetail() {
    let result = [];
    if (this.memberRoyaltyDetail) {
      result = this.memberRoyaltyDetail;
    }
    return of([result, result.length]);
  }

  getMemberDetail() {
    let result = [];
    if (this.memberRoyaltyDetail) {
      result = this.memberRoyaltyDetail;
    }
    return of([result, result.length]);
  }
}
