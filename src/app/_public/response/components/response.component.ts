import { OnInit, Component } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { Rating } from '../../../models/feedback.class';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from 'ngx-webstorage';
import { UtilityService } from '../../../services/utility.service';
import { SecurityService } from '../../../services/security.service';
import { UserService } from '../../../services/user.service';
import CONFIGURATION from '../../../../configurations/configuration';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
@Component({
  selector: 'response',
  templateUrl: './response.html'
})
export class ResponseComponent implements OnInit {
  feedbackList: Array<Rating>;
  responseModel: any;
  translatedResponse: any;
  showOverviewButton: boolean;
  showFeedbackButton: boolean;
  memberTypeCodes: object;
  feedbackCategories = [
    // If we need to add a new category here, we need to update firebase and backend API
    'website_overall_look',
    'mobile_website_overall_look',
    'platform_speed',
    'quality_and_depth_of_dashboard',
  ];

  constructor(private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _authService: AuthService,
    private _localStorageService: LocalStorageService,
    private _securityService: SecurityService,
    private _utilityService: UtilityService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _userService: UserService,
  ) {
    this.showOverviewButton = false;
    this.showFeedbackButton = true;
    this.memberTypeCodes = CONFIGURATION.member_type_code;
    this.feedbackList = new Array();
    this.responseModel = {
      comment: ''
    };
  }

  ngOnInit() {
    this._translateService
      .get('response')
      .subscribe(
        response => {
          this.translatedResponse = response;
          this.feedbackList = this.feedbackCategories.map(category => {
            return {
              category,
              title: this.translatedResponse['feedback-category-mapping'][category],
              value: 0,
            };
          });
        });
  }

  saveFeedback() {
    window.scrollTo(0, 0);
    let valid = false;
    for (const feedback of this.feedbackList) {
      if (feedback.value > 0) {
        valid = true;
      }
    }
    const authenticated = this._authService.isLoggedIn();
    const userName = this._authService.getUserName() || this._authService.getTmpLogoutUsername();
    const country = CONFIGURATION.country_code.toLowerCase();
    const feedbacks = this.feedbackList.map(feedback => ({
      category: feedback.category,
      value: feedback.value,
    }));

    if (!valid) {
      this._notificationService.info(this.translatedResponse['input-feedback']);
    } else {
      this._userService
        .sendFeedback(authenticated, feedbacks, this.responseModel.comment, country, userName)
        .subscribe(
          response => {
            this._notificationService.success(this.translatedResponse['feedback-success']);
            if ( !this._authService.isLoggedIn()) {
              setTimeout( () => this._router.navigate(['/']), 3000)
            } else {
              setTimeout( () => this.goOverview(), 2000, this)
            }
          },
          error => {
            this._notificationService.error(error);
          });
    }
  }

  selectRating(feedback: any, index: number) {
    feedback.value = index;
  }

  goOverview() {
    const memberTypeCode = this._authService.getMemberTypeCode();
    if ( memberTypeCode && memberTypeCode === this.memberTypeCodes['investor'] ) {
      this._router.navigate(['admin-investor/overview']);
    } else if ( memberTypeCode && memberTypeCode === this.memberTypeCodes['borrower']) {
      this._router.navigate(['admin-borrower/overview']);
    } else {
      this._router.navigate(['/']);
    }
  }
}
