import { of } from 'rxjs/observable/of';

export default class MockNotificationService {
  errorMessage = '';
  constructor(params = null) {
    if (params) {
      if (params.errorMessage) {
        this.errorMessage = params.errorMessage;
      }
    }
  }

  success(message: string) {
  }

  info(message: string) {
  }

  error(message: string = this.errorMessage) {
  }


}
