// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';

import { AccordionModule } from 'primeng/primeng';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { BorrowerDashBoardRouting } from './borrower-dashboard.routing';
import { SharedModule } from '../../../shared.module';
import { NewsletterModule } from '../../newsletter/newsletter.module';
import { MatSelectModule } from '@angular/material';

import { BorrowerDashboardComponent } from './components/borrower-dashboard.component';

@NgModule({
    declarations: [
        BorrowerDashboardComponent
    ],
    imports: [
        AccordionModule,
        BorrowerDashBoardRouting,
        NewsletterModule,
        SharedModule,
        SwiperModule,
        MatSelectModule
    ],
})

export class BorrowerDashboardModule { }
