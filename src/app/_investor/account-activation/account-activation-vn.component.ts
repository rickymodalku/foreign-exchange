import {
    Component,
    OnInit
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import CONFIGURATION from '../../../configurations/configuration';

@Component({
    selector: 'account-activation-vn',
    templateUrl: './account-activation-vn.html'
})
export class AccountActivationVNComponent implements OnInit {
    activationStepCode: Array<any>;
    currentStep: string;
    lastStep: number;
    crowdfundtalkLink: string;
    public constructor(private _authService: AuthService) {
        this.activationStepCode = CONFIGURATION.activation_step_code;
        this.crowdfundtalkLink = CONFIGURATION.crowdfundtalkLinkActivation;
    }

    ngOnInit() {
        this.currentStep = this._authService.getActivationStepCode();
        if (this.currentStep === this.activationStepCode['null'] ||
            this.currentStep === this.activationStepCode['generic_questionnaire'] ||
            this.currentStep === this.activationStepCode['suitability_assessment_test']) {
            this.lastStep = 0;
        } else if ( this.currentStep === this.activationStepCode['fill_information']) {
            this.lastStep = 1;
        } else if ( this.currentStep === this.activationStepCode['sign_econtract'] ||
                    this.currentStep === this.activationStepCode['send_econtract']) {
            this.lastStep = 2;
        } else if ( this.currentStep === this.activationStepCode['escrow_agent']) {
            this.lastStep = 3;
        } else if ( this.currentStep === this.activationStepCode['first_deposit'] ||
                    this.currentStep === this.activationStepCode['deposit'] ||
                    this.currentStep === this.activationStepCode['activated']) {
            this.lastStep = 4;
        }
    }
}
