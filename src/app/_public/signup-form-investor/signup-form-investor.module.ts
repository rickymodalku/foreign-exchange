// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import {
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule
} from '@angular/material';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SignupFormInvestorRouting } from './signup-form-investor.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {
    CalendarModule,
  } from 'primeng/primeng';

import {CommonModule} from '@angular/common';
import {ModalModule} from '../../components/modal/modal.module';

import { SignupFormInvestorComponent } from './components/signup-form-investor.component';
import { TwoFaModule } from '../../components/two-fa/two-fa.module';
import { SharedModule } from './../../shared.module';

@NgModule({
    declarations: [
        SignupFormInvestorComponent
    ],
    imports: [
        SignupFormInvestorRouting,
        DropzoneModule,
        CalendarModule,
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatSelectModule,
        MatRadioModule,
        SwiperModule,
        ModalModule,
        TwoFaModule,
        SharedModule
    ],
})

export class SignupFormInvestorModule { }
