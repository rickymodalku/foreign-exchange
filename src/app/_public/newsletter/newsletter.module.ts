// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NewsletterComponent } from './components/newsletter.component';

@NgModule({
    declarations: [
        NewsletterComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        CommonModule,
    ],
    exports: [
        NewsletterComponent,
    ]
})

export class NewsletterModule { }