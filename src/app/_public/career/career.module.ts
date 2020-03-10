// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NewsletterModule } from '../newsletter/newsletter.module';

import { CareerRouting } from './career.routing';

import { CareerComponent } from './components/career.component';
import { CommonModule } from '@angular/common';

import {
  ModalModule
} from '../../components/modal/modal.module';

@NgModule({
    declarations: [
        CareerComponent,
    ],
    imports: [
        CareerRouting,
        NewsletterModule,
        TranslateModule,
        CommonModule,
        ModalModule
    ],
})

export class CareerModule { }
