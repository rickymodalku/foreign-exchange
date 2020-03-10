import {
    Component,
    OnInit
} from '@angular/core';
import CONFIGURATION from '../../../configurations/configuration';
import { AgreementMYComponent } from './agreement-my.component';
import { AgreementSGComponent } from './agreement-sg.component';


@Component({
    selector: 'agreement',
    templateUrl: './agreement.html'
})
export class AgreementComponent {
    CONFIGURATION: any;
    constructor() {
      this.CONFIGURATION = CONFIGURATION;
    }
}