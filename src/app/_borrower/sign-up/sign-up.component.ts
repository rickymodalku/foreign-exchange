import {
  Component,
  OnInit
} from '@angular/core';
import CONFIGURATION from '../../../configurations/configuration';
import { SignupFormBorrowerIDComponent } from './sign-up-id.component';
import { SignupFormBorrowerSGComponent } from './sign-up-sg.component';
import { SignupFormBorrowerMYComponent } from './sign-up-my.component';

@Component({
  selector: 'app-sign-up-form-borrower',
  templateUrl: './sign-up.html'
})
export class SignupFormBorrowerComponent {
  CONFIGURATION: any;
  constructor() {
    this.CONFIGURATION = CONFIGURATION;
  }
}
