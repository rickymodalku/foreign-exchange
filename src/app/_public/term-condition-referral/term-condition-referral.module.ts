// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { TermConditionReferralRouting } from './term-condition-referral.routing';

import { TermConditionReferralComponent } from './components/term-condition-referral.component';

@NgModule({
    declarations: [
        TermConditionReferralComponent
    ],
    imports: [
        TermConditionReferralRouting,
        TranslateModule
    ],
})

export class TermConditionReferralModule { }