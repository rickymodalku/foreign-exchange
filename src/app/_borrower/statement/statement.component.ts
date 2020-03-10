import {
  Component,
  OnInit
} from '@angular/core';
import CONFIGURATION from '../../../configurations/configuration';

@Component({
  selector: 'statement',
  templateUrl: './statement.html'
})
export class StatementBorrowerComponent implements OnInit {
  activeTab:string;
  CONFIGURATION: any;
  public constructor() {
    this.CONFIGURATION = CONFIGURATION;
  }

  ngOnInit() {
    this.changeTab('invoice');
  }

  changeTab(tabName: string): void {
    this.activeTab = tabName;
  }

}
