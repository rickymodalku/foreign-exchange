// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Rdp2pTermConditionRouting } from './rdp2p-term-condition.routing';

import { Rdp2pTermConditionComponent } from './components/rdp2p-term-condition.component';

import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    Rdp2pTermConditionComponent,
  ],
  imports: [
    Rdp2pTermConditionRouting,
    TranslateModule,
    CommonModule
  ],

})

export class Rdp2pTermConditionModule { }
