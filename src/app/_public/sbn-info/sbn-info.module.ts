// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'ngx-swiper-wrapper';

import { SbnInfoRouting } from './sbn-info.routing';

import { SbnInfoComponent } from './components/sbn-info.component';

import { ModalModule } from '../../components/modal/modal.module';

@NgModule({
  declarations: [
    SbnInfoComponent
  ],
  imports: [
    SbnInfoRouting,
    SwiperModule,
    TranslateModule,
    ModalModule
  ],
})

export class SbnInfoModule { }
