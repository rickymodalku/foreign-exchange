// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { RiskDisclosureRouting } from './risk-disclosure.routing';

import { RiskDisclosureComponent } from './components/risk-disclosure.component';

@NgModule({
    declarations: [
        RiskDisclosureComponent
    ],
    imports: [
        RiskDisclosureRouting,
        TranslateModule
    ],
})

export class RiskDisclosureModule { }
