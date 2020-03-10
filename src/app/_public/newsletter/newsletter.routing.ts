import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { NewsletterComponent } from './components/newsletter.component';

const ROUTES: Routes = [
    {
        path: '',
        component: NewsletterComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES)
    ],
    exports: [
        RouterModule
    ]
})


export class NewsletterRouting { }