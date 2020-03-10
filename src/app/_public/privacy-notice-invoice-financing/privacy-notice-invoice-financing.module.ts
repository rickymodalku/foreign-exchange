// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { PrivacyNoticeInvoiceFinancingRouting } from './privacy-notice-invoice-financing.routing';

import { PrivacyNoticeInvoiceFinancingComponent } from './components/privacy-notice-invoice-financing.component';

@NgModule({
    declarations: [
        PrivacyNoticeInvoiceFinancingComponent,
    ],
    imports: [
        PrivacyNoticeInvoiceFinancingRouting,
        TranslateModule,
    ],

})

export class PrivacyNoticeInvoiceFinancingModule { }