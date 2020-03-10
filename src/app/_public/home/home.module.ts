// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import {
    MatSelectModule,
    MatCheckboxModule,
} from '@angular/material';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { HomeRouting } from './home.routing';
import { SharedModule } from '../../shared.module';
import { NewsletterModule } from '../newsletter/newsletter.module';

import { HomeComponent } from './components/home.component';
import { TwoFaModule } from '../../components/two-fa/two-fa.module';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        HomeRouting,
        NewsletterModule,
        MatCheckboxModule,
        MatSelectModule,
        SharedModule,
        SwiperModule,
        TwoFaModule
    ],
})

export class HomeModule { }
