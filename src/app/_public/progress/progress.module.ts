// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { ChartModule } from 'angular2-highcharts';
import { ProgressRouting } from './progress.routing';
import { TranslateModule } from '@ngx-translate/core';

import { ProgressComponent } from './components/progress.component';
import { ProgressSGComponent } from './components/progress-sg.component';
import { ProgressMYComponent } from './components/progress-my.component';
import { ProgressIDComponent } from './components/progress-id.component';

@NgModule({
    declarations: [
        ProgressComponent,
        ProgressIDComponent,
        ProgressSGComponent,
        ProgressMYComponent,
    ],
    imports: [
        ProgressRouting,
        ChartModule,
        SwiperModule,
        TranslateModule
    ],
})

export class ProgressModule { }
