// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SMEReferrealAgreementRouting } from './sme-referral-agreement.routing';

import { SMEReferrealAgreementComponent } from './components/sme-referral-agreement.component';

@NgModule({
    declarations: [
        SMEReferrealAgreementComponent,
    ],
    imports: [
      SMEReferrealAgreementRouting,
        TranslateModule,
    ],

})

export class SMEReferrealAgreementModule { }
