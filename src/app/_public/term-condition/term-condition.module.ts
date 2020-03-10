// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { TermConditionRouting } from './term-condition.routing';

import { TermConditionComponent } from './components/term-condition.component';

@NgModule({
    declarations: [
        TermConditionComponent,
    ],
    imports: [
        TermConditionRouting,
        TranslateModule
    ],
})

export class TermConditionModule { }