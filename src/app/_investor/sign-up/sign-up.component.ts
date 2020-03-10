import {
  Component,
  OnInit
} from '@angular/core';
import CONFIGURATION from '../../../configurations/configuration';
import { SignupFormInvestorIDComponent } from './sign-up-id.component';
import { SignupFormInvestorSGComponent } from './sign-up-sg.component';
import { SignupFormInvestorMYComponent } from './sign-up-my.component';

@Component({
  selector: 'app-sign-up-form-investor',
  templateUrl: './sign-up.html'
})
export class SignupFormInvestorComponent {
  CONFIGURATION: any;
  constructor() {
    this.CONFIGURATION = CONFIGURATION;
  }
}
