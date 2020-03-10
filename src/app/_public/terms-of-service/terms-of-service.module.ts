// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { TermsOfServiceRouting } from './terms-of-service.routing';

import { TermsOfServiceComponent } from './components/terms-of-service.component';

@NgModule({
    declarations: [
        TermsOfServiceComponent,
    ],
    imports: [
        TermsOfServiceRouting,
        TranslateModule
    ],
})

export class TermsOfServiceModule { }