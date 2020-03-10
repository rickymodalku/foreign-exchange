// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';

import { AccordionModule } from 'primeng/primeng';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { ReferralDashBoardRouting } from './referral-dashboard.routing';
import { SharedModule } from '../../../shared.module';
import { NewsletterModule } from '../../newsletter/newsletter.module';

import { ReferralDashboardComponent } from './components/referral-dashboard.component';

@NgModule({
    declarations: [
        ReferralDashboardComponent
    ],
    imports: [
        AccordionModule,
        ReferralDashBoardRouting,
        NewsletterModule,
        SharedModule,
        SwiperModule
    ],
})

export class ReferralDashboardModule { }