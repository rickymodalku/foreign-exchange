// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { TermConditionLoyaltyRouting } from './term-condition-loyalty.routing';

import { TermConditionLoyaltyComponent } from './components/term-condition-loyalty.component';

@NgModule({
    declarations: [
        TermConditionLoyaltyComponent,
    ],
    imports: [
        TermConditionLoyaltyRouting,
        TranslateModule
    ],
})

export class TermConditionLoyaltyModule { }
