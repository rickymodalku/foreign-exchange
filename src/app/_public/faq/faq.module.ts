// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { StickDirective } from '../../directives/stick.directive';

import { FaqRouting } from './faq.routing';
import { Ng2CompleterModule } from 'ng2-completer';
import { FormsModule } from '@angular/forms';
import { NewsletterModule } from '../newsletter/newsletter.module';

import { FaqComponent } from './components/faq.component';
import { TranslateModule } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        StickDirective,
        FaqComponent,
    ],
    imports: [
        TranslateModule,
        NewsletterModule,
        Ng2CompleterModule,
        FormsModule,
        CommonModule,
        FaqRouting,
    ],
})

export class FaqModule { }