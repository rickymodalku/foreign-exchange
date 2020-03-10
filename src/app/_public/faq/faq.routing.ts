import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { FaqComponent } from './components/faq.component';

const ROUTES: Routes = [
    {
        path: '',
        component: FaqComponent
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


export class FaqRouting { }