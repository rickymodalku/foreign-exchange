// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { WebsiteTermsRouting } from './website-terms.routing';

import { WebsiteTermsComponent } from './components/website-terms.component';

@NgModule({
    declarations: [
        WebsiteTermsComponent,
    ],
    imports: [
        WebsiteTermsRouting,
        TranslateModule
    ],
})

export class WebsiteTermsModule { }
