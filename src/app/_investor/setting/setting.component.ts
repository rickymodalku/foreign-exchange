import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';
import CONFIGURATION from '../../../configurations/configuration';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { UtilityService } from '../../services/utility.service';
import { LocalStorageService } from 'ngx-webstorage';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'setting',
  templateUrl: './setting.html'
})
export class SettingComponent implements OnInit {
  menu: Array<string>;
  selectedTab: any;
  countryCode: string;
  showInvestorAccreditedDeclarationBanner: boolean;
  showPriorityInvestmentTab: boolean;
  showWarning: boolean;

  public constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _baseParameterService: BaseParameterService,
    private _router: Router,
    private _utilityService: UtilityService,
    private _memberService: MemberService,
    private _localStorageService: LocalStorageService,
  ) {
    this.countryCode = CONFIGURATION.country_code;
    this.showInvestorAccreditedDeclarationBanner = false;
    this.showPriorityInvestmentTab = false;
    this.showWarning = false;
  }

  ngOnInit() {
    this.showInvestorAccreditedDeclarationBanner = this._authService.getMemberEntityCode()
      === this._baseParameterService.getMemberEntityCode().retail;
    this.menu = [
      'auto-investment',
      'bank',
      'personal',
      'change-password',
    ];
    if (this.countryCode === 'SG' && this.showInvestorAccreditedDeclarationBanner) {
      this.menu.splice(1, 0, 'accredited-declaration');
    }
    if (this.countryCode === 'MY') {
      this.menu.push('user-agreement');
    } else {
      this.menu.push('subscription-agreement');
    }
    window['Intercom']('trackEvent', 'Web_Viewed_Account_Settings');
    this._activatedRoute.params.subscribe((params: Params) => {
      if (this.countryCode === 'MY') {
        this._memberService.getMemberDetail()
          .subscribe(member => {
            if (member.faMember && member.faMemberId) {
              this.showPriorityInvestmentTab = true;
              if (this.menu.indexOf('priority-investment') < 0) {
                this.menu.splice(1, 0, 'priority-investment');
              }
            }
            if (params['tab']) {
              this.changeTab(params['tab']);
            } else {
              this.onTabChange('');
            }
          });
      } else {
        if (params['tab']) {
          this.changeTab(params['tab']);
        } else {
          this.onTabChange('');
        }
      }
    });
    this._memberService
      .memberStatusEventEmitter
      .subscribe(
        response => {
          if (this.countryCode === 'SG') {
            this.showWarning = this._localStorageService.retrieve('reverification');
          }
        }
      );
  }

  onTabChange(tab: any) {
    this.changeTab(this.menu[tab.index], true);
  }

  changeTab(tabName: string = '', isFromTab: boolean = false): void {
    if (tabName === '') {
      this.selectedTab = 0;
      tabName = this.menu[this.selectedTab];
    } else {
      this.selectedTab = this.menu.indexOf(tabName);
    }
    if (isFromTab) {
      this._router.navigate(['/admin-investor/setting/' + tabName]);
    }
  }
}
