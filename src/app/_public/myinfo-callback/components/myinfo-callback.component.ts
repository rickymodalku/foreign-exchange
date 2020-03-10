import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  Router
} from '@angular/router';

import CONFIGURATION from '../../../../configurations/configuration';
import { TranslateService } from '@ngx-translate/core';
import { MemberService } from '../../../services/member.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { BaseParameterService } from '../../../services/base-parameter.service';
import { SecurityService } from '../../../services/security.service';
import { MyInfo } from '../../../models/member.class';
@Component({
  selector: 'myinfo',
  templateUrl: './myinfo-callback.html'
})
export class MyInfoCallbackComponent implements OnInit {
  myInfoMapping: Object;
  constructor(
    private _memberService: MemberService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _baseParameterService: BaseParameterService
  ) {
    this.myInfoMapping = {
      username: 'userName',
      member_type: 'memberTypeCode',
      member_token: 'token',
    };
  }

  ngOnInit() {
    const signUpCredential = this._authService.getSignUpCredential();
    let myInfoPayload = new MyInfo();
    Object.keys(this.myInfoMapping).forEach( key => {
      myInfoPayload[key] = signUpCredential[this.myInfoMapping[key]];
    });

    this._activatedRoute
    .queryParams
    .subscribe((params: Params) => {
        const myInfoCallbackParams = Object.keys(params);
        if (myInfoCallbackParams.includes('errorcode')) {
          this.goToMyInfoError();
        } else if ( myInfoCallbackParams.includes('error')) {
          this.goToMyInfoError();
        } else if (myInfoCallbackParams.includes('code')) {
          const authCode = params.code;
          myInfoPayload = Object.assign(myInfoPayload, {
            'country_code': CONFIGURATION.country_code,
            'code': params.code,
            'attributes': this._baseParameterService
              .getMyInfoSelectedAttributes(signUpCredential[this.myInfoMapping['member_type']].toLocaleLowerCase()).join(',')
          });
          this._memberService.getMemberInfo(myInfoPayload, this._authService.getMemberTypeCode()).subscribe(
            response => {
              this._memberService.myInfoData = response.data;
              if (response && response.status === 'OK') {
                this._router.navigate(['/sign-up/forms/borrower'], {
                  queryParams : {
                    myinfo_success: true
                  }
                });
              } else {
                this._notificationService.error();
                this.goToMyInfoError();
              }
            }, error => {
              this._notificationService.error();
              this.goToMyInfoError();
            }
          );
        }
    }
  );
  }

  goToMyInfoError() {
    this._router.navigate(['/sign-up/forms/borrower'], {
      queryParams : {
        myinfo_success: false
      }
    });
  }
}
