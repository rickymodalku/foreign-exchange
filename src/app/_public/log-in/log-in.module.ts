// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';

import { LogInRouting } from './log-in.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material';

import { LogInComponent } from './components/log-in.component';
import { TwoFaModule } from '../../components/two-fa/two-fa.module';
import { TimerLoginComponent } from '../../components/timer-login.component';
import { TranslateModule } from '@ngx-translate/core';


import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    LogInComponent,
    TimerLoginComponent
  ],
  imports: [
    TwoFaModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    CommonModule,
    SharedModule,
    LogInRouting,
  ],
})

export class LogInModule { }
