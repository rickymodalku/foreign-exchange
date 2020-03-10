import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { WebsiteTermsComponent } from './components/website-terms.component';

const ROUTES: Routes = [
    {
        path: '',
        component: WebsiteTermsComponent
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


export class WebsiteTermsRouting { }
