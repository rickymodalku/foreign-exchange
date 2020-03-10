// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SignUpRouting } from './sign-up.routing';
import { SignUpComponent } from './components/sign-up.component';
import { CommonModule } from '@angular/common';
import { MatSelectModule, MatCheckboxModule, } from '@angular/material';
import { SharedModule } from '../../shared.module';
import { TwoFaModule } from '../../components/two-fa/two-fa.module';

@NgModule({
  declarations: [
    SignUpComponent
  ],
  imports: [
    SignUpRouting,
    TranslateModule,
    CommonModule,
    MatCheckboxModule,
    MatSelectModule,
    SharedModule,
    TwoFaModule,
  ],
})

export class SignUpModule { }
