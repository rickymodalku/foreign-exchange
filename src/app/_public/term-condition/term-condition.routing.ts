import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { TermConditionComponent } from './components/term-condition.component';

const ROUTES: Routes = [
    {
        path: '',
        component: TermConditionComponent
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


export class TermConditionRouting { }