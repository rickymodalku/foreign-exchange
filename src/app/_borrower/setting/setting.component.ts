import {
    Component,
    OnInit
} from '@angular/core';
import {
    ActivatedRoute,
    Params
} from '@angular/router';

@Component({
    selector: 'setting',
    templateUrl: './setting.html'
})
export class SettingComponent implements OnInit {
    menu: any;

    public constructor(
        private _activatedRoute: ActivatedRoute
    ) {
        this.menu = {
            personal: false,
            password: true,
            bank: false
        };
    }

    ngOnInit() {
        this._activatedRoute
            .queryParams
            .subscribe((params: Params) => {
                this.changeTab(params['tab']);
            });
    }

    changeTab(tab: any): void {
      const tabMap = {
        0: 'password',
        1: 'bank',
        2: 'personal'
      };
      if (tab) {
        const tabName = tabMap[tab.index];
          if ( tabName in this.menu) {
            Object.keys(this.menu).forEach((key) => {
              this.menu[key] = (key === tabName);
              if (key === tabName) {
              }
            });
          }
      }
    }
}
