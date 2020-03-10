// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { PrivacyNoticeRouting } from './privacy-notice.routing';

import { PrivacyNoticeComponent } from './components/privacy-notice.component';

import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        PrivacyNoticeComponent,
    ],
    imports: [
        PrivacyNoticeRouting,
        TranslateModule,
        CommonModule
    ],

})

export class PrivacyNoticeModule { }
