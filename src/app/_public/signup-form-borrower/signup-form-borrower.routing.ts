import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { SignupFormBorrowerComponent } from './components/signup-form-borrower.component';

const ROUTES: Routes = [
    {
        path: '',
        component: SignupFormBorrowerComponent
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


export class SignupFormBorrowerRouting { }