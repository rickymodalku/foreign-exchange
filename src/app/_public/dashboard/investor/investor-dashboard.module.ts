
// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { AccordionModule } from 'primeng/primeng';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InvestorDashBoardRouting } from './investor-dashboard.routing';
import { SharedModule } from '../../../shared.module';
import { NewsletterModule } from '../../newsletter/newsletter.module';

import { InvestorDashboardComponent } from './components/investor-dashboard.component';

@NgModule({
    declarations: [
        InvestorDashboardComponent
    ],
    imports: [
        AccordionModule,
        InvestorDashBoardRouting,
        NewsletterModule,
        SharedModule,
        SwiperModule
    ],
})

export class InvestorDashboardModule { }