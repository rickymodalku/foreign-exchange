
import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { RiskDisclosureComponent } from './components/risk-disclosure.component';

const ROUTES: Routes = [
    {
        path: '',
        component: RiskDisclosureComponent
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


export class RiskDisclosureRouting { }
