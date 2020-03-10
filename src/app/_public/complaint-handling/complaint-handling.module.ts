// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ComplaintHandlingRouting } from './complaint-handling.routing';

import { ComplaintHandlingComponent } from './components/complaint-handling.component';

@NgModule({
    declarations: [
        ComplaintHandlingComponent,
    ],
    imports: [
      ComplaintHandlingRouting,
        TranslateModule
    ],
})

export class ComplaintHandlingModule { }
