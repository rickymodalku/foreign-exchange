// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CheckEligibilityRouting } from './check-eligibility.routing';
import { CheckEligibilityComponent } from './components/check-eligibility.component';
import { CommonModule } from '@angular/common';
import { MatSelectModule, MatCheckboxModule, } from '@angular/material';
import { SharedModule } from '../../shared.module';
import { TwoFaModule } from '../../components/two-fa/two-fa.module';

@NgModule({
  declarations: [
    CheckEligibilityComponent
  ],
  imports: [
    CheckEligibilityRouting,
    TranslateModule,
    CommonModule,
    MatCheckboxModule,
    MatSelectModule,
    SharedModule,
    TwoFaModule,
  ],
})

export class CheckEligibilityModule { }
