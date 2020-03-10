import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { AllocationPolicyComponent } from './components/allocation-policy.component';

const ROUTES: Routes = [
    {
        path: '',
        component: AllocationPolicyComponent
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


export class AllocationPolicyRouting { }
