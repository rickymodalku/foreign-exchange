import { of } from 'rxjs/observable/of';

export default class MockMenuService {
  constructor(params = null) {
    if (params) {
    }
  }
  displayMenu() {
    return true;
  }

}
