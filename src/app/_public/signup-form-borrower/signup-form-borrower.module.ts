// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import {
  MatSelectModule,
  MatCheckboxModule,
  MatRadioModule
} from '@angular/material';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/primeng';

import { CommonModule } from '@angular/common';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SignupFormBorrowerRouting } from './signup-form-borrower.routing';

import { SignupFormBorrowerComponent } from './components/signup-form-borrower.component';
import { ModalModule } from '../../components/modal/modal.module';
import { TwoFaModule } from '../../components/two-fa/two-fa.module';
import { SharedModule } from './../../shared.module';

@NgModule({
  declarations: [
    SignupFormBorrowerComponent
  ],
  imports: [
    SignupFormBorrowerRouting,
    DropzoneModule,
    CalendarModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    SwiperModule,
    TranslateModule,
    ModalModule,
    TwoFaModule,
    SharedModule
  ],
})

export class SignupFormBorrowerModule { }
