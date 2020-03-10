// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { AboutUsRouting } from './about-us.routing';
import { SharedModule } from '../../shared.module';
import { NewsletterModule } from '../newsletter/newsletter.module';

import { AboutUsComponent } from './components/about-us.component';

@NgModule({
    declarations: [
        AboutUsComponent,
    ],
    imports: [
        AboutUsRouting,
        SharedModule,
        SwiperModule,
        NewsletterModule
    ],
})

export class AboutUsModule { }