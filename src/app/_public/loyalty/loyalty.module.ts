// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { LoyaltyComponent } from './components/loyalty.component';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { LoyaltyRouting } from './loyalty.routing';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        LoyaltyComponent,
    ],
    imports: [
        TranslateModule,
        CommonModule,
        SwiperModule,
        LoyaltyRouting
    ],
})

export class LoyaltyModule { }
