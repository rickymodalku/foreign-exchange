import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { SignupFormInvestorComponent } from './components/signup-form-investor.component';

const ROUTES: Routes = [
    {
        path: '',
        component: SignupFormInvestorComponent
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


export class SignupFormInvestorRouting { }