import {
    Component,
    OnInit
} from '@angular/core';
import CONFIGURATION from '../../../configurations/configuration';
import { DepositIDComponent } from './deposit-id.component';
import { DepositMYSGComponent } from './deposit-mysg.component';


@Component({
    selector: 'deposit',
    templateUrl: './deposit.html'
})
export class DepositComponent {
    CONFIGURATION: any;
    constructor() {
      this.CONFIGURATION = CONFIGURATION;
    }
}