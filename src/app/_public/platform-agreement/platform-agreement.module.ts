// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PlatformAgreementRouting } from './platform-agreement.routing';
import { PlatformAgreementComponent } from './components/platform-agreement.component';

@NgModule({
  declarations: [
    PlatformAgreementComponent,
  ],
  imports: [
    PlatformAgreementRouting,
    TranslateModule
  ],
})

export class PlatformAgreementModule { }
