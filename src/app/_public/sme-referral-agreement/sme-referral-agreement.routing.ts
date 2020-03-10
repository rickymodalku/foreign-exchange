import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { SMEReferrealAgreementComponent } from './components/sme-referral-agreement.component';

const ROUTES: Routes = [
    {
        path: '',
        component: SMEReferrealAgreementComponent
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


export class SMEReferrealAgreementRouting { }
