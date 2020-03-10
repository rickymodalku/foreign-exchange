import {
    Component,
    OnInit
} from '@angular/core';
import CONFIGURATION from '../../../configurations/configuration';
import { AccountActivationIDComponent } from './account-activation-id.component';
import { AccountActivationMYComponent } from './account-activation-my.component';
import { AccountActivationSGComponent } from './account-activation-sg.component';


@Component({
    selector: 'account-activation',
    templateUrl: './account-activation.html'
})
export class AccountActivationComponent {
    CONFIGURATION: any;
    constructor() {
      this.CONFIGURATION = CONFIGURATION;
    }
}