import {
  Component,
  OnInit
} from '@angular/core';
import CONFIGURATION from '../../../configurations/configuration';

@Component({
  selector: 'statement',
  templateUrl: './statement.html'
})
export class StatementInvestorComponent implements OnInit {
  activeTab:string;
  CONFIGURATION: any;
  public constructor() {
    this.CONFIGURATION = CONFIGURATION;
  }

  ngOnInit() {
    window['Intercom']('trackEvent', 'Web_Viewed_Account_Statement');
    this.changeTab('monthly');
  }

  changeTab(tabName: string): void {
    this.activeTab = tabName;
  }

}
