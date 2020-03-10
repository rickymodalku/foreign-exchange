// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ForgotPasswordRouting } from './forgot-password.routing';
import { ForgotPasswordComponent } from './components/forgot-password.component';
import { CommonModule } from '@angular/common';
import { MatSelectModule, MatCheckboxModule, } from '@angular/material';
import { SharedModule } from '../../shared.module';
import { TwoFaModule } from '../../components/two-fa/two-fa.module';

@NgModule({
  declarations: [
    ForgotPasswordComponent
  ],
  imports: [
    ForgotPasswordRouting,
    TranslateModule,
    CommonModule,
    MatCheckboxModule,
    MatSelectModule,
    SharedModule,
    TwoFaModule,
  ],
})

export class ForgotPasswordModule { }
