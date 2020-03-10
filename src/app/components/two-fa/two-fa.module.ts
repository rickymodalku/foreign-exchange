// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalModule
} from '../modal/modal.module';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TwoFaCommonComponent } from './two-fa-common/two-fa-common.component';
import { TwoFaPhoneNumberComponent } from './two-fa-phone-number/two-fa-phone-number.component';
import { TwoFaSetupComponent } from './two-fa-setup/two-fa-setup.component';
import { TelInputDirective } from '../../directives/tel-input.directive';
import { RouterModule } from '@angular/router';
import { IntTelpInputComponent } from '../../components/int-telp-input/int-telp-input.component';


@NgModule({
  declarations: [
    TwoFaCommonComponent,
    TwoFaPhoneNumberComponent,
    TelInputDirective,
    TwoFaSetupComponent,
    IntTelpInputComponent
  ],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ModalModule,
    RouterModule,
  ],
  exports: [
    TwoFaCommonComponent,
    TwoFaPhoneNumberComponent,
    TwoFaSetupComponent,
    IntTelpInputComponent
  ]
})

export class TwoFaModule { }
